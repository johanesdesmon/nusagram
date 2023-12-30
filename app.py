from pymongo import MongoClient
import jwt
import datetime
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import certifi


ca = certifi.where()


app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["UPLOAD_FOLDER"] = "./static/profile_pics"

SECRET_KEY = "MINIGRAM"

MONGODB_CONNECTION_STRING = (
    # "mongodb://lxfarhan:test@ac-xafbpj1-shard-00-00.q0qvbkc.mongodb.net:27017,ac-xafbpj1-shard-00-01.q0qvbkc.mongodb.net:27017,ac-xafbpj1-shard-00-02.q0qvbkc.mongodb.net:27017/?ssl=true&replicaSet=atlas-erdgvk-shard-0&authSource=admin&retryWrites=true&w=majority"
    "mongodb+srv://ncc1477:Qwedsa123!@cluster0.kkwb2cl.mongodb.net"
)
client = MongoClient(MONGODB_CONNECTION_STRING, tlsCAFile=ca)
db = client.nusagram


@app.route("/")
def inihome():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        user_info = db.users.find_one({"username": payload["id"]})
        return render_template("home.html", user_info=user_info)
        # return render_template("index.html")
    except jwt.ExpiredSignatureError:
        return redirect(url_for("login", msg="Your token has expired"))
    except jwt.exceptions.DecodeError:
        return redirect(url_for("login", msg="anda harus login dulu"))

# @app.route("/")
# def home():
#     token_receive = request.cookies.get("mytoken")
#     try:
#         payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
#         user_info = db.users.find_one({"username": payload["id"]})
#         return render_template("home.html", user_info=user_info)
#         # return render_template("index.html")
#     except jwt.ExpiredSignatureError:
#         return redirect(url_for("login", msg="Your token has expired"))
#     except jwt.exceptions.DecodeError:
#         return redirect(url_for("login", msg="anda harus login dulu"))



@app.route("/login")
def login():
    msg = request.args.get("msg")
    return render_template("login.html", msg=msg)


@app.route("/user/<username>")
def user(username):
    # an endpoint for retrieving a user's profile information
    # and all of their posts
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        # if this is my own profile, True
        # if this is somebody else's profile, False
        status = username == payload["id"]

        user_info = db.users.find_one({"username": username}, {"_id": False})
        return render_template("user.html", user_info=user_info, status=status)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("/"))

@app.route("/users/<username>")
def users(username):
    # an endpoint for retrieving a user's profile information
    # and all of their posts
        # if this is my own profile, True
        # if this is somebody else's profile, False

    user_info = db.users.find_one({"username": username}, {"_id": False})
    return render_template("users.html", user_info=user_info)
# @app.route("/anonmsg", methods=["POST"])

@app.route("/anonmsg/", methods=["POST"])
def anonmsg():
        # user_info = db.users.find_one({"username": username}, {"_id": False})
        username_receive = request.form["username_give"]
        comment_receive = request.form["comment_give"]
        date_receive = request.form["date_give"]
        print(username_receive)


        doc = {
            "username": username_receive,
            "comment": comment_receive,
            "date": date_receive,
        }
        db.anonmsg.insert_one(doc)
        return jsonify({"result": "success", "msg": "Posting successful!"})


@app.route("/sign_in", methods=["POST"])
def sign_in():
    # Sign in
    username_receive = request.form["username_give"]
    password_receive = request.form["password_give"]
    pw_hash = hashlib.sha256(password_receive.encode("utf-8")).hexdigest()
    result = db.users.find_one(
        {
            "username": username_receive,
            "password": pw_hash,
        }
    )
    if result:
        payload = {
            "id": username_receive,
            # the token will be valid for 24 hours
            "exp": datetime.utcnow() + timedelta(seconds=60 * 60 * 24),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256").decode("utf-8")

        return jsonify(
            {
                "result": "success",
                "token": token,
            }
        )
    # Let's also handle the case where the id and
    # password combination cannot be found
    else:
        return jsonify(
            {
                "result": "fail",
                "msg": "We could not find a user with that id/password combination",
            }
        )


@app.route("/sign_up/save", methods=["POST"])
def sign_up():
    username_receive = request.form["username_give"]
    password_receive = request.form["password_give"]
    password_hash = hashlib.sha256(password_receive.encode("utf-8")).hexdigest()
    doc = {
        "username": username_receive,  # id
        "password": password_hash,  # password
        "profile_name": username_receive,  # user's name is set to their id by default
        "profile_pic": "",  # profile image file name
        "profile_pic_real": "profile_pics/profile_placeholder.png",  # a default profile image
        "profile_info": "",  # a profile description
    }
    db.users.insert_one(doc)
    return jsonify({"result": "success"})


@app.route("/sign_up/check_dup", methods=["POST"])
def check_dup():
    username_receive = request.form["username_give"]
    exists = bool(db.users.find_one({"username": username_receive}))
    return jsonify({"result": "success", "exists": exists})


@app.route("/update_profile", methods=["POST"])
def save_img():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        
        # Kita update profil user disini
        username = payload["id"]
        name_receive = request.form["name_give"]
        about_receive = request.form["about_give"]
        new_doc = {"profile_name": name_receive, "profile_info": about_receive}
        new_path = {"profile_name": name_receive}
        if "file_give" in request.files:
            file = request.files["file_give"]
            filename = secure_filename(file.filename)
            extension = filename.split(".")[-1]
            file_path = f"profile_pics/{username}.{extension}"
            file.save("./static/" + file_path)
            new_doc["profile_pic"] = filename
            new_doc["profile_pic_real"] = file_path
            new_path["profile_pic_real"] = file_path
           
        db.users.update_one({"username": payload["id"]}, {"$set": new_doc})
        db.posts.update_many({"username": payload["id"]}, {"$set": new_path})

        return jsonify({"result": "success", "msg": "Your profile has been updated"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("/"))


@app.route("/posting", methods=["POST"])
def posting():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        # We should create a new post here
        user_info = db.users.find_one({"username": payload["id"]})
        comment_receive = request.form["comment_give"]
        date_receive = request.form["date_give"]

        today = datetime.now()
        mytime = today.strftime('%Y-%m-%d-%H-%M-%S')
        file = request.files['file_give']
        extension = file.filename.split('.')[-1]
        filename = f'static/feed/post-{mytime}.{extension}'
        file.save(filename)

        doc = {
            "username": user_info["username"],
            "profile_name": user_info["profile_name"],
            "profile_pic_real": user_info["profile_pic_real"],
            "comment": comment_receive,
            "date": date_receive,
            "foto":filename
        }
        db.posts.insert_one(doc)
        return jsonify({"result": "success", "msg": "Posting successful!"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("/"))



@app.route("/get_posts", methods=["GET"])
def get_posts():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])

        username_receive = request.args.get("username_give")
        if username_receive == "":
            posts = list(db.posts.find({}).sort("date", -1).limit(20))
        else:
            posts = list(
                db.posts.find({"username": username_receive}).sort("date", -1).limit(20)
            )

        for post in posts:
            post["_id"] = str(post["_id"])
            post["count_heart"] = db.likes.count_documents(
                {"post_id": post["_id"], "type": "heart"}
            )
            
            post["count_star"] = db.likes.count_documents(
                {"post_id": post["_id"], "type": "star"}
            )
            
            post["count_thumbsup"] = db.likes.count_documents(
                {"post_id": post["_id"], "type": "thumbsup"}
            )
            
            post["heart_by_me"] = bool(
                db.likes.find_one(
                    {"post_id": post["_id"], "type": "heart", "username": payload["id"]}
                )
            )
            
            post["star_by_me"] = bool(
                db.likes.find_one(
                    {"post_id": post["_id"], "type": "star", "username": payload["id"]}
                )
            )

            
            post["thumbsup_by_me"] = bool(
                db.likes.find_one(
                    {"post_id": post["_id"], "type": "thumbsup", "username": payload["id"]}
                )
            )
        return jsonify(
            {
                "result": "success",
                "msg": "Successful fetched all posts",
                "posts": posts,
            }
        )
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route("/get_profile", methods=["GET"])
def get_profile():
    usersprofile = list(db.users.find({}, {'_id': 0}))

    return jsonify(
            {
                "result": "success",
                "msg": "Successful fetched all posts",
                "usersprofile": usersprofile,
            }
    )

@app.route("/get_anonmsg", methods=["GET"])
def get_anonmsg():
    username_receive = request.args.get("username_give")
    if username_receive == "":
        anonmsg = list(db.posts.find({}).sort("date", -1).limit(20))
    else:
        anonmsg = list(
        db.anonmsg.find({"username": username_receive}).sort("date", -1).limit(20)
        )


    for msg in anonmsg:
            msg["_id"] = str(msg["_id"])
            
    return jsonify(
            {
                "result": "success",
                "msg": "Successful fetched all posts",
                "anonmsg": anonmsg,
            }
    )
@app.route("/update_like", methods=["POST"])
def update_like():
    token_receive = request.cookies.get("mytoken")
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        # We should change the like count for the post here
        user_info = db.users.find_one({"username": payload["id"]})
        post_id_receive = request.form["post_id_give"]
        type_receive = request.form["type_give"]
        action_receive = request.form["action_give"]
        doc = {
            "post_id": post_id_receive,
            "username": user_info["username"],
            "type": type_receive,
        }
        if action_receive == "like":
            db.likes.insert_one(doc)
        else:
            db.likes.delete_one(doc)
        count = db.likes.count_documents(
            {"post_id": post_id_receive, "type": type_receive}
        )
        return jsonify({"result": "success", "msg": "updated", "count": count})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("home"))


@app.route("/about", methods=["GET"])
def about():
    return render_template("about.html")


# @app.route("/secret", methods=["GET"])
# def secret():
#     token_receive = request.cookies.get('mytoken')
#     try:
#         payload = jwt.decode(
#             token_receive,
#             SECRET_KEY,
#             algorithms=['HS256']
#         )
#         user_info = db.users.find_one({'username' : payload.get('id')})
#         msg = 'Anda Telah Login sebagai'
#         return render_template("secret.html", user_info=user_info, msg=msg)
#     except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
#         return redirect(url_for('home'))

@app.route("/about", methods=['GET'])
def iniabout():
    return render_template('about.html')

@app.route('/feedback')
def home():
   return render_template('feedback.html')

@app.route("/bucket", methods=["POST"])
def bucket_post():
    bucket_receive = request.form['bucket_give']
    count = db.bucket.count_documents({})
    num = count + 1
    doc = {
        'num' : num,
        'bucket' : bucket_receive,
        'done' : 0
    }
    db.bucket.insert_one(doc)
    return jsonify({'msg': 'data saved '})

@app.route("/bucket/done", methods=["POST"])
def bucket_done():
    num_receive = request.form['num_give']
    db.bucket.update_one(
        {'num' : int(num_receive) },
        {'$set' : {'done' : 1}}
    )
    return jsonify({'msg': 'Update done request!'})

@app.route("/bucket/delete", methods=["POST"])
def bucket_delete():
    num_receive = request.form['num_give']
    db.bucket.delete_one({'num': int(num_receive)})
    return jsonify({'msg': 'Delete done'})

@app.route("/bucket", methods=["GET"])
def bucket_get():
    bucket_list = list(db.bucket.find({},{'_id' : False}))
    return jsonify({'buckets': bucket_list})

@app.route("/add_comment_post", methods=["POST"])
def add_comment_post():
    post_id_receive = request.form["post_id_give"]
    username_receive = request.form["username_give"]
    comment_receive = request.form["comment_give"]
    date_receive = request.form["date_give"]

    doc = {
        "post_id": post_id_receive,
        "username": username_receive,
        "comment": comment_receive,
        "date": date_receive,
       }

    db.comments_posts.insert_one(doc)
    return jsonify({"result": "success", "msg": "Comment added successfully!"})

@app.route("/get_comments_post", methods=["GET"])
def get_comments_post():
    post_id_receive = request.args.get("post_id_give")
    print (post_id_receive)

    # Ambil komentar-komentar dari database berdasarkan post_id
    comments = list(db.comments_posts.find({"post_id": post_id_receive}))

    for comment in comments:
        # Optional: Modifikasi data komentar jika diperlukan sebelum dikirim ke klien
        comment["_id"] = str(comment["_id"])  # Ubah ObjectId menjadi string, jika diperlukan

    return jsonify({"result": "success", "comments": comments})



@app.route("/add_comment", methods=["POST"])
def add_comment():
    post_id_receive = request.form["post_id_give"]
    comment_receive = request.form["comment_give"]
    date_receive = request.form["date_give"]

    doc = {
        "post_id": post_id_receive,
        "comment": comment_receive,
        "date": date_receive,
       }

    db.comments.insert_one(doc)
    return jsonify({"result": "success", "msg": "Comment added successfully!"})


@app.route("/get_comments", methods=["GET"])
def get_comments():
    post_id_receive = request.args.get("post_id_give")
    print (post_id_receive)

    # Ambil komentar-komentar dari database berdasarkan post_id
    comments = list(db.comments.find({"post_id": post_id_receive}))

    for comment in comments:
        # Optional: Modifikasi data komentar jika diperlukan sebelum dikirim ke klien
        comment["_id"] = str(comment["_id"])  # Ubah ObjectId menjadi string, jika diperlukan

    return jsonify({"result": "success", "comments": comments})


if __name__ == "__main__":
    app.run("0.0.0.0", port=5000, debug=True)
