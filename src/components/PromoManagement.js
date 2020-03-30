import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
import ManagedPromo from './ManagedPromo';
import CreatePromoForm from './CreatePromoForm';

const PromoManagement = ({
  auth,
  managedUsers,
  promos,
  updatePromo,
  createPromo,
}) => {
  const [createForm, setCreateForm] = useState(false);
  const [promo, setPromo] = useState({});
  const [revisedPromo, setRevisedPromo] = useState(promo);

  return (
    <div>
      {!!revisedPromo.id && (
        <ManagedPromo
          promo={promo}
          updatePromo={updatePromo}
          setPromo={setPromo}
          revisedPromo={revisedPromo}
          setRevisedPromo={setRevisedPromo}
          managedUsers={managedUsers}
        />
      )}
      <h1>Promo Management</h1>
      <h5>Update existing promos</h5>
      <ul>
        {promos.map(promo => {
          return (
            <li key={promo.id}>
              <Link
                to="/promo/management"
                onClick={() => {
                  setRevisedPromo(promo);
                }}
              >
                {promo.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <button onClick={() => setCreateForm(true)}>Create Promo</button>
      {!!createForm && (
        <CreatePromoForm
          createPromo={createPromo}
          managedUsers={managedUsers}
          setCreateForm={setCreateForm}
        />
      )}
    </div>
  );
};

export default PromoManagement;
