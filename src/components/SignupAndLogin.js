import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupAndLogin = () => {
  const [isLogin, setIsLogin] = useState(true); // Default to login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [headingStyle, setHeadingStyle] = useState({}); // Style for heading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const url = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/signup';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        // Parse JSON error response
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong.');
      }

      // Parse the successful response
      const data = await response.json();
      if (isLogin) {
        console.log('Login successful:', data);
        navigate('/dashboard');
      } else {
        console.log('Signup successful');
        navigate('/login');
      }
    } catch (err) {
      // Handle error responses gracefully
      setError('Error: ' + err.message);
    }
  };

  // Effect to trigger heading animation
  useEffect(() => {
    setHeadingStyle({ transform: 'scale(1.1)', transition: 'transform 0.2s' });
    const timeout = setTimeout(() => {
      setHeadingStyle({ transform: 'scale(1)', transition: 'transform 0.2s' });
    }, 200);

    return () => clearTimeout(timeout);
  }, [isLogin]);

  return (
    <div style={{
      maxWidth: '400px',
      margin: '5% auto',
      padding: '30px',
      borderRadius: '15px',
      backgroundColor: '#ffffff',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <h2 style={{
        color: isLogin ? '#333' : '#007bff',
        fontFamily: 'Arial, sans-serif',
        marginBottom: '20px',
        fontWeight: '600',
        ...headingStyle  // Apply heading animation style
      }}>
        {isLogin ? 'Welcome Back!' : 'Create an Account'}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: '15px',
            margin: '10px 0',
            borderRadius: '50px',
            border: '1px solid #007bff',
            transition: 'border-color 0.3s',
            outline: 'none'
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '15px',
            margin: '10px 0',
            borderRadius: '50px',
            border: '1px solid #007bff',
            transition: 'border-color 0.3s',
            outline: 'none'
          }}
          required
        />
        <button type="submit" style={{
          padding: '12px',
          borderRadius: '50px',
          border: 'none',
          backgroundColor: '#007bff',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.3s, transform 0.3s',
          marginTop: '15px',
          position: 'relative'
        }}>
          {isLogin ? 'Login' : 'Signup'}
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            zIndex: 0,
            transform: 'translate(-50%, -50%) scale(0)',
            transition: 'transform 0.5s'
          }}></span>
        </button>
      </form>
      {error && <p style={{ color: '#dc3545', marginTop: '15px' }}>{error}</p>}
      <p style={{ marginTop: '20px', color: '#555' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button onClick={() => setIsLogin(!isLogin)} style={{
          background: 'none',
          border: 'none',
          color: '#007bff',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'color 0.3s'
        }}>
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </p>
    </div>
  );
};

export default SignupAndLogin;
