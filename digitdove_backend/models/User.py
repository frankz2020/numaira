from config import db
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from config import login_manager
from models.SyncSpace import SyncSpace
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # One-to-Many relationship with SyncSpace
    syncspaces = db.relationship('SyncSpace', backref='user', lazy=True)

    def __repr__(self):
        return '<User %r>' % self.username
    
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email

        }
    
    @login_manager.user_loader
    def load_user(user_id):
        print("loading user with id")
        return User.query.get(int(user_id))
    

    def get_id(self):
        return str(self.id)
