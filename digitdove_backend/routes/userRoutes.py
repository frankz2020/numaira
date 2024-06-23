from flask import request, jsonify, Blueprint
from config import app, db
from models import User

userRoutes = Blueprint('userRoutes', __name__)

@userRoutes.route('/all', methods=['GET'])
def get_users(): 
    users = User.query.all()
    return jsonify([user.serialize() for user in users])

@userRoutes.route('/add', methods=['POST'])
def add_user():
    data = request.get_json()
    if not data['username'] or not data['email']:
        return jsonify({'message': 'Some data is missing'}), 400
    new_user = User(username=data['username'], email=data['email'])
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 500

    return jsonify(new_user.serialize()), 201

@userRoutes.route("/update/<int:id>", methods=['PUT'])
def updateUser(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    data = request.get_json()
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    try:
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    return jsonify(user.serialize())

@userRoutes.route("/delete/<int:id>", methods=['DELETE'])
def deleteUser(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})
  
