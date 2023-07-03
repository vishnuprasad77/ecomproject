$(document).ready(function(){
    let username 
    let password
    if( document.getElementById('usersname').textContent.trim() == 'admin' ){
      username = 'admin'; 
      password = 'admin'; 
      
    }
    else{
      username = 'veeru'; 
      password = 'veeru'; 
    }
    function getToken() {
                return fetch('http://127.0.0.1:8000/api/accounts/token/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: username,
                    password: password,
                  }),
                })
                  .then(response => response.json())
                  .then(data => data.access)
                  .catch(error => {
                    console.error('Error:', error);
                  });
              }
    function getCart(token) {
                  
                // obtain item details for the cart
                fetch('http://127.0.0.1:8000/api/cart/', {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    },
                   
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log(data);
                    if (data.length === 0) {
                        EmptyCart = document.getElementById(`emptycart`);
                        EmptyCart.innerHTML = 'Your cart Is Empty'
                    return;
                    }
                    const container = document.querySelector('.container');

                    let cartItemsHTML = '';
                    data.forEach(item => {
                        cartItemsHTML += `
                        <div id="item${item.id}" style="display:block;">
                            <div class="d-flex justify-content-center">
                            <div class="cart-item border border-dark p-3 mt-2 md-2 w-75">
                                <div class="row">
                                <div class="col-sm-5">
                                    <img src="${item.product.image}" alt="${item.product.product_name}" width="150" height="150">
                                    <h4>${item.product.product_name}</h4>
                                    </div>
                                <div class="col-sm-6">
                                    <p><b>Price: <span id="item_price${item.id}">&#8377;&nbsp;${item.price}</span></b></p>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p>Quantity</p>
                                        </div>
                                        <div class="col-sm-5">
                                            <input class="w-25" type="number" name="quantity" value=${item.quantity} onchange="updateQuantity(this, ${item.id})">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-1">
                                    <a href="#" onclick="deleteCartItem(${item.id})">
                                        <i class="fas fa-trash-alt fa-2x text-danger"></i>
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        `;
                    });

                    // Insert the cart items HTML into the container element
                    container.innerHTML = cartItemsHTML;

                    // Display the total price
                    const totalPriceElement = document.createElement('h2');
                    totalPriceElement.setAttribute('id', 'total_price');
                    totalPriceElement.classList.add('text-center');
                    totalPriceElement.classList.add('mt-5');
                    totalPriceElement.textContent = `Total Price: ${data[0].cart.total_price}`;
                    container.appendChild(totalPriceElement);
                    const buyButton = document.createElement('button');
                    buyButton.addEventListener('click', initiateRazorpayPayment);
                    buyButton.setAttribute('id', 'rzp-button1');
                    buyButton.textContent = 'Buy Now';
                    buyButton.classList.add('btn', 'btn-primary');
                    const containerDiv = document.createElement('div');
                    containerDiv.classList.add('text-center');
                    containerDiv.appendChild(buyButton);
                    container.appendChild(containerDiv);
                    console.log('cart details obtained');
                    })
                    .catch(error => {
                    console.error('Error:', error);
                    console.log('Failed to obtain cart details');
                    });
                      
              }
    getToken()
     .then(token => getCart(token));
})
function updateQuantity(input, itemId) {
    const newQuantity = input.value;
    let username 
    let password
    if( document.getElementById('usersname').textContent.trim() == 'admin' ){
      username = 'admin'; 
      password = 'admin'; 
      
    }
    else{
      username = 'veeru'; 
      password = 'veeru'; 
    }
    function getToken() {
                return fetch('http://127.0.0.1:8000/api/accounts/token/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: username,
                    password: password,
                  }),
                })
                  .then(response => response.json())
                  .then(data => data.access)
                  .catch(error => {
                    console.error('Error:', error);
                  });
              }
    function updateCart(token){
        fetch(`http://127.0.0.1:8000/api/cart/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id:itemId,
                        quantity: newQuantity,
                    }),
                    })
                    .then(response => response.json())
                    .then(data => {
                    console.log(data);
                    const itemPriceElement = document.getElementById(`item_price${itemId}`);
                    const itemtotalPriceElement = document.getElementById(`total_price`);
                    // alert(data.total_price)
                    // alert(data.price)
                    if (itemPriceElement) {
                        itemPriceElement.innerText = `₹ ${data.price}`; // Update the displayed price
                        itemtotalPriceElement.innerHTML = 'Total Price: ₹ '+data.total_price;
                    }
                    console.log('Item quantity updated in your cart');
                    })
                    .catch(error => {
                    console.error('Error:', error);
                    console.log('Failed to update item quantity in cart');
                    });
    }
    getToken()
     .then(token => updateCart(token));
}
function deleteCartItem(itemId) {
    let username 
    let password
    if( document.getElementById('usersname').textContent.trim() == 'admin' ){
      username = 'admin'; 
      password = 'admin'; 
      
    }
    else{
      username = 'veeru'; 
      password = 'veeru'; 
    }
    function getToken() {
                return fetch('http://127.0.0.1:8000/api/accounts/token/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: username,
                    password: password,
                  }),
                })
                  .then(response => response.json())
                  .then(data => data.access)
                  .catch(error => {
                    console.error('Error:', error);
                  });
              }
    function deleteItem(token){
        fetch(`http://127.0.0.1:8000/api/cart/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id:itemId,
                    }),
                    })
                    .then(response => response.json())
                    .then(data => {
                    console.log(data);
                    const itemElement = document.getElementById(`item${itemId}`);
                    const itemtotalPriceElement = document.getElementById(`total_price`);
                    itemElement.style.display = 'none';
                    cartcount = document.getElementById('cartItemsCount').innerText;
                    cartcount = parseInt(cartcount);
                    cartcount--;
                    document.getElementById('cartItemsCount').innerHTML = cartcount;
                    itemtotalPriceElement.innerHTML = 'Total Price: ₹ '+data.total_price;
                    console.log('Item deleted from your cart');
                    })
                    .catch(error => {
                    console.error('Error:', error);
                    console.log('Failed to delete item from your cart');
                    });
    }
    getToken()
     .then(token => deleteItem(token));
}



function initiateRazorpayPayment() {
// Get the CSRF token value from the cookie
const csrftoken = getCookie('csrftoken');
const totalPriceElement = document.getElementById('total_price');
const totalPrice = totalPriceElement.textContent.split(':')[1].trim();  // Extract the total price value
fetch('/cart/create-payment/', {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrftoken,  // Include the CSRF token in the request headers
},
body: JSON.stringify({
    amount: totalPrice, // Total amount in paise
}),
})
.then(response => response.json())
.then(data => {
    // Create a new Razorpay instance
    const razorpay = new Razorpay({
        key: 'rzp_test_fwcZCClgFt08G2',
        amount: data.amount,
        currency: 'INR',
        name: 'Foody',
        description: 'Payment for Order',
        order_id: data.id,
        handler: function (response) {
            // Handle the successful payment response
            console.log('Payment success:', response);
            alert('Payment successful!');
            // Redirect or perform further actions as needed
            // Delete all items in the cart
            deleteAllCartItems()
            .then(() => {
              console.log('Cart items deleted');
            })
            .catch(error => {
              console.error('Error deleting cart items:', error);
            });
        },
        prefill: {
            email: 'customer@example.com',
            contact: '987654321',
        },
    });

    // Open the Razorpay payment dialog
    razorpay.open();
})
.catch(error => {
    console.error('Error:', error);
    alert('Failed to initiate payment');
});
}


function deleteAllCartItems() {
  let username 
  let password
  if( document.getElementById('usersname').textContent.trim() == 'admin' ){
    username = 'admin'; 
    password = 'admin'; 
    
  }
  else{
    username = 'veeru'; 
    password = 'veeru'; 
  }
  function getToken() {
              return fetch('http://127.0.0.1:8000/api/accounts/token/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  username: username,
                  password: password,
                }),
              })
                .then(response => response.json())
                .then(data => data.access)
                .catch(error => {
                  console.error('Error:', error);
                });
            }
  function deleteAll(token) {
            return fetch('http://127.0.0.1:8000/api/delete-cart-items/', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Replace 'token' with your actual token value
              },
            })
              .then(response => {
                if (response.ok) {
                  console.log('Cart items deleted');// Reload the current page
                   window.location.reload(true);
                } else {
                  throw new Error('Failed to delete cart items');
                }
              })
              .catch(error => {
                console.error('Error:', error);
                throw error;
    });
  }
  getToken()
     .then(token => deleteAll(token));
}


// Function to get the value of the CSRF token from the cookie
function getCookie(name) {
let cookieValue = null;
if (document.cookie && document.cookie !== '') {
const cookies = document.cookie.split(';');
for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
    }
}
}
return cookieValue;
}