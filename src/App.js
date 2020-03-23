import React, { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';
import Login from './Login';
import Orders from './Orders';
import Cart from './Cart';
import Products from './Products';
import Header from './Header';
import Account from './components/Account';
import Mycart from './components/Mycart';
import SaveForLater from './components/SaveForLater';

const headers = () => {
  const token = window.localStorage.getItem('token');
  return {
    headers: {
      authorization: token,
    },
  };
};

const App = () => {
  //console.log('HELLO CHAISE!!!');
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)));
  const [auth, setAuth] = useState({});
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [saveForLater, setSaveForLater] = useState({});
  const [products, setProducts] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  console.log(orders, 'orders', cart, 'cart', lineItems, 'lineItems');

  useEffect(() => {
    axios.get('/api/products').then(response => setProducts(response.data));
  }, []);

  useEffect(() => {
    if (auth.id) {
      const token = window.localStorage.getItem('token');
      axios.get('/api/getLineItems', headers()).then(response => {
        setLineItems(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/getCart', headers()).then(response => {
        setCart(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/getSaveForLater', headers()).then(response => {
        setSaveForLater(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get('/api/getOrders', headers()).then(response => {
        setOrders(response.data);
      });
    }
  }, [auth]);

  const login = async credentials => {
    const token = (await axios.post('/api/auth', credentials)).data.token;
    //console.log('token', token);
    window.localStorage.setItem('token', token);
    exchangeTokenForAuth();
  };

  const exchangeTokenForAuth = async () => {
    const response = await axios.get('/api/auth', headers());
    //console.log('exch', response.data);
    setAuth(response.data);
  };

  const logout = () => {
    window.location.hash = '#';
    setAuth({});
    // console.log('logout', auth);
  };
  //console.log('outside', auth);

  useEffect(() => {
    exchangeTokenForAuth();
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  const createOrder = () => {
    const token = window.localStorage.getItem('token');
    axios
      .post('/api/createOrder', null, headers())
      .then(response => {
        setOrders([response.data, ...orders]);
        const token = window.localStorage.getItem('token');
        return axios.get('/api/getCart', headers());
      })
      .then(response => {
        setCart(response.data);
      });
  };

  const addToCart = (productId, quantity) => {
    axios
      .post('/api/addToCart', { productId, quantity }, headers())
      .then(response => {
        const lineItem = response.data;
        const found = lineItems.find(_lineItem => _lineItem.id === lineItem.id);
        if (!found) {
          setLineItems([...lineItems, lineItem]);
        } else {
          const updated = lineItems.map(_lineItem =>
            _lineItem.id === lineItem.id ? lineItem : _lineItem
          );
          setLineItems(updated);
        }
      });
  };

  const addToSaveForLater = productId => {
    axios
      .post('/api/addToSaveForLater', { productId }, headers())
      .then(response => {
        const lineItem = response.data;
        const found = lineItems.find(_lineItem => _lineItem.id === lineItem.id);
        // if (!found) {
        //   setLineItems([...lineItems, lineItem]);
        // } else {
        const updated = lineItems.map(_lineItem =>
          _lineItem.id === lineItem.id ? lineItem : _lineItem
        );
        setLineItems(updated);
        //}
      });
  };

  const removeFromCart = lineItemId => {
    axios.delete(`/api/removeFromCart/${lineItemId}`, headers()).then(() => {
      setLineItems(lineItems.filter(_lineItem => _lineItem.id !== lineItemId));
    });
  };

  const { view } = params;

  if (!auth.id) {
    return <Login login={login} />;
  } else {
    return (
      <div>
        <Header params={params} lineItems={lineItems} cart={cart} />
        <button onClick={logout}>Logout {auth.username} </button>
        {params.view === 'account' && (
          <Account auth={auth} params={params} logout={logout} />
        )}
        {params.view === 'cart' && (
          <Mycart
            lineItems={lineItems}
            removeFromCart={removeFromCart}
            cart={cart}
            createOrder={createOrder}
            products={products}
            addToCart={addToCart}
            saveForLater={saveForLater}
            addToSaveForLater={addToSaveForLater}
          />
        )}
        <div className="horizontal">
          <Products addToCart={addToCart} products={products} />
          <Cart
            lineItems={lineItems}
            removeFromCart={removeFromCart}
            cart={cart}
            createOrder={createOrder}
            products={products}
          />

          <Orders lineItems={lineItems} products={products} orders={orders} />
        </div>
      </div>
    );
  }
};

export default App;
