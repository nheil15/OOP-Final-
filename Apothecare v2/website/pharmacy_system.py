# mainpharmacy_system.py

import mysql.connector
from datetime import datetime
import time
from itertools import count
from flask import Flask, render_template, request, jsonify
from .models import MedicineInv  # Assuming you have a MedicineInv model defined

class User:
    def __init__(self, user_id, user_email, username, password, created_at):
        self.user_id = user_id
        self.username = username
        self.password = password
        self.created_at = created_at
        self.user_email = user_email

class Medicine:
    def __init__(self, medicine_id, medicine_name, unit_of_medicine, price, expiration_date, quantity_of_medicine):
        self.medicine_id = medicine_id
        self.medicine_name = medicine_name
        self.unit_of_medicine = unit_of_medicine
        self.price = price
        self.expiration_date = expiration_date
        self.quantity_of_medicine = quantity_of_medicine

    def get_name(self):
        return self.medicine_name

    def get_price(self):
        return self.price

    def get_quantity(self):
        return self.quantity_of_medicine

    def set_quantity(self, quantity):
        self.quantity_of_medicine = quantity

    def is_expired(self):
        current_date = datetime.now().date()
        return current_date > self.expiration_date

    def get_medicine_id(self):
        return self.medicine_id

class Inventory:
    def __init__(self, connection):
        self.medicines = []
        self.connection = connection

    def add_medicine(self, medicine):
        self.medicines.append(medicine)

    def get_medicines(self):
        return self.medicines

    def add_medicine_to_inventory(self, medicine_name, unit_of_medicine, price, expiration_date, quantity_of_medicine):
        existing_medicines = self.find_medicines_by_name(medicine_name)
        if existing_medicines:
            print(f"Medicine with name '{medicine_name}' already exists in the inventory.")
            return

        next_medicine_id = self.get_next_medicine_id()  # You need to implement this method

        insert_query = "INSERT INTO MedicineInv (MedicineID, MedicineName, UnitOfMedicine, Price, ExpirationDate, QuantityOfMedicine) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor = self.connection.cursor()
        cursor.execute(insert_query, (next_medicine_id, medicine_name, unit_of_medicine, price, expiration_date, quantity_of_medicine))
        self.connection.commit()
        cursor.close()

        # Update the local list of medicines
        new_medicine = Medicine(next_medicine_id, medicine_name, unit_of_medicine, price, expiration_date, quantity_of_medicine)
        self.add_medicine(new_medicine)
        print(f"Medicine '{medicine_name}' added to the inventory.")

    def get_next_medicine_id(self):
        # Fetch the next available Medicine ID from the database
        cursor = self.connection.cursor()
        cursor.execute("SELECT MAX(MedicineID) FROM MedicineInv")
        max_medicine_id = cursor.fetchone()[0]
        cursor.close()

        if max_medicine_id is not None:
            next_medicine_id = int(max_medicine_id) + 1
            # Format the MedicineID with leading zeros
            formatted_medicine_id = f"{next_medicine_id:04d}"  # Assuming a format like '0106'
            return formatted_medicine_id
        else:
            return "0101"  # Default value if there are no existing records

    def find_medicines_by_name(self, medicine_name):
        query = "SELECT * FROM MedicineInv WHERE MedicineName LIKE %s"
        cursor = self.connection.cursor()
        cursor.execute(query, (f"%{medicine_name}%",))
        medicines_data = cursor.fetchall()
        cursor.close()

        medicines = []
        for medicine_data in medicines_data:
            medicine_id, medicine_name, unit_of_medicine, price, expiration_date, quantity_of_medicine = medicine_data
            medicine = Medicine(medicine_id, medicine_name, unit_of_medicine, price, expiration_date, quantity_of_medicine)
            medicines.append(medicine)

        return medicines

    def remove_medicine_by_name(self, medicine_name):
        medicines = self.find_medicines_by_name(medicine_name)

        if medicines:
            # Assume only one instance of medicine with the given name for simplicity
            medicine_to_remove = medicines[0]

            # Delete from the database
            delete_query = "DELETE FROM MedicineInv WHERE MedicineName = %s"
            cursor = self.connection.cursor()
            cursor.execute(delete_query, (medicine_name,))
            self.connection.commit()
            cursor.close()

            # Remove from the local list
            self.medicines = [med for med in self.medicines if med.get_name() != medicine_name]

            print(f"Medicine '{medicine_name}' removed from the inventory.")
            return True
        else:
            print(f"Error: Medicine '{medicine_name}' not found in the local list.")
            return False

    def search_medicine(self, keyword):
        query = "SELECT * FROM MedicineInv WHERE MedicineName LIKE %s"
        cursor = self.connection.cursor()
        cursor.execute(query, (f"%{keyword}%",))
        medicines_data = cursor.fetchall()
        cursor.close()

        if not medicines_data:
            print(f"No medicines found with a name containing '{keyword}'.")
            return []

        medicines = []
        for medicine_data in medicines_data:
            medicine_id, medicine_name, unit_of_medicine, price, expiration_date, quantity_of_medicine = medicine_data
            medicine = Medicine(medicine_id, medicine_name, unit_of_medicine, price, expiration_date, quantity_of_medicine)
            medicines.append(medicine)

        return medicines

class Pharmacy:
    def __init__(self, connection):
        self.inventory = Inventory(connection)

    def add_medicine(self, medicine_id, medicine_name, unit_of_medicine, price, expiration_date, quantity_of_medicine):
        medicine = Medicine(medicine_id, medicine_name, unit_of_medicine, price, expiration_date, quantity_of_medicine)
        self.inventory.add_medicine(medicine)

    def confirm_sell_list(self, sell_list):
        print("Confirmed Sell List:")
        total_price = 0.0

        for item in sell_list:
            medicine = item['medicine']
            quantity = item['quantity']
            price = float(medicine.get_price())
            total = quantity * price

            if quantity > 0:
                print(f"Name: {medicine.get_name()} - Quantity: {quantity} - Price: ₱{price:.2f} - Total: ₱{total:.2f}")
                total_price += total

        if total_price > 0:
            print(f"Total Sales: ₱{total_price:.2f}")
        else:
            print("Sell list is empty.")

    def record_sale(self, sold_items):
        cursor = self.inventory.connection.cursor()

        for item in sold_items:
            medicine_name = item['medicine'].get_name()
            quantity_sold = item['quantity']
            total_price = item['medicine'].get_price() * quantity_sold

            medicine_id = self.inventory.get_medicine_id_by_name(medicine_name)
            sales_id = self.generate_sales_id()
            sales_date = datetime.now().date()
            unit_price = total_price / quantity_sold

            # Update SalesOfMedicine table
            insert_query = "INSERT INTO SalesOfMedicine (SalesID, UnitPrice, TotalPrice, MedicineID) VALUES (%s, %s, %s, %s)"
            cursor.execute(insert_query, (sales_id, unit_price, total_price, medicine_id))

            # Update Inventory table
            self.inventory.update_inventory(medicine_name, quantity_sold, increase=False)

        self.inventory.connection.commit()
        cursor.close()

    _sales_counter = count(start=1)
    def generate_sales_id(self):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        sales_id = f"S{timestamp}{next(self._sales_counter)}"
        return sales_id

    def sell_medicine(self, receipt):
        sell_list = []

        while True:
            print("\n\n\nAdd a Medicine:")
            medicine_name = input("Enter medicine name (or 'exit' to stop): ")

            if medicine_name.lower() == 'exit':
                break

            medicines = self.inventory.find_medicines_by_name(medicine_name)
            if not medicines:
                print("Medicine not found. Please enter a valid medicine name.")
                continue

            self.inventory.check_medicine_expiration(medicine_name)

            print("Available Medicines:")
            for med in medicines:
                print(f"MedicineID: {med.get_medicine_id()} - {med.get_name()} - Quantity: {med.get_quantity()}")

            try:
                quantity = int(input("Enter quantity: "))
            except ValueError:
                print("Invalid quantity. Please enter a valid integer.")
                continue

            medicine_id = input("Enter Medicine ID: ")
            selected_medicine = next((med for med in medicines if str(med.get_medicine_id()) == medicine_id), None)

            if selected_medicine:
                if selected_medicine.get_quantity() >= quantity > 0:
                    print(f"\n\nAdded {quantity} {selected_medicine.get_name()} to the sell list.")
                    sell_list.append({'medicine': selected_medicine, 'quantity': quantity})
                else:
                    print("Invalid quantity. Please enter a valid quantity within the available stock.")
            else:
                print("Invalid Medicine ID. Please try again.")

            another_medicine = input("Add another medicine? (y/n): ").strip().lower()

            if another_medicine != 'y':
                break

        if sell_list:
            self.confirm_sell_list(sell_list)
            self.record_sale(sell_list)
            receipt.extend(sell_list)
        else:
            print("Sell list is empty.")

    def generate_receipt(self, receipt):
        print("------- Receipt --------")
        current_time = time.ctime()
        print(f"Date & Time: {current_time}")
        print("------------------------")

        grand_total = 0.0

        for item in receipt:
            medicine = item['medicine']
            quantity = item['quantity']
            price = float(medicine.get_price())
            total = quantity * price

            print(f"Name: {medicine.get_name()}")
            print(f"Quantity: {quantity}")
            print(f"Price: ₱{price:.2f}")
            print(f"Total: ₱{total:.2f}")
            print("------------------------")
            grand_total += float(total)

        print(f"Total Price: ₱{grand_total:.2f}")
        print("------------------------")

        for item in receipt:
            sold_quantity = item['quantity']
            if sold_quantity > 0:
                self.inventory.update_inventory(item['medicine'].get_name(), sold_quantity)

class UserManager:
    def __init__(self, connection):
        self.connection = connection

    def create_user(self, username, password, user_email):
        cursor = self.connection.cursor()
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        try:
            cursor.execute("INSERT INTO User (Username, Password, UserEmail, CreatedAt) VALUES (%s, %s, %s, %s)",
                           (username, password, user_email, created_at))
            self.connection.commit()
            print(f"User '{username}' created successfully.")
        except mysql.connector.Error as e:
            print(f"Error creating user: {e}")
        finally:
            cursor.close()

    def authenticate_user(self, username, password):
        cursor = self.connection.cursor(dictionary=True)

        try:
            cursor.execute("SELECT * FROM User WHERE Username = %s AND Password = %s", (username, password))
            user_data = cursor.fetchone()

            if user_data:
                return User(
                user_data['UserId'],
                user_data['UserEmail'],  # Updated line for email
                user_data['Username'],
                user_data['Password'],
                user_data['CreatedAt']
            )
            else:
                return None
        except mysql.connector.Error as e:
            print(f"Error authenticating user: {e}")
        finally:
            cursor.close()

def main():
    try:
        with mysql.connector.connect(
            host="localhost",
            user="root",
            password="jakemaxim",
            database="Apothecare"
        ) as db_connection:

            user_manager = UserManager(db_connection)

            while True:
                print("\nUser Authentication")
                print("1. Log In")
                print("2. Sign Up")
                print("3. Exit")

                choice = input("Enter your choice: ")

                if choice == '1':
                    username = input("Enter your username: ")
                    password = input("Enter your password: ")
                    user = user_manager.authenticate_user(username, password)

                    if user:
                        print(f"Welcome, {user.username}!")
                        run_pharmacy_system(db_connection)
                    else:
                        print("Invalid username or password. Please try again.")

                elif choice == '2':
                    username = input("Enter a new username: ")
                    password = input("Enter a new password: ")
                    user_email = input("Enter your email: ")  # Added line for email
                    user_manager.create_user(username, password, user_email)

                elif choice == '3':
                    print("Exiting...")
                    break

                else:
                    print("Invalid choice. Please try again.")

    except mysql.connector.Error as e:
        print(f"Error: {e}")

app = Flask(__name__)

def run_pharmacy_system(pharmacy):
    pharmacy = Pharmacy(db_connection)
    receipt = []

    while True:
        print("\nPharmacy Management System")
        print("1. Sell Medicine")
        print("2. Generate Receipt")
        print("3. Add Medicine to Inventory")
        print("4. Remove Medicine from Inventory")
        print("5. Search for Medicine")
        print("6. Logout")

        choice = input("Enter your choice: ")

        if choice == '1':
            pharmacy.sell_medicine(receipt)
        elif choice == '2':
            pharmacy.generate_receipt(receipt)
        elif choice == '3':
            pharmacy.inventory.add_medicine_to_inventory(
                input("Enter medicine name: "),
                input("Enter unit of medicine: "),
                float(input("Enter price: ")),
                input("Enter expiration date (YYYY-MM-DD): "),
                int(input("Enter quantity: "))
            )
        elif choice == '4':
            pharmacy.inventory.remove_medicine_by_name(
                input("Enter medicine name to remove: ")
            )
        elif choice == '5':
            keyword = input("Enter keyword to search for medicine: ")
            search_result = Pharmacy.inventory.search_medicine(keyword)
            if search_result:
                print("Search Result:")
                for med in search_result:
                    print(f"Medicine ID: {med.get_medicine_id()} - Name: {med.get_name()} - Quantity: {med.get_quantity()}")
            else:
                print("No medicines found matching the search criteria.")
        elif choice == '6':
            print("Logging out...")
            break
        else:
            print("Invalid choice. Please try again.")


from flask import jsonify
from .models import MedicineInv  # Assuming you have a MedicineInv model defined

@app.route('/low_stock_alert', methods=['GET'])
def low_stock_alert():
    try:
        # Set the threshold for low stock (adjust as needed)
        low_stock_threshold = 150

        # Query medicines with low stock from the database
        low_stock_medicines = MedicineInv.query.filter(MedicineInv.QuantityOfMedicine < low_stock_threshold).all()

        # Print information for debugging
        print("Low stock medicines:", low_stock_medicines)

        # Check if the data is retrieved and has the expected structure
        if low_stock_medicines:
            # Print the attributes of the first item in the list
            first_item = low_stock_medicines[0]
            print("Attributes of the first item:", dir(first_item))

            result = {
                "result": "Low stock alert!",
                "medicines": [
                    {
                        "MedicineID": getattr(med, "MedicineID", None),
                        "MedicineName": getattr(med, "MedicineName", None),
                        "QuantityOfMedicine": getattr(med, "QuantityOfMedicine", None)
                    }
                    for med in low_stock_medicines
                ]
            }
        else:
            result = {"result": "No low stock alert."}

    except Exception as e:
        result = {"result": f"Error: {str(e)}"}

    return jsonify(result)






@app.route('/')
def index():
    return render_template('home.html')
# Add new route for fetching medicines from the database
@app.route('/get_medicines', methods=['GET'])
def get_medicines():
    cursor = db_connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM MedicineInv")
    medicines = cursor.fetchall()
    cursor.close()
    return jsonify(medicines)

@app.route('/add_medicine_to_database', methods=['POST'])
def add_medicine_to_database():
    try:
        # Extract medicine details from the POST request
        medicine_details = request.json

        # Assuming pharmacy is already created and available in the scope
        Pharmacy.inventory.add_medicine_to_inventory(
            medicine_details['medicine_name'],
            medicine_details['unit_of_medicine'],
            medicine_details['price'],
            medicine_details['expiration_date'],
            medicine_details['quantity_of_medicine']
        )

        return 'Medicine added successfully.'

    except Exception as e:
        return f'Error: {str(e)}'


@app.route('/search_medicine', methods=['GET'])
def search_medicine():
    keyword = request.args.get('keyword', '')
    medicines = Pharmacy.inventory.search_medicine(keyword)
    result = []

    for med in medicines:
        result.append({
            'medicine_id': med.get_medicine_id(),
            'medicine_name': med.get_name(),
            'unit_of_medicine': med.unit_of_medicine,
            'price': med.get_price(),
            'expiration_date': str(med.expiration_date),
            'quantity_of_medicine': med.get_quantity()
        })

    return jsonify(result)
                                                                
if __name__ == "__main__":
    try:
        with mysql.connector.connect(
                host="localhost",
                user="root",
                password="jakemaxim",
                database="Apothecare"
        ) as db_connection:
            user_manager = UserManager(db_connection)

            while True:
                print("\nUser Authentication")
                print("1. Log In")
                print("2. Sign Up")
                print("3. Exit")

                choice = input("Enter your choice: ")

                if choice == '1':
                    username = input("Enter your username: ")
                    password = input("Enter your password: ")
                    user = user_manager.authenticate_user(username, password)

                    if user:
                        print(f"Welcome, {user.username}!")
                        run_pharmacy_system(db_connection)
                    else:
                        print("Invalid username or password. Please try again.")

                elif choice == '2':
                    username = input("Enter a new username: ")
                    password = input("Enter a new password: ")
                    user_email = input("Enter your email: ")  # Added line for email
                    user_manager.create_user(username, password, user_email)

                elif choice == '3':
                    print("Exiting...")
                    break

                else:
                    print("Invalid choice. Please try again.")

    except mysql.connector.Error as e:
        print(f"Error: {e}")