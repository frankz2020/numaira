from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY

from config import db


class Template(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    last_edited = db.Column(db.DateTime, default=datetime.now(datetime.UTC))
    paragraph = db.Column(ARRAY(db.String), nullable=False)

    user = db.relationship("User", backref=db.backref("templates", lazy=True))

    def __repr__(self):
        return f"<Template {self.id} by User {self.user_id}>"

    def serialize(self):
        return {"id": self.id, "user_id": self.user_id, "name": self.name, "last_edited": self.last_edited.isoformat(), "paragraph": self.paragraph}
