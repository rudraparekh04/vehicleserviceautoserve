import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, LogOut, User, LayoutDashboard, List } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const role = user.role.toUpperCase();
    if (role === 'ADMIN') return '/admin';
    if (role === 'GARAGE_OWNER') return '/garage';
    return '/user';
  };

  return (
    <nav className="glass-nav">
      <div className="container flex-between py-4">
        <Link to="/" className="flex-between" style={{ gap: '10px' }}>
          <Wrench size={28} color="var(--primary)" />
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>AutoServe</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <NavLink to="/services" className="nav-link">
            <List size={18} />
            <span>Services</span>
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" className="nav-link">
                <User size={18} />
                <span>Profile</span>
              </NavLink>
              <NavLink to={getDashboardLink()} className="nav-link">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <button onClick={handleLogout} className="btn btn-secondary flex-between" style={{ gap: '5px' }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex-between" style={{ gap: '5px', color: 'var(--text-muted)' }}>
                <User size={18} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
