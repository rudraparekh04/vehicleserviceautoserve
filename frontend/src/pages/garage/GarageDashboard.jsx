import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Check, X } from 'lucide-react';

const GarageDashboard = () => {
  const { api } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  
  // New service form state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, [api]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/garage/bookings');
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get('/garage/services');
      setServices(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await api.put(`/garage/bookings/${id}`, { status });
      fetchBookings(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/garage/services', {
        name: newServiceName,
        description: newServiceDesc,
        price: Number(newServicePrice),
        duration: Number(newServiceDuration)
      });
      setNewServiceName('');
      setNewServiceDesc('');
      setNewServicePrice('');
      setNewServiceDuration('');
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await api.delete(`/garage/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: '350px', width: '100%', marginBottom: '3rem', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img src="/images/garage_hero.png" alt="Garage Dashboard Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', padding: '0 20px' }}>
          <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: '800', textShadow: '0 4px 10px rgba(0,0,0,0.8)', margin: 0, letterSpacing: '-1px' }}>Workshop Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginTop: '15px', maxWidth: '600px', margin: '15px auto 0' }}>Manage incoming service requests and optimize your workshop operations.</p>
        </div>
      </div>

      <div className="container">
        <div className="flex-between mb-8" style={{ justifyContent: 'center', gap: '20px' }}>
        <button 
          className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('bookings')}
        >
          Manage Bookings
        </button>
        <button 
          className={`btn ${activeTab === 'services' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('services')}
        >
          Manage Services
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="grid-cols-2">
          {bookings.map((b) => (
            <div key={b._id} className="glass-panel">
              <div className="flex-between mb-2">
                <h4>{b.serviceId?.name || 'Deleted Service'}</h4>
                <span className={`badge ${b.status === 'PENDING' ? 'badge-pending' : b.status === 'APPROVED' ? 'badge-approved' : 'badge-rejected'}`}>
                  {b.status}
                </span>
              </div>
              <p className="text-muted mb-4">Customer: {b.userId?.name} | Date: {new Date(b.date).toLocaleDateString()}</p>
              
              {b.status === 'PENDING' && (
                <div className="flex-between mt-4">
                  <button onClick={() => updateBookingStatus(b._id, 'APPROVED')} className="btn btn-secondary flex-between" style={{ gap: '5px', color: 'var(--success)' }}>
                    <Check size={16} /> Approve
                  </button>
                  <button onClick={() => updateBookingStatus(b._id, 'REJECTED')} className="btn btn-secondary flex-between" style={{ gap: '5px', color: 'var(--danger)' }}>
                    <X size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
          {bookings.length === 0 && <p className="text-muted text-center" style={{ gridColumn: '1 / -1' }}>No bookings received yet.</p>}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="grid-cols-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <h3 className="mb-4">Add Service</h3>
            <form onSubmit={handleAddService}>
              <div className="form-group"><input type="text" placeholder="Service Name" className="form-control" value={newServiceName} onChange={e=>setNewServiceName(e.target.value)} required /></div>
              <div className="form-group"><input type="text" placeholder="Description" className="form-control" value={newServiceDesc} onChange={e=>setNewServiceDesc(e.target.value)} required /></div>
              <div className="form-group"><input type="number" placeholder="Price ($)" className="form-control" value={newServicePrice} onChange={e=>setNewServicePrice(e.target.value)} required /></div>
              <div className="form-group"><input type="number" placeholder="Duration (hours)" className="form-control" value={newServiceDuration} onChange={e=>setNewServiceDuration(e.target.value)} required /></div>
              <button type="submit" className="btn btn-primary flex-between" style={{ width: '100%', gap: '8px', justifyContent: 'center' }}><PlusCircle size={16} /> Add</button>
            </form>
          </div>
          <div className="grid-cols-2">
            {services.map((s) => (
              <div key={s._id} className="glass-panel">
                <h4>{s.name}</h4>
                <p className="text-muted mb-2">${s.price} | {s.duration} hours</p>
                <button onClick={() => handleDeleteService(s._id)} className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default GarageDashboard;
