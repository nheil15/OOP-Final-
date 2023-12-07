# views.py

from flask import Blueprint, render_template, jsonify, request
from flask_login import login_required, current_user
from .models import MedicineInv, db  # Import the MedicineInv model and db

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
            'MedicineID': medicine.MedicineID,  # Use the correct attribute name
            'MedicineName': medicine.MedicineName,
            'UnitOfMedicine': medicine.UnitOfMedicine,
            'Price': float(medicine.Price),  # Convert DECIMAL to float for JSON serialization
            'ExpirationDate': str(medicine.ExpirationDate),  # Convert Date to string for JSON serialization
            'QuantityOfMedicine': medicine.QuantityOfMedicine
        }
        for medicine in MedicineInv.query.all()
    ]

    return jsonify({'medicines': medicine_list})

@views.route('/purchase', methods=['POST'])
def purchase():
    # Assuming you get the medicine ID and quantity from the client
    medicine_id = request.form.get('medicine_id')
    purchased_quantity = int(request.form.get('quantity'))

    # Retrieve the medicine from the database
    medicine = MedicineInv.query.get(medicine_id)

    if medicine and medicine.QuantityOfMedicine >= purchased_quantity:
        # Update the quantity in the database
        medicine.QuantityOfMedicine -= purchased_quantity
        db.session.commit()
        return jsonify({'success': True, 'message': 'Purchase successful'})
    else:
        return jsonify({'success': False, 'message': 'Insufficient stock'})

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
