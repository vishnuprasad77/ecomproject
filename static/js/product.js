const addToCartForm = document.getElementById('add-to-cart-form');

                    // Add an event listener to the form's submit event
                    addToCartForm.addEventListener('submit', function(event) {
                      event.preventDefault(); // Prevent the default form submission
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

                      // Function to obtain the token
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

                      // Function to add item to the cart using the obtained token
                      function addToCart(token) {
                          const formData = new FormData(addToCartForm);
                          const productId = formData.get('product');
                          const quantity = formData.get('quantity');

                          // Check if the item already exists in the cart
                          checkExistingCartItem(productId, token)
                            .then(existingCartItem => {
                              if (existingCartItem !== null) {
                                // If the item exists, update the quantity using the PUT method
                                const itemId = existingCartItem.id;
                                const newQuantity = parseInt(quantity);

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
                                    console.log('Item quantity updated in your cart');
                                    // alert('Item quantity updated in your cart');
                                  })
                                  .catch(error => {
                                    console.error('Error:', error);
                                    alert('Failed to update item quantity in cart');
                                  });
                              } else {
                                // If the item doesn't exist, add it to the cart using the POST method
                                fetch('http://127.0.0.1:8000/api/cart/', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({
                                    product: productId,
                                    quantity: quantity,
                                  }),
                                })
                                  .then(response => response.json())
                                  .then(data => {
                                    console.log(data);
                                    // alert('Item added to your cart');
                                    cartcount = document.getElementById('cartItemsCount').innerText;
                                    cartcount = parseInt(cartcount);
                                    cartcount++;
                                    document.getElementById('cartItemsCount').innerHTML = cartcount;
                                    // alert(cartcount);
                                    const messageElement = document.getElementById('cart-message');
                                    messageElement.textContent = 'Item added to cart';
                                    messageElement.style.display = 'block';
                
                                    // Hide the message after 2 seconds
                                    setTimeout(() => {
                                        messageElement.style.display = 'none';
                                    }, 2000);
                                  })
                                  .catch(error => {
                                    console.error('Error:', error);
                                    alert('Failed to add item to cart');
                                  });
                              }
                            });
                      }



                          function checkExistingCartItem(productId, token) {
                              return fetch('http://127.0.0.1:8000/api/cart/', {
                                method: 'GET',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`,
                                },
                              })
                                .then(response => {
                                  if (response.ok) {
                                    return response.json();
                                  } else {
                                    throw new Error('Failed to retrieve cart items');
                                  }
                                })
                                .then(data => {
                                  // Check if the product exists in the cart items
                                  const existingCartItem = data.find(item => item.product.id.toString() === productId.toString());
                                  console.log(existingCartItem)
                                  console.log(data)
                                  return existingCartItem || null;
                                })
                                .catch(error => {
                                  console.error('Error:', error);
                                  alert(error.message);
                                  return null;
                                });
                          }


                      // Call the getToken function to obtain the token
                      getToken()
                        .then(token => addToCart(token));
                    });