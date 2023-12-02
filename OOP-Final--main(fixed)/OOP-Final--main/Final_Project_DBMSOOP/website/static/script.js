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
   
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;


    function updateCart() {
        cartList.innerHTML = '';
        total = 0;
   
        cartData.forEach((product, index) => {
            const cartRow = document.createElement('tr');
   
            const productNameCell = document.createElement('td');
            productNameCell.textContent = product.name;
   
            const productDescriptionCell = document.createElement('td');
            productDescriptionCell.textContent = product.description;
   
            const productPriceCell = document.createElement('td');
            productPriceCell.textContent = `Php ${product.price.toFixed(2)}`;
   
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
            cartRow.appendChild(productDescriptionCell);
            cartRow.appendChild(productPriceCell);
            cartRow.appendChild(productQuantityCell);
            cartRow.appendChild(removeButtonCell);
            cartRow.appendChild(addButtonCell);
   
            cartList.appendChild(cartRow);
            total += product.price * product.quantity;
        });
   
        cartTotal.textContent = `Total: Php ${total.toFixed(2)}`;
    }
   
    function updateReceipt(change) {
        const receiptList = document.getElementById('receipt-list');
        receiptList.innerHTML = '';
   
        cartData.forEach((product) => {
            const receiptItem = document.createElement('tr');
            receiptItem.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>Php ${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
            `;
            receiptList.appendChild(receiptItem);
        });


        const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td colspan="3" style="text-align: right;">Total:</td>
        <td>Php ${total.toFixed(2)}</td>
    `;
    receiptList.appendChild(totalRow);


    if (change !== undefined) {
        const changeItem = document.createElement('li');
        changeItem.innerHTML = `
            <span>Change</span>
            <span>Php ${change.toFixed(2)}</span>
        `;
        receiptList.appendChild(changeItem);
        changeDisplay.textContent = `Change: Php ${change.toFixed(2)}`;
    }


    receiptTotal.textContent = `Total: Php ${total.toFixed(2)}`;
}


productListItems.forEach((product) => {
        product.addEventListener('click', () => {
            const productId = product.getAttribute('data-product-id');


            const existingProduct = cartData.find(item => item.id === productId);


            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                const productName = product.getAttribute('data-product-name');
                const productDescription = product.getAttribute('data-product-des');
                const productPrice = parseFloat(product.getAttribute('data-product-price'));


                const selectedProduct = {
                    id: productId,
                    name: productName,
                    description: productDescription,
                    price: productPrice,
                    quantity: 1
                };
                cartData.push(selectedProduct);
            }


            localStorage.setItem('cart', JSON.stringify(cartData));
            updateCart();


            const folderProductList = document.querySelector(`.product-list[data-folder-id="${product.getAttribute('data-folder-id')}"]`);
            if (folderProductList) {
                folderProductList.classList.add('hidden');
            }
        });
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('added-to-cart');
            setTimeout(() => {
                button.classList.remove('added-to-cart');
            }, 250);
        });
    });

    checkoutBtn.addEventListener('click', () => {
        const amountGiven = parseFloat(document.getElementById('amount-given').value) || 0;
        const totalAmount = cartData.reduce((total, product) => total + (product.price * product.quantity), 0);
        const change = (amountGiven - totalAmount).toFixed(2);
    
        if (change >= 0) {
            updateReceipt(parseFloat(change));
            cartData = [];
            localStorage.setItem('cart', JSON.stringify(cartData));
            updateCart();
        } else {
            alert('Insufficient amount given. Please provide enough to cover the total.');
        }
    });
    

    resetBtn.addEventListener('click', () => {
        cartData = []; 
        localStorage.setItem('cart', JSON.stringify(cartData));
        updateCart(); 
        updateReceiptContent(0); 
    });
    
       
    
    
        updateCart();
    
    
    });
    