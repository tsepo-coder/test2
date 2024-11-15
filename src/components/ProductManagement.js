import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductManagement = ({ setProducts }) => { // Receive setProducts from App
  const [products, setLocalProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setLocalProducts(data);
      setProducts(data); // Update shared products state
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `http://localhost:5000/api/products/${editingProduct.id}` : 'http://localhost:5000/api/products';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      fetchProducts(); // Refresh the product list after adding/updating
      setNewProduct({ name: '', description: '', price: '', quantity: '' });
      setError('');
      setEditingProduct(null); // Reset editing state
    } catch (err) {
      console.error('Error adding/updating product:', err);
      setError('Error adding/updating product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
  };

  const handleSellProduct = async (id) => {
    const product = products.find((p) => p.id === id);
    if (product && product.quantity > 0) {
      const updatedQuantity = product.quantity - 1;
      try {
        await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...product, quantity: updatedQuantity }),
        });
        fetchProducts();
      } catch (err) {
        console.error('Error selling product:', err);
        setError('Error selling product');
      }
    } else {
      setError('Product is out of stock');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Error deleting product');
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
        <h2 style={{ color: '#343a40', fontFamily: 'Arial, sans-serif' }}>Product Management</h2>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
            <li style={{ marginRight: '15px' }}><Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>Dashboard</Link></li>
            <li style={{ marginRight: '15px' }}><Link to="/users" style={{ textDecoration: 'none', color: '#007bff' }}>User Management</Link></li>
          </ul>
          <button onClick={handleLogout} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </nav>
      </header>

      {error && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>{error}</p>}
      <form onSubmit={handleAddProduct} style={{ margin: '20px 0', display: 'flex', flexDirection: 'column' }}>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          style={{ padding: '10px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ced4da' }}
        />
        <input
          type="text"
          name="description"
          value={newProduct.description}
          onChange={handleChange}
          placeholder="Description"
          required
          style={{ padding: '10px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ced4da' }}
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleChange}
          placeholder="Price"
          step="0.01"
          required
          style={{ padding: '10px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ced4da' }}
        />
        <input
          type="number"
          name="quantity"
          value={newProduct.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          style={{ padding: '10px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ced4da' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <h3 style={{ color: '#343a40', fontFamily: 'Arial, sans-serif' }}>Product List</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ced4da', padding: '10px', background: '#007bff', color: '#fff' }}>Name</th>
            <th style={{ border: '1px solid #ced4da', padding: '10px', background: '#007bff', color: '#fff' }}>Description</th>
            <th style={{ border: '1px solid #ced4da', padding: '10px', background: '#007bff', color: '#fff' }}>Price</th>
            <th style={{ border: '1px solid #ced4da', padding: '10px', background: '#007bff', color: '#fff' }}>Quantity</th>
            <th style={{ border: '1px solid #ced4da', padding: '10px', background: '#007bff', color: '#fff' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ border: '1px solid #ced4da', padding: '10px' }}>{product.name}</td>
              <td style={{ border: '1px solid #ced4da', padding: '10px' }}>{product.description}</td>
              <td style={{ border: '1px solid #ced4da', padding: '10px' }}>M{product.price}</td>
              <td style={{ border: '1px solid #ced4da', padding: '10px' }}>{product.quantity}</td>
              <td style={{ border: '1px solid #ced4da', padding: '10px' }}>
                <button onClick={() => handleEditProduct(product)} style={{ marginRight: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleSellProduct(product.id)} style={{ marginRight: '5px', backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Sell</button>
                <button onClick={() => handleDeleteProduct(product.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;