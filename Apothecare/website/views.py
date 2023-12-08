# views.py

from flask import Blueprint, render_template, jsonify, request
from flask_login import login_required, current_user
from .models import MedicineInv, db  

views = Blueprint('views', __name__)

@views.route('/')
@login_required
def home():
    medicines = MedicineInv.query.all()
    return render_template("home.html", user=current_user, medicines=medicines)

@views.route('/get_medicines', methods=['GET'])
def get_medicines():
    medicine_list = [
        {
            'MedicineID': medicine.MedicineID, 
            'MedicineName': medicine.MedicineName,
            'UnitOfMedicine': medicine.UnitOfMedicine,
            'Price': float(medicine.Price), 
            'ExpirationDate': str(medicine.ExpirationDate),  
            'QuantityOfMedicine': medicine.QuantityOfMedicine
        }
        for medicine in MedicineInv.query.all()
    ]

    return jsonify({'medicines': medicine_list})

@views.route('/search_medicine', methods=['GET'])
def search_medicine():
    query = request.args.get('query', '')
    
    results = MedicineInv.query.filter(MedicineInv.MedicineName.ilike(f'%{query}%')).all()

    medicines = [
        {
            'MedicineID': result.MedicineID,
            'MedicineName': result.MedicineName,
            'UnitOfMedicine': result.UnitOfMedicine,
            'Price': float(result.Price),
            'ExpirationDate': result.ExpirationDate.strftime('%Y-%m-%d'),
            'QuantityOfMedicine': result.QuantityOfMedicine
        }
        for result in results
    ]

    return jsonify(medicines)

@views.route('/low_stock_alert', methods=['GET'])
def low_stock_alert():
    try:
        # Set the threshold for low stock 
        low_stock_threshold = 150

        # Query medicines with low stock from the database
        low_stock_medicines = MedicineInv.query.filter(MedicineInv.QuantityOfMedicine < low_stock_threshold).all()

        if low_stock_medicines:
            result = {
                "result": "Low stock alert!",
                "medicines": [
                    {
                        "MedicineID": med.MedicineID,
                        "MedicineName": med.MedicineName,
                        "QuantityOfMedicine": med.QuantityOfMedicine
                    }
                    for med in low_stock_medicines
                ]
            }
        else:
            result = {"result": "No low stock alert."}

    except Exception as e:
        result = {"result": f"Error: {str(e)}"}

    return jsonify(result)
