from datetime import datetime

from sqlalchemy.dialects.sqlite import JSON

from config import db
from utils.sqlLiteArrayToText import sqlLite_reverseTextToArray

class Template(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    last_edited = db.Column(db.DateTime, default=datetime.now())
    paragraphs = db.Column(db.Text, nullable=False)

    user = db.relationship("User", backref=db.backref("templates", lazy=True))

    def __repr__(self):
        return f"<Template {self.id} by User {self.user_id}>"

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "last_edited": self.last_edited.isoformat(),
            "paragraphs": sqlLite_reverseTextToArray(self.paragraphs),  # Convert comma-separated string to list
        }
