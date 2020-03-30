import React from 'react';

const OrderDetails = ({ order }) => {
  if (order.id) {
    return (
      <div>
        Order details!
        <h1>OrderID: {order.id.slice(0, 4)}</h1>
        <div>Status: {order.status}</div>
        <div>Total: ${order.total}</div>
      </div>
    );
  } else {
    return <div>Check out our Shop!</div>;
  }
};
export default OrderDetails;
