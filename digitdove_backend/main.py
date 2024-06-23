from flask import request, jsonify
from config import app, db
from models import User
from routes.userRoutes import userRoutes

@app.route('/', methods=['GET'])
def home():
    print("hit home route")
    return jsonify({'message': 'Hello, World!'})
if __name__ == '__main__':
    
    with app.app_context():
        # create database if not exsited
        db.create_all()
    app.register_blueprint(userRoutes, url_prefix='/user')
    app.run(debug=True)

