// app/ItemForm.js
'use client';

import { useState } from 'react';

export default function ItemForm() {
  const [name, setName] = useState('');
  const [ndc, setNdc] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, ndc, quantity }),
    });

    const data = await res.json();

    if (data.success) {
      alert('Item created successfully!');
    } else {
      alert('Failed to create item: ' + data.error);
    }

    setName('');
    setNdc('');
    setQuantity('');
  };

  return (

    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      
  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Item</h2>

  <div className="mb-4">
    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
    <input
      type="text"
      id="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="ndc" className="block text-sm font-medium text-gray-700">NDC:</label>
    <input
      type="text"
      id="ndc"
      value={ndc}
      onChange={(e) => setNdc(e.target.value)}
      required
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="mb-4">
    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity:</label>
    <input
      type="number"
      id="quantity"
      value={quantity}
      onChange={(e) => setQuantity(e.target.value)}
      required
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <button
    type="submit"
    className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    Submit
  </button>
</form>

  );
}
