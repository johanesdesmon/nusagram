from flask import Flask, render_template, request, redirect, url_for
from pymongo import MongoClient

app = Flask(__name__)

mongo_uri = 'mongodb+srv://nusyoman:manis@cluster0.wjeaswn.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(mongo_uri)
db = client['dbsparta_plus_week4']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('username')  # Mengganti 'name' menjadi 'username'
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        if password != confirm_password:
            return "Password tidak sesuai dengan konfirmasi password"

        user_data = {'name': name, 'password': password}  # Menghapus 'email' dari data pengguna
        db.users.insert_one(user_data)

        return redirect(url_for('index'))

    return render_template('register.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    user = db.users.find_one({'name': username, 'password': password})

    if user:
        return "Login berhasil!"
    else:
        return "Login gagal. Periksa kembali username dan password."

if __name__ == '__main__':
    app.run(debug=True)
