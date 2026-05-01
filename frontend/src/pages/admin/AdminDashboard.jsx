import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, X } from 'lucide-react';

const AdminDashboard = () => {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [api]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users as:', api.defaults.headers.common['Authorization']);
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Fetch users error:', err.response?.data || err.message);
    }
  };

  const approveGarage = async (id) => {
    try {
      await api.put(`/admin/approve-garage/${id}`);
      fetchUsers(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  const pendingGarages = users.filter(u => u.role === 'GARAGE_OWNER' && !u.isApproved);
  const otherUsers = users.filter(u => !(u.role === 'GARAGE_OWNER' && !u.isApproved));

  return (
    <div className="container py-8">
      <h2 className="text-center mb-8">Admin Dashboard</h2>

      <div className="mb-8">
        <h3 className="mb-4">Pending Garage Approvals</h3>
        {pendingGarages.length > 0 ? (
          <div className="grid-cols-2">
            {pendingGarages.map((garage) => (
              <div key={garage._id} className="glass-panel flex-between">
                <div>
                  <h4>{garage.name}</h4>
                  <p className="text-muted">{garage.email}</p>
                </div>
                <button onClick={() => approveGarage(garage._id)} className="btn btn-primary flex-between" style={{ gap: '5px' }}>
                  <Check size={16} /> Approve
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted glass-panel text-center">No pending garages.</p>
        )}
      </div>

      <div>
        <h3 className="mb-4">All Users & Approved Garages</h3>
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Role</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {otherUsers.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px' }}>{u.name}</td>
                  <td style={{ padding: '10px' }}>{u.email}</td>
                  <td style={{ padding: '10px' }}><span className="badge badge-pending">{u.role}</span></td>
                  <td style={{ padding: '10px' }}>
                    {u.isApproved ? <span className="badge badge-approved">Approved</span> : <span className="badge badge-rejected">Not Approved</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
