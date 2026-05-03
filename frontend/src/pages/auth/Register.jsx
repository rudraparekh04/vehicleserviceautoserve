import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [localError, setLocalError] = useState('');
  const { user, register, error } = useAuth();
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

  const validatePassword = (pass) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
    if (!/\d/.test(pass)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password must contain at least one special character.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    const pwdError = validatePassword(password);
    if (pwdError) {
      setLocalError(pwdError);
      return;
    }
    await register(name, email, password, role);
  };

  return (
    <div className="auth-page">
      <div className="auth-image-side">
        <div className="auth-image-overlay"></div>
      </div>
      <div className="auth-form-side">
        <div className="auth-glass-panel">
          <div className="text-center mb-8">
            <UserPlus size={56} color="#8b5cf6" style={{ margin: '0 auto 15px' }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'white' }}>Create Account</h2>
            <p style={{ color: '#94a3b8' }}>Join the AutoServe platform</p>
          </div>

          {(error || localError) && (
            <div className="badge badge-rejected mb-4" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '8px' }}>
              {localError || error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label className="modern-label">Full Name</label>
              <input 
                type="text" 
                className="modern-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="Enter your full name"
              />
            </div>
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
            <div className="form-group mb-4">
              <label className="modern-label">Password</label>
              <input 
                type="password" 
                className="modern-input" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (localError) setLocalError('');
                }} 
                required 
                minLength="8"
                placeholder="Create a password"
              />
            </div>
            <div className="form-group mb-8">
              <label className="modern-label">I am a...</label>
              <select 
                className="modern-input" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ appearance: 'none' }}
              >
                <option value="USER">Customer (Looking for service)</option>
                <option value="GARAGE_OWNER">Garage Owner (Partner)</option>
              </select>
            </div>
            <button type="submit" className="btn-auth">
              Register
            </button>
          </form>

          <p className="text-center mt-6" style={{ color: '#94a3b8' }}>
            Already have an account? <Link to="/login" style={{ color: '#8b5cf6', fontWeight: '500', marginLeft: '5px' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
