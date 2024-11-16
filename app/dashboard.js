// app/Dashboard.js
'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch('/api/items');
      const data = await res.json();
      if (data.success) {
        console.log(data.data); //debugging line to check data
        setItems(data.data);
      } else {
        alert('Failed to fetch items: ' + data.error);
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (ndc) => {
    console.log(`Attempting to delete item with ndc: ${ ndc }`); //Debugging Line
    const res = await fetch(`/api/items?ndc=${ndc}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      setItems(items.filter(item => item.ndc !== ndc));
    } else {
      alert('Failed to delete item: ' + data.error);
    }
  };

  const handleUpdate = async (ndc, updatedItem) => {
    console.log(`Update button clicked for item with ndc: ${ndc}`);
    const res = await fetch(`/api/items?ndc=${ndc}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    });
    const data = await res.json();
    if (data.success) {
      setItems(items.map(item => (item.ndc === ndc ? data.data : item)));
      setEditItem(null);
    } else {
      alert('Failed to update item: ' + data.error);
    }
  };

  return (
    <div className="container mx-auto p-6">
  <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Inventory Dashboard</h1>
  <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
    <table className="min-w-full table-auto text-left border-collapse">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-3 px-6 text-sm font-medium text-gray-600 border-b">Name</th>
          <th className="py-3 px-6 text-sm font-medium text-gray-600 border-b">NDC</th>
          <th className="py-3 px-6 text-sm font-medium text-gray-600 border-b">Quantity</th>
          <th className="py-3 px-6 text-sm font-medium text-gray-600 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.ndc} className="hover:bg-gray-50 transition-colors duration-200">
            <td className="py-3 px-6 text-sm text-gray-800 border-b">{item.name}</td>
            <td className="py-3 px-6 text-sm text-gray-800 border-b">{item.ndc}</td>
            <td className="py-3 px-6 text-sm text-gray-800 border-b">{item.quantity}</td>
            <td className="py-3 px-6 text-sm border-b">
              <button
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-3"
                onClick={() => setEditItem(item)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={() => {
                  handleDelete(item.ndc);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {editItem && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Item</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(editItem.ndc, {
              name: e.target.name.value,
              ndc: e.target.ndc.value,
              quantity: e.target.quantity.value,
            });
          }}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              id="name"
              defaultValue={editItem.name}
              name="name"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ndc" className="block text-sm font-medium text-gray-700">NDC:</label>
            <input
              type="text"
              id="ndc"
              defaultValue={editItem.ndc}
              name="ndc"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity:</label>
            <input
              type="number"
              id="quantity"
              defaultValue={editItem.quantity}
              name="quantity"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditItem(null)}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

  );
}
