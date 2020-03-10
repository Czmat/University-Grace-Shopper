import React, { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';
import Login from './Login';


const App = ()=> {
  const [ params, setParams ] = useState(qs.parse(window.location.hash.slice(1)));
  const [ auth, setAuth ] = useState({});
  const [ orders, setOrders ] = useState([]);
  const [ cart, setCart ] = useState({});
  const [ products, setProducts ] = useState([]);
  const [ lineItems, setLineItems ] = useState([]);



  useEffect(()=> {
    axios.get('/api/products')
      .then( response => setProducts(response.data));
  }, []);

  useEffect(()=> {
    if(auth.id){
      const token = window.localStorage.getItem('token');
      axios.get('/api/getLineItems', {
        headers: {
          authorization: token
        }
      })
      .then( response => {
        setLineItems(response.data);
      });
    }
  }, [ auth ]);
  
  useEffect(()=> {
    if(auth.id){
      const token = window.localStorage.getItem('token');
      axios.get('/api/getCart', {
        headers: {
          authorization: token
        }
      })
      .then( response => {
        setCart(response.data);
      });
    }
  }, [ auth ]);

  useEffect(()=> {
    if(auth.id){
      const token = window.localStorage.getItem('token');
      axios.get('/api/getOrders', {
        headers: {
          authorization: token
        }
      })
      .then( response => {
        setOrders(response.data);
      });
    }
  }, [ auth ]);

  const login = async(credentials)=> {
    const token = (await axios.post('/api/auth', credentials)).data.token;
    window.localStorage.setItem('token', token);
    exchangeTokenForAuth()
  };

  const exchangeTokenForAuth = async()=> {
    const token = window.localStorage.getItem('token');
    const response = await axios.get('/api/auth', {
      headers: {
        authorization: token
      }
    });
    setAuth(response.data);

  };

  const logout = ()=> {
    window.location.hash = '#';
    setAuth({});
  };

  useEffect(()=> {
    exchangeTokenForAuth();
  }, []);

  useEffect(()=> {
    window.addEventListener('hashchange', ()=> {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  const createOrder = ()=> {
    const token = window.localStorage.getItem('token');
    axios.post('/api/createOrder', null , {
      headers: {
        authorization: token
      }
    })
    .then( response => {
      setOrders([response.data, ...orders]);
      const token = window.localStorage.getItem('token');
      return axios.get('/api/getCart', {
        headers: {
          authorization: token
        }
      })
    })
    .then( response => {
      setCart(response.data);
    });
  };

  const addToCart = (productId)=> {
    const token = window.localStorage.getItem('token');
    axios.post('/api/addToCart', { productId }, {
      headers: {
        authorization: token
      }
    })
    .then( response => {
      const lineItem = response.data;
      const found = lineItems.find( _lineItem => _lineItem.id === lineItem.id);
      if(!found){
        setLineItems([...lineItems, lineItem ]);
      }
      else {
        const updated = lineItems.map(_lineItem => _lineItem.id === lineItem.id ? lineItem : _lineItem);
        setLineItems(updated);
      }
    });
  };

  const removeFromCart = (lineItemId)=> {
    const token = window.localStorage.getItem('token');
    axios.delete(`/api/removeFromCart/${lineItemId}`, {
      headers: {
        authorization: token
      }
    })
    .then( () => {
      setLineItems(lineItems.filter(_lineItem => _lineItem.id !== lineItemId ));
    });
  };

  const { view } = params;

  if(!auth.id){
    return (
      <Login login={ login }/>
    );
  }
  else {
    return (
      <div>
        <h1>Foo, Bar, Bazz.. etc Store</h1>
        <button onClick={ logout }>Logout { auth.username } </button>
        <div className='horizontal'>
          <div>
            <h2>Products</h2>
            <ul>
              {
                products.map( product => {
                  return (
                    <li key={ product.id }>
                      <span>
                      { product.name }
                      </span>
                      <span>
                      ${
                        Number(product.price).toFixed(2)
                      }
                      </span>
                      <button onClick={ ()=> addToCart(product.id)}>Add to Cart</button>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div>
            <h2>Cart - { cart.id && cart.id.slice(0, 4) }</h2>
            <button disabled={ !lineItems.find( lineItem => lineItem.orderId === cart.id )} onClick={ createOrder }>Create Order</button>
            <ul>
              {
                lineItems.filter( lineItem => lineItem.orderId === cart.id ).map( lineItem => {
                  const product = products.find( product => product.id === lineItem.productId);
                  return (
                    <li key={ lineItem.id }>
                      { product && product.name}
                      { ' ' }
                      <span className='quantity'>{ lineItem.quantity }</span>
                      <button onClick={ ()=> removeFromCart(lineItem.id)}>Remove From Cart</button>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div>
            <h2>Orders</h2>
            <ul>
              {
                orders.map( order => {
                  const _lineItems = lineItems.filter( lineItem => lineItem.orderId === order.id);
                  return (
                    <li key={ order.id }>
                      <div>
                        OrderID: { order.id.slice(0, 4) }
                        
                      </div>
                      <ul>
                        {
                          _lineItems.map( lineItem => {
                            const product = products.find( product => product.id === lineItem.productId);
                            return (
                              <li key={ lineItem.id}>
                                {
                                  product && product.name
                                }
                                <span className='quantity'>
                                  {
                                    lineItem.quantity
                                  }
                                </span>
                              </li>
                            );
                          })
                        }
                      </ul>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

export default App;
