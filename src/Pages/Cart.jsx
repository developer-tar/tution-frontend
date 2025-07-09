// Cart.jsx
import React, { useEffect, useState } from 'react';
import api from './api';

export default function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/cart')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Cart Items</h2>
      {items.map(item => (
        <div key={item.id}>
          {item.product_type} #{item.product_id} - Qty: {item.quantity}
        </div>
      ))}
    </div>
  );
}
