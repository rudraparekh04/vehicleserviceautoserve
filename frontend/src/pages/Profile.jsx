import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container py-4">
      <div className="card glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem', color: 'var(--primary)', textAlign: 'center' }}>My Profile</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="flex-between" style={{ justifyContent: 'flex-start', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
              <User size={24} color="var(--primary)" />
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</strong>
              <div style={{ fontSize: '1.2rem', marginTop: '0.25rem', color: 'white' }}>{user.name}</div>
            </div>
          </div>

          <div className="flex-between" style={{ justifyContent: 'flex-start', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
              <Mail size={24} color="var(--primary)" />
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</strong>
              <div style={{ fontSize: '1.2rem', marginTop: '0.25rem', color: 'white' }}>{user.email}</div>
            </div>
          </div>

          <div className="flex-between" style={{ justifyContent: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
              <Shield size={24} color="var(--primary)" />
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Role</strong>
              <div style={{ marginTop: '0.5rem' }}>
                <span className={`badge ${user.role === 'ADMIN' ? 'badge-primary' : user.role === 'GARAGE_OWNER' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
