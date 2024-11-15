import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductBarChart from './ProductBarChart';

// Import your images
import imageA from '../assets/a.jpg';
import imageB from '../assets/b.jpg';
import imageC from '../assets/c.jpg';
import imageD from '../assets/d.jpg';

const Dashboard = ({ products }) => {
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    { url: imageA, caption: 'Welcome to Our Dashboard' },
    { url: imageB, caption: 'Manage Your Products Effectively' },
    { url: imageC, caption: 'Analyze Your Sales Trends' },
    { url: imageD, caption: 'Stay Ahead of the Competition' },
  ];

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    return isNaN(numericPrice) ? 'N/A' : numericPrice.toFixed(2);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Change this according to your storage method
    navigate('/login'); // Redirect to login after logout
  };

  // Rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [images.length]);

  return (
    <div style={{ padding: '30px', backgroundColor: '#e3f2fd', borderRadius: '10px', boxSizing: 'border-box', animation: 'fadeIn 0.7s' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
        <h2 style={{
          color: '#333',
          fontFamily: 'Arial, sans-serif',
          fontSize: '36px',
          fontWeight: 'bold',
          animation: 'wave 1.2s infinite alternate',
          transition: 'color 0.3s',
          background: 'linear-gradient(45deg, #0052cc, #00bfff)', // New gradient colors
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        }}>
          Dashboard
        </h2>
        <nav id='targetdash' style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/products" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold', transition: 'color 0.3s' }}>Product Management</Link>
          <Link to="/users" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold', transition: 'color 0.3s' }}>User Management</Link>
          <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s, transform 0.3s' }}>Logout</button>
        </nav>
      </header>

      <section style={{ marginTop: '30px' }}>
        {/* Image Carousel */}
        <div style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative', height: '400px', marginBottom: '30px' }}>
          <h3 style={{ padding: '10px', textAlign: 'center', backgroundColor: '#007bff', color: '#fff', borderRadius: '10px 10px 0 0', position: 'absolute', top: '0', width: '100%', zIndex: '1' }}>Rotating Pictures</h3>
          <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
            <img
              src={images[currentImageIndex].url}
              alt={`Slide ${currentImageIndex}`}
              style={{
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', // Keep aspect ratio and cover the area
                transition: 'opacity 0.5s ease-in-out',
                borderRadius: '10px',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '10px 15px',
              borderRadius: '5px',
            }}>
              {images[currentImageIndex].caption}
            </div>
          </div>
        </div>

        {/* Product Bar Chart */}
        <div style={{ border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#ffffff', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', padding: '15px' }}>
          <h3 style={{ color: '#555', fontFamily: 'Arial, sans-serif', padding: '10px', borderRadius: '10px 10px 0 0', backgroundColor: '#007bff', color: '#fff' }}>Products Added</h3>
          {products.length === 0 ? (
            <p style={{ color: '#777', padding: '20px' }}>No products have been added yet.</p>
          ) : (
            <div>
              <ProductBarChart products={products} /> {/* Render the ProductBarChart */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '12px', background: '#007bff', color: '#fff', fontWeight: 'bold' }}>Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', background: '#007bff', color: '#fff', fontWeight: 'bold' }}>Description</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', background: '#007bff', color: '#fff', fontWeight: 'bold' }}>Price</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', background: '#007bff', color: '#fff', fontWeight: 'bold' }}>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>{product.name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>{product.description}</td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>${formatPrice(product.price)}</td>
                      <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes wave {
          0% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;