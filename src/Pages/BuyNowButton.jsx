
import React from 'react';
import axios from 'axios';

const BuyNowButton = ({ stripePriceId, quantity = 1 }) => {
  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem('token'); // Bearer token

      const response = await axios.post(
        'https://workable-caiman-personally.ngrok-free.app/api/parent/checkout',
        { stripe_price_id: stripePriceId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      // If Laravel Cashier redirects, this part may not be reached
      if (response?.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Could not start checkout.');
    }
  };

  return <button onClick={handleBuyNow}>Buy Now</button>;
};

export default BuyNowButton;
