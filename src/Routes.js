import React from 'react';
import Home from './App';
// import Account from "./components/Account"
// import Login from "./Login"
// import Orders from "./Orders"
// import Cart from "./Cart"
// import Products from "./Products"

// import Account from "./components/Account"
// import Mycart from "./components/Mycart"

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <nav>
        <header className="header-container">
          <ul>
            <li>
              <div className="header-name">
                <Link to="/">
                  <h1>Grace Shopper</h1>
                </Link>
              </div>
            </li>
            {/* <div className="nav-bar">
              <li>
                <Link to="/login">Login</Link>
              </li> */}
            {/* <li>
                <Link to="/account">Account</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
            // </div> */}
          </ul>
        </header>
      </nav>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        {/* <Route path="/login" exact>
          <Login />
        </Route> */}
        {/* <Route path="/account" exact>
          <Account />
        </Route>
        <Route path="/orders" exact>
          <Orders />
        </Route> */}
        {/* <Route path="/orders" exact>
          <Cart />
          <i className="fas fa-shopping-bag"></i>
          <span>{totalQty}</span>
        </Route> */}
      </Switch>
    </Router>
  );
}

// const Header = ({ params, lineItems, cart }) => {
//   const userCart = lineItems.filter(lineItem => lineItem.orderId === cart.id)

//   let totalQty = 0
//   const count = userCart.forEach(item => {
//     totalQty += item.quantity
//   })

//             Login
//           </a>
//         </div>
//         <div>
//           <a
//             href={`#${qs.stringify({ view: "account" })}`}
//             className={params.view === "account" ? "selected" : ""}
//             onClick={e => {
//               //console.log('clicked');
//             }}
//           >
//             account
//           </a>
//         </div>
//         <div>
//           <a
//             href={`#${qs.stringify({ view: "cart" })}`}
//             className={params.view === "cart" ? "selected" : ""}
//             onClick={e => {
//               console.log("clicked")
//             }}
//           >
//             <i className="fas fa-shopping-bag"></i>
//             <span>{totalQty}</span>
//           </a>
//         </div>
//       </div>
//     </header>
//   )
// }
