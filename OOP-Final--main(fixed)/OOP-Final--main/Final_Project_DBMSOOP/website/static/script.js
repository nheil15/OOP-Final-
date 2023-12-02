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
    
    document.getElementById('print-receipt-btn').addEventListener('click', printReceipt);
    

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

    // ...

checkoutBtn.addEventListener('click', () => {
    const amountGiven = parseFloat(amountGivenInput.value) || 0;
    const totalAmount = cartData.reduce((total, product) => total + (product.price * product.quantity), 0);
    const change = (amountGiven - totalAmount).toFixed(2);

    if (change >= 0) {
      updateReceiptContent(parseFloat(change));

      document.getElementById('amount-given').innerText = `Php ${amountGiven.toFixed(2)}`;
      document.getElementById('change').innerText = `Php ${change}`;
  
      const cartForReceipt = [...cartData];
      cartData = [];
      localStorage.setItem('cart', JSON.stringify(cartData));
      updateCart();
      
      cartData = cartForReceipt;
      updateReceiptContent(parseFloat(change));
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
    
