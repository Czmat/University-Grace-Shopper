import React, { useState } from 'react';

const ManagedPromo = ({ promo, manageUser, updatePromo }) => {
  const [revisedPromo, setRevisedPromo] = useState({ promo });

  const onChange = ev => {
    const change = {};
    change[ev.target.name] =
      ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;
    setRevisedPromo({ ...revisedPromo, ...change });
  };

  const onSubmit = e => {
    e.preventDefault(e);
    updatePromo(revisedPromo);
  };

  //   <form onSubmit={onSubmit}>

  //   <div>
  //     <select name="type" value={word.type} onChange={onChange}>
  //       <option>verb</option>
  //       <option>noun</option>
  //       <option>adjective</option>
  //     </select>
  //     {word.type}
  //   </div>
  //   <div>
  //     <button disabled={!word.text}>Click me</button>
  //   </div>
  // </form>

  return (
    <div className="cart-container">
      <div className="product-card">
        <h4>Promo name: {promo.name}</h4>
        <form onSubmit={onSubmit}>
          <div>
            <input name="name" value={revisedPromo.name} onChange={onChange} />
            {revisedPromo.name}
          </div>
          <div>
            {promo.isActive ? 'Promo is active' : 'Promo is not active'}
          </div>
          <div>
            <input
              name="isActive"
              type="checkbox"
              checked={revisedPromo.isActive}
              onChange={onChange}
            />
          </div>
          <div>
            {revisedPromo.isActive ? 'Is Active is true' : 'is Active is false'}
          </div>
          <button>Make changes</button>
        </form>
      </div>
    </div>
  );
};

export default ManagedPromo;
