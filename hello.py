from flask import Flask, render_template, request, session, url_for, redirect, jsonify, make_response
from flask_session import Session
from markupsafe import escape
import json

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import os

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")


app = Flask(__name__)
app.secret_key = b'\xe3\xb0\xda\xc4\x9f\xc9\xb3j\xcbvr\x03\xbec\x98\xad'


# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


@app.route("/new_election", methods=["GET", "POST"])
def new_election():
    if request.method == "POST":
        print(data)
        data = request.data
        date = request["date"]
    try:
        db.execute(f"INSERT")
        return make_response(jsonify({"message": "Internal server error"}), 201)
    except:
        return make_response(jsonify({"message": "Internal server error"}), 401)
    return render_template("index.html")


# Remove redundant code!
@app.route('/')
def index():
    if "username" not in session.keys():
        return redirect(url_for('login'))
    elif session["username"] == None:
            return redirect(url_for('login'))
    else:
        return render_template("index.html")



@app.route("/login", methods=['POST', 'GET'])
def login():
    if request.method == "POST":
        if valid_login(request.form['username'], request.form['password']):
            return redirect(url_for('index'))
        else:
            return render_template("login.html", msg="Invalid username and/or password.")
    elif "username" in session.keys() and session['username'] != None:
        return redirect(url_for('index'))
    else:
        return render_template("login.html")


# Remove redundant code!
@app.route("/register", methods=['POST', 'GET'])
def register():
    if request.method == "POST":
        username = escape(request.form["username"])
        email = escape(request.form["email"])
        password = escape(request.form["password"])
        confirm = escape(request.form["confirmation"])
        if confirm != password:
            return render_template("register.html", msg="Password does not match.")
        if check_existing_user(username) and create_user(username, email, password):
            valid_login(username, password)
            return redirect(url_for("index"))
        return render_template("register.html", msg="Please try again")
    return render_template("register.html")


def check_existing_user(username):
    try: 
        data = db.execute(f"SELECT username FROM users WHERE username='{username}';").fetchall()
        if len(data) == 0:
            return True
    except Exception as e:
        print(e)
    return False


def valid_login(username, password):
    print("Login creds", username, password)
    username = escape(username)
    password = escape(password)
    data = db.execute(f"SELECT user_id, username, email, password FROM users WHERE username='{username}';").fetchall()
    if len(data) != 0 and data[0][3] == password:
        session["user_id"] = data[0][0]
        session["username"] = data[0][1]
        session["email"] = data[0][2]
        return True 
    return False


def create_user(username, email, password):
    try:
        db.execute("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)", {"username": username, "email": email, "password": password})
        db.commit() 
        return redirect(url_for("index"))
    except Exception as e:
        print(e)
        return render_template("register.html", msg="Please try again")
    return render_template("register.html")

@app.route("/logout")
def logout():
   session["user_id"] = None
   session["username"] = None
   session["email"] = None
   return redirect(url_for("index"))

if __name__ == '__main__':
   app.run()
