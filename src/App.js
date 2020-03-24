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
import SaveForLater from "./components/SaveForLater"
import Checkout from "./components/Checkout"

const headers = () => {
  const token = window.localStorage.getItem("token")
  return {
    headers: {
      authorization: token
    }
  }
}

const App = () => {
  //console.log('HELLO CHAISE!!!');
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)))
  const [auth, setAuth] = useState({})
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState({})
  const [saveForLater, setSaveForLater] = useState({})
  const [products, setProducts] = useState([])
  const [lineItems, setLineItems] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)

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
    //console.log('token', token);
    window.localStorage.setItem("token", token)
    exchangeTokenForAuth()
  }

  const exchangeTokenForAuth = async () => {
    const response = await axios.get("/api/auth", headers())
    //console.log('exch', response.data);
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

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      setParams(qs.parse(window.location.hash.slice(1)))
    })
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

  const addToSaveForLater = productId => {
    axios
      .post("/api/addToSaveForLater", { productId }, headers())
      .then(response => {
        const lineItem = response.data
        const found = lineItems.find(_lineItem => _lineItem.id === lineItem.id)
        // if (!found) {
        //   setLineItems([...lineItems, lineItem]);
        // } else {
        const updated = lineItems.map(_lineItem =>
          _lineItem.id === lineItem.id ? lineItem : _lineItem
        )
        setLineItems(updated)
        //}
      })
  }

  const removeFromCart = lineItemId => {
    axios.delete(`/api/removeFromCart/${lineItemId}`, headers()).then(() => {
      setLineItems(lineItems.filter(_lineItem => _lineItem.id !== lineItemId))
    })
  }

  const { view } = params
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
              <Link to="/products"></Link>
            </Link>
            <ul className="nav-bar">
              <li></li>
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
              <Products addToCart={addToCart} products={products} />
            </div>
          </Route>
          <Route path="/login">
            <Login login={login} />
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
                <Link to="/login">Login</Link>
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
              <Products addToCart={addToCart} products={products} />
            </div>
          </Route>
          <Route path="/login">
            <Login login={login} />
          </Route>
          <Route path="/products">
            <Products addToCart={addToCart} products={products} />
          </Route>
          <Route path="/account">
            <Account auth={auth} params={params} logout={logout} />
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
              isSubmitted={isSubmitted}
              setIsSubmitted={setIsSubmitted}
            />
          </Route>
          <Route path="/orders">
            <Orders
              cartItems={lineItems}
              products={products}
              orders={orders}
              params={params}
              setOrders={setOrders}
              auth={auth}
              cart={cart}
              isSubmitted={isSubmitted}
              setIsSubmitted={setIsSubmitted}
            />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App
