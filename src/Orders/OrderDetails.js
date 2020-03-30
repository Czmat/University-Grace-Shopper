import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom"
import axios from "axios"

export default function OrderDetails({ order }) {
  const orderDet = JSON.parse(window.localStorage.getItem("orderdetails"))
  console.log(orderDet)
  return <div>HI</div>
}
