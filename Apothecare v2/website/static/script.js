document.addEventListener('DOMContentLoaded', function () {
    const productListItems = document.querySelectorAll('.product-item');
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const amountGivenInput = document.getElementById('amount-given');
    const changeDisplay = document.getElementById('change');
    const receiptList = document.getElementById('receipt-list');
    const receiptTotal = document.getElementById('receipt-total');
    const resetBtn = document.getElementById('reset-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const printReceiptBtn = document.getElementById('print-receipt-btn');
    const searchInput = document.getElementById('searchInput');
    const medicineListElement = document.getElementById('medicineList');
    const searchButton = document.getElementById('searchButton');
    const productsFolder = document.getElementById('products-folder');

    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    function updateCart() {
        cartList.innerHTML = '';
        total = 0;

        cartData.forEach((product, index) => {
            const cartRow = document.createElement('tr');

            const productNameCell = document.createElement('td');
            productNameCell.textContent = product.name;

            const productPriceCell = document.createElement('td');
            productPriceCell.textContent = `Php ${product.price ? product.price.toFixed(2) : 'N/A'}`;

            const productQuantityCell = document.createElement('td');
            productQuantityCell.textContent = product.quantity;

            const removeButtonCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-btn');
            removeButton.addEventListener('click', () => {
                const indexToRemove = index;
                if (cartData[indexToRemove].quantity > 1) {
                    cartData[indexToRemove].quantity--;
                } else {
                    cartData.splice(indexToRemove, 1);
                }
                localStorage.setItem('cart', JSON.stringify(cartData));
                updateCart();
            });
            removeButtonCell.appendChild(removeButton);

            const addButtonCell = document.createElement('td');
            const addButton = document.createElement('button');
            addButton.textContent = 'Add';
            addButton.classList.add('add-btn');
            addButton.addEventListener('click', () => {
                cartData[index].quantity++;
                localStorage.setItem('cart', JSON.stringify(cartData));
                updateCart();
            });
            addButtonCell.appendChild(addButton);

            cartRow.appendChild(productNameCell);
            cartRow.appendChild(productPriceCell);
            cartRow.appendChild(productQuantityCell);
            cartRow.appendChild(removeButtonCell);
            cartRow.appendChild(addButtonCell);

            cartList.appendChild(cartRow);
            total += product.price * product.quantity;
        });

        cartTotal.textContent = `Total: Php ${total.toFixed(2)}`;
    }


    function updateReceiptContent(change) {
        const receiptContent = document.getElementById('receipt-content');
        receiptContent.innerHTML = '<tr><th>Product</th><th>Quantity</th><th>Price</th></tr>';

        cartData.forEach(product => {
            const receiptRow = document.createElement('tr');
            receiptRow.innerHTML = `
                <td>${product.name}</td>
                <td class="quantity">${product.quantity}</td>
                <td>Php ${(product.price * product.quantity).toFixed(2)}</td>
            `;
            receiptContent.appendChild(receiptRow);
        });

        const totalQuantity = cartData.reduce((total, product) => total + product.quantity, 0);
        const totalAmount = cartData.reduce((total, product) => total + (product.price * product.quantity), 0);

        document.getElementById('total-quantity').innerText = totalQuantity;
        document.getElementById('total-amount').innerText = `Php ${totalAmount.toFixed(2)}`;

        const amountGivenInput = document.getElementById('amount-given');
        const amountGiven = parseFloat(amountGivenInput.value) || 0;

        document.getElementById('amount-receipt').innerText = `Php ${amountGiven.toFixed(2)}`;
        document.getElementById('change-receipt').innerText = `Php ${change.toFixed(2)}`;
    }

    function printReceipt() {
        const receiptContainer = document.querySelector('.receipt-container').cloneNode(true);

        const printContent = document.createElement('div');
        printContent.appendChild(receiptContainer);

        const printWindow = window.open('', '_blank');
        printWindow.document.body.appendChild(printContent);

        printWindow.print();
    }

    // Purchase Function
    function purchaseMedicine(medicineId, quantity) {
        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `medicine_id=${medicineId}&quantity=${quantity}`,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Purchase successful:', data.message);
                    // Optionally, you can update the UI or perform other actions
                } else {
                    console.error('Purchase failed:', data.message);
                    // Handle the case where the purchase failed
                }
            })
            .catch(error => {
                console.error('Error during purchase:', error);
            });
    }

    function addProductToCart(productId, productName, productDescription, productPrice) {
        const existingProduct = cartData.find(item => item.id === productId);
    
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            const selectedProduct = {
                id: productId,
                name: productName,
                description: productDescription,
                price: productPrice,
                quantity: 1
            };
    
            // Don't reduce the quantity here; it will be reduced at checkout
            cartData.push(selectedProduct);
        }
    
        localStorage.setItem('cart', JSON.stringify(cartData));
        updateCart();
    }
    

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            const productName = button.getAttribute('data-product-name');
            const productDescription = button.getAttribute('data-product-des');
            const productPrice = parseFloat(button.getAttribute('data-product-price'));

            addProductToCart(productId, productName, productDescription, productPrice);

            button.classList.add('added-to-cart');
            setTimeout(() => {
                button.classList.remove('added-to-cart');
            }, 250);
        });
    });

    checkoutBtn.addEventListener('click', () => {
        const amountGiven = parseFloat(amountGivenInput.value) || 0;
        const totalAmount = cartData.reduce((total, product) => total + (product.price * product.quantity), 0);
        const change = (amountGiven - totalAmount).toFixed(2);
    
        if (change >= 0) {
            // Update the receipt content
            updateReceiptContent(parseFloat(change));
    
            document.getElementById('amount-given').innerText = `Php ${amountGiven.toFixed(2)}`;
            document.getElementById('change').innerText = `Php ${change}`;
    
            // Reduce the quantity after successful purchase
            cartData.forEach(product => {
                // Call the purchaseMedicine function when a product is checked out
                purchaseMedicine(product.id, product.quantity);
                // Reset quantity after successful purchase
                product.quantity = 0;
            });
    
            localStorage.setItem('cart', JSON.stringify(cartData));
            updateCart();
    
            // Update the receipt content after successful purchase
            updateReceiptContent(parseFloat(change));
        } else {
            alert('Insufficient amount given. Please provide enough to cover the total.');
        }
    });

    // Search Functionality
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.trim().toLowerCase();

        if (query.length > 0) {
            // Fetch search results from the server
            fetch(`/search_medicine?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    // Clear the current medicine list
                    medicineListElement.innerHTML = '';

                    // Display the search results
                    data.forEach(medicine => {
                        const listItem = document.createElement('li');
                        listItem.setAttribute('class', 'product-item');
                        listItem.setAttribute('data-product-id', medicine.MedicineID);
                        listItem.setAttribute('data-product-name', medicine.MedicineName);
                        listItem.setAttribute('data-product-des', medicine.UnitOfMedicine);
                        listItem.setAttribute('data-product-price', medicine.Price);

                        const medicineInfo = `${medicine.MedicineName} ${medicine.UnitOfMedicine} ${medicine.Price}`;
                        listItem.textContent = medicineInfo;

                        const addButton = document.createElement('button');
                        addButton.setAttribute('class', 'add-to-cart-btn');
                        addButton.setAttribute('data-product-id', medicine.MedicineID);
                        addButton.setAttribute('data-product-name', medicine.MedicineName);
                        addButton.setAttribute('data-product-des', medicine.UnitOfMedicine);
                        addButton.setAttribute('data-product-price', medicine.Price);
                        addButton.textContent = 'ADD';

                        addButton.addEventListener('click', () => {
                            const productId = addButton.getAttribute('data-product-id');
                            const productName = addButton.getAttribute('data-product-name');
                            const productDescription = addButton.getAttribute('data-product-des');
                            const productPrice = parseFloat(addButton.getAttribute('data-product-price'));

                            addProductToCart(productId, productName, productDescription, productPrice);

                            addButton.classList.add('added-to-cart');
                            setTimeout(() => {
                                addButton.classList.remove('added-to-cart');
                            }, 250);
                        });

                        listItem.appendChild(addButton);
                        medicineListElement.appendChild(listItem);
                    });
                })
                .catch(error => console.error('Error fetching search results:', error));
        } else {
            // Fetch all medicines
            fetch('/get_medicines')
                .then(response => response.json())
                .then(data => {
                    // Clear the current medicine list
                    medicineListElement.innerHTML = '';

                    // Display all medicines
                    if (Array.isArray(data)) {
                        data.forEach(medicine => {
                            const listItem = document.createElement('div');
                            listItem.setAttribute('class', 'product-item');
                            listItem.setAttribute('data-product-id', medicine.MedicineID);
                            listItem.setAttribute('data-product-name', medicine.MedicineName);
                            listItem.setAttribute('data-product-des', medicine.UnitOfMedicine);
                            listItem.setAttribute('data-product-price', medicine.Price);

                            const medicineInfo = `
                                ID: ${medicine.MedicineID}<br>
                                Name: ${medicine.MedicineName}<br>
                                Unit: ${medicine.UnitOfMedicine}<br>
                                Price: ${medicine.Price}<br>
                                Expiration Date: ${medicine.ExpirationDate}<br>
                                Quantity: ${medicine.QuantityOfMedicine}
                            `;
                            listItem.innerHTML = medicineInfo;

                            const addButton = document.createElement('button');
                            addButton.setAttribute('class', 'add-to-cart-btn');
                            addButton.setAttribute('data-product-id', medicine.MedicineID);
                            addButton.setAttribute('data-product-name', medicine.MedicineName);
                            addButton.setAttribute('data-product-des', medicine.UnitOfMedicine);
                            addButton.setAttribute('data-product-price', medicine.Price);
                            addButton.textContent = 'Add to Cart';

                            addButton.addEventListener('click', () => {
                                const productId = addButton.getAttribute('data-product-id');
                                const productName = addButton.getAttribute('data-product-name');
                                const productDescription = addButton.getAttribute('data-product-des');
                                const productPrice = parseFloat(addButton.getAttribute('data-product-price'));

                                addProductToCart(productId, productName, productDescription, productPrice);

                                addButton.classList.add('added-to-cart');
                                setTimeout(() => {
                                    addButton.classList.remove('added-to-cart');
                                }, 250);
                            });

                            listItem.appendChild(addButton);
                            medicineListElement.appendChild(listItem);
                        });
                    } else {
                        console.error('Error fetching all medicines: Data is not an array', data);
                    }
                })
                .catch(error => console.error('Error fetching all medicines:', error));
        }
    });

    // New event listener for "PRODUCTS" box
    productsFolder.addEventListener('click', () => {
        // Fetch all medicines again when the "PRODUCTS" box is clicked
        fetch('/get_medicines')
            .then(response => response.json())
            .then(data => {
                // Clear the current medicine list
                medicineListElement.innerHTML = '';

                // Display all medicines
                if (Array.isArray(data.medicines)) {
                    data.medicines.forEach(medicine => {
                        const listItem = document.createElement('div');
                        listItem.setAttribute('class', 'product-item');
                        listItem.setAttribute('data-product-id', medicine.MedicineID);
                        listItem.setAttribute('data-product-name', medicine.MedicineName);
                        listItem.setAttribute('data-product-des', medicine.UnitOfMedicine);
                        listItem.setAttribute('data-product-price', medicine.Price);

                        const medicineInfo = `
                            ID: ${medicine.MedicineID}<br>
                            Name: ${medicine.MedicineName}<br>
                            Unit: ${medicine.UnitOfMedicine}<br>
                            Price: ${medicine.Price}<br>
                            Expiration Date: ${medicine.ExpirationDate}<br>
                            Quantity: ${medicine.QuantityOfMedicine}
                        `;
                        listItem.innerHTML = medicineInfo;

                        const addButton = document.createElement('button');
                        addButton.setAttribute('class', 'add-to-cart-btn');
                        addButton.setAttribute('data-product-id', medicine.MedicineID);
                        addButton.setAttribute('data-product-name', medicine.MedicineName);
                        addButton.setAttribute('data-product-des', medicine.UnitOfMedicine);
                        addButton.setAttribute('data-product-price', medicine.Price);
                        addButton.textContent = 'Add to Cart';

                        addButton.addEventListener('click', () => {
                            const productId = addButton.getAttribute('data-product-id');
                            const productName = addButton.getAttribute('data-product-name');
                            const productDescription = addButton.getAttribute('data-product-des');
                            const productPrice = parseFloat(addButton.getAttribute('data-product-price'));

                            addProductToCart(productId, productName, productDescription, productPrice);

                            addButton.classList.add('added-to-cart');
                            setTimeout(() => {
                                addButton.classList.remove('added-to-cart');
                            }, 250);
                        });

                        listItem.appendChild(addButton);
                        medicineListElement.appendChild(listItem);
                    });
                } else {
                    console.error('Error fetching all medicines: Data.medicines is not an array', data);
                }
            })
            .catch(error => console.error('Error fetching all medicines:', error));
    });

    // Existing event listener for reset functionality
    resetBtn.addEventListener('click', () => {
        cartData = [];
        localStorage.setItem('cart', JSON.stringify(cartData));
        updateCart();
    });

    updateCart();
});
