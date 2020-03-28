import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
import ManagedPromo from './ManagedPromo';

const PromoManagement = ({ auth, users, promos, updatePromo }) => {
  const [promo, setPromo] = useState({});
  console.log(promos);
  //console.log(promo, 'one');
  //const promo = managedPromos.find(p => p.id === promoId);

  // const onClick = promoClicked => {
  //   setPromoId(promoClicked.id);
  // };

  return (
    <div>
      {!!promo.id && (
        <ManagedPromo
          promo={promo}
          updatePromo={updatePromo}
          // setUserId={setUserId}
          // manageUser={manageUser}
        />
      )}
      <h1>Promo Management</h1>
      <ul>
        {promos.map(promo => {
          return (
            <li key={promo.id}>
              <Link
                to="/promo/management"
                onClick={() => {
                  setPromo(promo);
                }}
              >
                {promo.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PromoManagement;
