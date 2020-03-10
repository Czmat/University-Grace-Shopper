import React from 'react';

const Orders = ({ lineItems, orders, products })=> {
  return (
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
                            Quantity: {
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
  );
};

export default Orders;
