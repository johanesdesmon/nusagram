from flask import Flask, render_template, request, redirect, url_for
from pymongo import MongoClient

app = Flask(__name__)

# Ganti URL MongoDB Anda
mongo_uri = 'mongodb+srv://nusyoman:manis@cluster0.wjeaswn.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri)
db = client['dbsparta_plus_week4']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')

    user_data = {'name': name, 'email': email, 'password': password}
    db.users.insert_one(user_data)

    return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    user = db.users.find_one({'email': email, 'password': password})

    if user:
        return "Login berhasil!"
    else:
        return "Login gagal. Periksa kembali username dan password."

if __name__ == '__main__':
    app.run(debug=True)
