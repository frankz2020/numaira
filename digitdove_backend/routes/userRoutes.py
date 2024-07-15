from flask import request, jsonify, Blueprint
from config import app, db
from models.User import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

userRoutes = Blueprint('userRoutes', __name__)

@userRoutes.route('/all', methods=['GET'])
def get_users(): 
    users = User.query.all()
    return jsonify([user.serialize() for user in users])

@userRoutes.route('/register', methods=['POST'])
def add_user():
    data = request.get_json()
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Some data is missing'}), 400

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=16)
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 500

    return jsonify(new_user.serialize()), 201



@userRoutes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Some data is missing'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        print('logged in')
        login_user(user, remember=True)
        return jsonify({'message': 'Login successful', 'user': user.serialize()}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    

@userRoutes.route('/logout', methods=['GET'])
@login_required # this add protection to the route to be only logged in user to be able to access
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


@userRoutes.route('/current_user', methods=['GET'])
def get_current_user():
    print(current_user)
    if current_user.is_authenticated:
        return jsonify({'user': current_user.serialize()}), 200
    else:
        print("no user logged in")
        return jsonify({'message': 'No user is currently logged in'}), 401



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
  
