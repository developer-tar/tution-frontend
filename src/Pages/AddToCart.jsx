// AddToCart.jsx
import React, { useState } from 'react';
import api from "../api";

export default function AddToCart() {
  const [productId, setProductId] = useState(1);

  const handleAdd = async () => {
    try {
      const res = await api.post('cart/add', {
        product_id: productId,
        product_type: 'course',
        quantity: 1,
      });
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  return (
    <div>
      <h1>Add to Cart</h1>
      <button onClick={handleAdd}>Add Product {productId}</button>
    </div>
  );
}
