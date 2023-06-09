# /usr/bin/env python
# -*- coding: utf-8 -*-
import os
import certifi
from bson.objectid import ObjectId
from pymongo import MongoClient
from flask import Flask, render_template, request, jsonify
import hashlib
import jwt
import datetime


app = Flask(__name__)
ca = certifi.where()
client = MongoClient(
    "mongodb+srv://sparta:test@cluster0.g85ftsp.mongodb.net/?retryWrites=true&w=majority",
    tlsCAFile=ca,
)
db = client.dbsparta

SECRET_KEY = "abc"

# api
@app.route("/")
def home():
    return render_template("join.html")


# sign-up apis
@app.route("/join", methods=["GET", "POST"])
def join():
    if request.method == "POST":
        id = request.form["id"]
        nickname = request.form["nickname"]
        password = request.form["password"]

        #  아이디 중복 검사
        if db.pjs.find_one({"id": id}):
            return jsonify({"message": "이미 존재하는 아이디입니다."})

        # 랜덤 솔트 값 생성
        salt = os.urandom(16)

        # 솔트랑 비번 합쳐서 해싱/ Encode로 bytes obj 만들어서 해싱하고 다시 16진수 스트링으로 변환(hexdigest())
        hashed_password = hashlib.sha256(password.encode() + salt).hexdigest()

        doc = {
            "id": id,
            "nickname": nickname,
            "salt": salt,
            "password": hashed_password,
        }
        db.pjs.insert_one(doc)

        # return redirect(url_for('home'))
        return jsonify({"message": "가입 완료"})
    else:
        return render_template("join.html")


# login apis - old
# @app.route("/login", methods=["GET"])
# def show_login_page():
#    return render_template("login.html")
#
#
# @app.route("/login", methods=["POST"])
# def login():
#    username_receive = request.form["username_give"]
#    password_receive = request.form["password_give"]
#    user = db.pjs.find_one({"id": username_receive})
#    if user is not None:
#        salt = user["salt"]
#        hashed_password = hashlib.sha256(password_receive.encode() + salt).hexdigest()
#        if user["password"] == hashed_password:
#            return jsonify({"result": "success"})
#    return jsonify({"result": "fail", "msg": "아이디와 비밀번호가 일치하지 않습니다."})

# index api
@app.route("/index")
def show_index() :
    return render_template('index.html')

# login apis
@app.route("/login", methods=["GET"])
def show_login_page():
    return render_template("login.html")

@app.route("/login", methods=["POST"])
def login():
    username_receive = request.form["username_give"]
    password_receive = request.form["password_give"]
    user = db.pjs.find_one({"id": username_receive})

    if user is not None:
        salt = user["salt"]
        hashed_password = hashlib.sha256(password_receive.encode() + salt).hexdigest()
    if user["password"] == hashed_password:
        payload = {
            "id": username_receive,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return jsonify({"result": "success", "token": token, "id": payload["id"]})
    return jsonify({"result": "fail", "msg": "아이디와 비밀번호가 일치하지 않습니다."})


# Test token route
@app.route("/api/test_token", methods=["POST"])
def test_token():
    token = request.headers.get("Authorization").split(" ")[1]
    print(token)
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"message": "Token is valid", "user": data["id"]})
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401


@app.route("/user_list", methods=["GET"])
def userlisting():
    users = list(db.pjs.find({}, {"_id": False}))
    return jsonify({"result": users})


# timer apis
@app.route("/timer", methods=["GET"])
def timer_get():
    all_timer = list(db.jjm.find({}, {"_id": False}))
    return jsonify({"result": all_timer})


@app.route("/attend", methods=["GET"])
def attend_get():
    all_attend = list(db.attend.find({}, {"_id": False}))
    return jsonify({"result": all_attend})


@app.route("/timer", methods=["POST"])
def timer_post():
    timer_receive = request.form["timer_give"]
    doc = {"timer": timer_receive}
    db.jjm.insert_one(doc)
    return jsonify({"msg": "저장 완료!"})


@app.route("/attend", methods=["POST"])
def attend_post():
    attend_receive = request.form["attend_give"]
    doc = {"attend": attend_receive}
    db.attend.insert_one(doc)
    return jsonify({"msg": "출석 완료!"})


# todo apis
@app.route("/todo", methods=["POST"])
def todo_post():
    todo_receive = request.form["todo_give"]
    todo_finish = request.form["is_finish"]

    doc = {"todo": todo_receive, "is_finish": todo_finish}
    db.todolist.insert_one(doc)
    return jsonify({"msg": "저장 완료!"})


@app.route("/todo", methods=["GET"])
def todo_get():
    comments = list(db.todolist.find())
    comments = [{**comment, **{"_id": str(comment["_id"])}} for comment in comments]
    return jsonify({"result": comments})


@app.route("/todo", methods=["DELETE"])
def todo_delete():
    delete_receive = request.form["id"]
    db.todolist.delete_one({"_id": ObjectId(delete_receive)})
    return jsonify({"msg": "삭제 완료!"})


@app.route("/todo", methods=["PUT"])
def todo_update():
    id_receive = request.form["id"]
    new_todo = request.form["new_todo"]
    isfinish = request.form["is_finish"]  # todo 완료 상태 확인

    db.todolist.update_one(
        {"_id": ObjectId(id_receive)},
        {"$set": {"todo": new_todo, "is_finish": isfinish}},
    )
    return jsonify({"msg": "수정 완료!"})


if __name__ == "__main__":
    app.run("0.0.0.0", port=5001, debug=True)
