import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const role = user.role.toUpperCase();
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'GARAGE_OWNER') {
        navigate('/garage');
      } else {
        navigate('/user');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="auth-page">
      <div className="auth-image-side">
        <div className="auth-image-overlay"></div>
      </div>
      <div className="auth-form-side">
        <div className="auth-glass-panel">
          <div className="text-center mb-8">
            <LogIn size={56} color="#8b5cf6" style={{ margin: '0 auto 15px' }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'white' }}>Welcome Back</h2>
            <p style={{ color: '#94a3b8' }}>Login to access your dashboard</p>
          </div>

          {error && (
            <div className="badge badge-rejected mb-4" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label className="modern-label">Email Address</label>
              <input 
                type="email" 
                className="modern-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group mb-8">
              <label className="modern-label">Password</label>
              <input 
                type="password" 
                className="modern-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn-auth">
              Login
            </button>
          </form>

          <p className="text-center mt-6" style={{ color: '#94a3b8' }}>
            Don't have an account? <Link to="/register" style={{ color: '#8b5cf6', fontWeight: '500', marginLeft: '5px' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
