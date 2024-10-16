from config import db
from datetime import datetime

class SyncSpace(db.Model):
    __tablename__ = 'sync_space'  # Optional: Ensures a table name is explicitly defined
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    last_edit = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign Key linking SyncSpace to User
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<SyncSpace {self.name} - Last Edited: {self.last_edit}>'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'last_edit': self.last_edit.isoformat(),
            'user_id': self.user_id
        }
