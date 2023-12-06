#models.py

from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Text)  
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    notes = db.relationship('Note')

class MedicineInv(db.Model):
    __tablename__ = 'MedicineInv'
    MedicineID = db.Column(db.String(5), primary_key=True)
    MedicineName = db.Column(db.String(30))
    UnitOfMedicine = db.Column(db.String(10))
    Price = db.Column(db.DECIMAL(6, 2))
    ExpirationDate = db.Column(db.Date)
    QuantityOfMedicine = db.Column(db.Integer)
