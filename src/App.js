import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom"
import qs from "qs"
import axios from "axios"
import Login from "./Login"
import Orders from "./Orders"
import Cart from "./Cart"
import Products from "./Products"
import Account from "./components/Account"
import Mycart from "./components/Mycart"
import ProductDetail from "./components/ProductDetail"
import SaveForLater from "./components/SaveForLater"
import Checkout from "./components/Checkout"
import Routes from "./Routes"
import CreateUser from "./components/CreateUser"
import Profile from "./components/Profile"
import FeaturedProduct from "./components/FeaturedProduct"

const headers = () => {
  const token = window.localStorage.getItem("token")
  return {
    headers: {
      authorization: token
    }
  }
}

const App = () => {
  const [auth, setAuth] = useState({})
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState({})
  const [saveForLater, setSaveForLater] = useState({})
  const [products, setProducts] = useState([])
  const [productDetail, setProductDetail] = useState({})
  const [lineItems, setLineItems] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  //not sure if I need it
  //const [userAccount, setUserAccount] = useState({});
  //console.log(orders, 'orders', cart, 'cart', lineItems, 'lineItems');

  useEffect(() => {
    axios.get("/api/products").then(response => setProducts(response.data))
  }, [])

  useEffect(() => {
    if (auth.id) {
      const token = window.localStorage.getItem("token")
      axios.get("/api/getLineItems", headers()).then(response => {
        setLineItems(response.data)
      })
    }
  }, [auth])

  useEffect(() => {
    if (auth.id) {
      axios.get("/api/getCart", headers()).then(response => {
        setCart(response.data)
      })
    }
  }, [auth])

  useEffect(() => {
    if (auth.id) {
      axios.get("/api/getSaveForLater", headers()).then(response => {
        setSaveForLater(response.data)
      })
    }
  }, [auth])

  useEffect(() => {
    if (auth.id) {
      axios.get("/api/getOrders", headers()).then(response => {
        setOrders(response.data)
      })
    }
  }, [auth])

  const login = async credentials => {
    const token = (await axios.post("/api/auth", credentials)).data.token
    console.log(credentials)
    //console.log('token', token);
    window.localStorage.setItem("token", token)
    exchangeTokenForAuth()
  }

  const exchangeTokenForAuth = async () => {
    const response = await axios.get("/api/auth", headers())
    console.log("exch", response.data)
    setAuth(response.data)
  }

  const logout = () => {
    window.location.hash = "#"
    window.localStorage.removeItem("token")
    setAuth({})

    // console.log('logout', auth);
  }
  //console.log('outside', auth);

  useEffect(() => {
    exchangeTokenForAuth()
  }, [])

  const createOrder = () => {
    const token = window.localStorage.getItem("token")
    axios
      .post("/api/createOrder", null, headers())
      .then(response => {
        setOrders([response.data, ...orders])
        const token = window.localStorage.getItem("token")
        return axios.get("/api/getCart", headers())
      })
      .then(response => {
        setCart(response.data)
      })
  }

  const getProductDetail = productId => {
    axios.get(`/api/products/${productId}`).then(response => {
      setProductDetail(response.data)
    })
  }

  const addToCart = (productId, quantity) => {
    axios
      .post("/api/addToCart", { productId, quantity }, headers())
      .then(response => {
        const lineItem = response.data
        const found = lineItems.find(_lineItem => _lineItem.id === lineItem.id)
        if (!found) {
          setLineItems([...lineItems, lineItem])
        } else {
          const updated = lineItems.map(_lineItem =>
            _lineItem.id === lineItem.id ? lineItem : _lineItem
          )
          setLineItems(updated)
        }
      })
  }

  const changeQtyInCart = (productId, quantity) => {
    axios
      .post("/api/changeQtyInCart", { productId, quantity }, headers())
      .then(response => {
        const lineItem = response.data
        const found = lineItems.find(_lineItem => _lineItem.id === lineItem.id)
        if (!found) {
          setLineItems([...lineItems, lineItem])
        } else {
          const updated = lineItems.map(_lineItem =>
            _lineItem.id === lineItem.id ? lineItem : _lineItem
          )
          setLineItems(updated)
        }
      })
  }

  const addBackToCart = (productId, quantity) => {
    axios
      .post("/api/addBackToCart", { productId, quantity }, headers())
      .then(response => {
        axios.get("/api/getLineItems", headers()).then(response => {
          setLineItems(response.data)
        })
      })
  }

  const addToSaveForLater = productId => {
    axios
      .post("/api/addToSaveForLater", { productId }, headers())
      .then(response => {
        // debugger;
        const lineItem = response.data

        const found = lineItems.find(
          _lineItem =>
            _lineItem.productId === lineItem.productId &&
            _lineItem.orderId === cart.id
        )

        //console.log(found, 'found', lineItem, 'lineitem');
        // if (!found) {
        //   setLineItems([...lineItems, lineItem]);
        // } else {

        // const updated = lineItems.map(_lineItem => {
        //   //console.log(_lineItem);
        //   return _lineItem.id === lineItem.id ? lineItem : _lineItem;
        // });
        // const test = updated.filter(li => li.id !== found.id);
        // console.log(found, 'wow', test);
        // console.log(updated, 'updated');
        // setLineItems(test);
        //setLineItems(lineItems.filter(_lineItem => _lineItem.id !== found.id));
        //}
        axios.get("/api/getLineItems", headers()).then(response => {
          setLineItems(response.data)
        })
      })
  }

  const removeFromCart = lineItemId => {
    axios.delete(`/api/removeFromCart/${lineItemId}`, headers()).then(() => {
      setLineItems(lineItems.filter(_lineItem => _lineItem.id !== lineItemId))
    })
  }

  const removeFromSave = lineItemId => {
    axios.delete(`/api/removeFromSave/${lineItemId}`, headers()).then(() => {
      setLineItems(lineItems.filter(_lineItem => _lineItem.id !== lineItemId))
    })
  }

  //creating user account
  const createUser = user => {
    //console.log(user, 'first in');
    axios.post("/api/user", user).then(response => {
      login({ username: user.username, password: user.password })
      //setUserAccount(response.data);
    })
  }

  const updateUser = user => {
    console.log(user)
    axios
      .put("/api/user", user)
      .then(response => console.log(response.data, "update response"))
  }

  const userCart = lineItems.filter(lineItem => lineItem.orderId === cart.id)

  let totalQty = 0
  const count = userCart.forEach(item => {
    totalQty += item.quantity
  })

  if (!auth.id) {
    return (
      <Router>
        <div>
          <nav className="header-container">
            <Link to="/">
              <h1 className="header-name">Grace Shopper</h1>
            </Link>
            <ul className="nav-bar">
              <li>
                <Link to="/products">Shop</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li>
                <Link to="/cart">
                  <i className="fas fa-shopping-bag"></i>
                  <span>{totalQty}</span>
                </Link>
                <Link to="/checkout"></Link>
              </li>
            </ul>
          </nav>
        </div>
        <Switch>
          <Route path="/" exact>
            <div className="horizontal">
              <FeaturedProduct products={products} />
            </div>
          </Route>
          <Route path="/login">
            <Login login={login} />
          </Route>
          <Route path="/products">
            <Products
              addToCart={addToCart}
              products={products}
              getProductDetail={getProductDetail}
              productDetail={productDetail}
            />
          </Route>
          <Route path="/register">
            <CreateUser login={login} createUser={createUser} />
          </Route>
          <Route path="/cart">
            <Mycart
              lineItems={lineItems}
              removeFromCart={removeFromCart}
              cart={cart}
              createOrder={createOrder}
              products={products}
              addToCart={addToCart}
              saveForLater={saveForLater}
              addToSaveForLater={addToSaveForLater}
              removeFromSave={removeFromSave}
              changeQtyInCart={changeQtyInCart}
              addBackToCart={addBackToCart}
              getProductDetail={getProductDetail}
            />
          </Route>
        </Switch>
      </Router>
    )
  } else {
    return (
      <Router>
        <div>
          <nav className="header-container">
            <Link to="/">
              <div>
                <h1 className="header-name">Grace Shopper</h1>
              </div>
            </Link>
            <ul className="nav-bar">
              <li>
                <Link to="/products">Shop</Link>
              </li>
              <li>
                <Link to="/account">Account</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li>
                <Link to="/cart">
                  <i className="fas fa-shopping-bag"></i>
                  <span>{totalQty}</span>
                </Link>
              </li>
            </ul>
            <button onClick={logout}>Logout {auth.username} </button>
          </nav>
          <Link to="/products"></Link>
        </div>
        <Switch>
          <Route path="/" exact>
            <div className="horizontal">
              <FeaturedProduct products={products} />
              {/* <Products
                addToCart={addToCart}
                products={products}
                getProductDetail={getProductDetail}
              /> */}
            </div>
          </Route>
          <Route path="/login">
            <Login login={login} />
          </Route>
          <Route path="/register">
            <CreateUser login={login} />
          </Route>
          <Route path="/profile">
            <Profile auth={auth} updateUser={updateUser} />
          </Route>
          <Route path="/products">
            <Products
              addToCart={addToCart}
              products={products}
              getProductDetail={getProductDetail}
            />
          </Route>
          <Route path="/account">
            <Account auth={auth} logout={logout} />
          </Route>
          <Route path="/cart">
            <Mycart
              lineItems={lineItems}
              removeFromCart={removeFromCart}
              cart={cart}
              createOrder={createOrder}
              products={products}
              addToCart={addToCart}
              saveForLater={saveForLater}
              addToSaveForLater={addToSaveForLater}
              changeQtyInCart={changeQtyInCart}
              productDetail={productDetail}
              getProductDetail={getProductDetail}
              removeFromSave={removeFromSave}
              addBackToCart={addBackToCart}
            />
          </Route>
          <Route path="/orders">
            <Orders
              cartItems={lineItems}
              products={products}
              orders={orders}
              cart={cart}
            />
          </Route>
          <Route path="/checkout">
            <Checkout
              cartItems={lineItems}
              products={products}
              setOrders={setOrders}
              auth={auth}
              cart={cart}
            />
          </Route>
          <Route path="/productDetails">
            <ProductDetail
              cartItems={lineItems}
              products={products}
              orders={orders}
              productDetail={productDetail}
              addToCart={addToCart}
              changeQtyInCart={changeQtyInCart}
            />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App
