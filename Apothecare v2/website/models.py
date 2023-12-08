from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class User(db.Model, UserMixin):
    UserId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserEmail = db.Column(db.String(30), unique=True, nullable=False)
    Username = db.Column(db.String(255), unique=True, nullable=False)
    Password = db.Column(db.String(255), nullable=False)
    CreatedAt = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

    def get_id(self):
        return str(self.UserId)

    @property
    def is_active(self):
        # You can customize this logic based on your application's requirements
        return True
    @property
    def email(self):
        return self.UserEmail
    
class MedicineInv(db.Model):
    __tablename__ = 'MedicineInv'
    MedicineID = db.Column(db.String(5), primary_key=True)
    MedicineName = db.Column(db.String(30))
    UnitOfMedicine = db.Column(db.String(10))
    Price = db.Column(db.DECIMAL(6, 2))
    ExpirationDate = db.Column(db.Date)
    QuantityOfMedicine = db.Column(db.Integer)