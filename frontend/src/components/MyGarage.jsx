import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Trash2, Plus } from 'lucide-react';

const MyGarage = () => {
  const { api } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/vehicles');
      setVehicles(res.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/vehicles', formData);
      setVehicles(res.data.data);
      setShowForm(false);
      setFormData({ make: '', model: '', year: '', licensePlate: '' });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vehicle');
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const res = await api.delete(`/user/vehicles/${vehicleId}`);
      setVehicles(res.data.data);
    } catch (err) {
      setError('Failed to delete vehicle');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading Garage...</div>;

  return (
    <div className="card glass-card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Car /> My Garage
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary flex-between" 
          style={{ gap: '5px', padding: '6px 12px', fontSize: '0.9rem' }}
        >
          <Plus size={16} /> {showForm ? 'Cancel' : 'Add Vehicle'}
        </button>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div className="form-group">
            <label className="modern-label">Make (Brand)</label>
            <input 
              type="text" 
              name="make" 
              value={formData.make} 
              onChange={handleChange} 
              className="modern-input" 
              placeholder="e.g., Toyota" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="modern-label">Model</label>
            <input 
              type="text" 
              name="model" 
              value={formData.model} 
              onChange={handleChange} 
              className="modern-input" 
              placeholder="e.g., Camry" 
              required 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="modern-label">Year</label>
              <input 
                type="number" 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                className="modern-input" 
                placeholder="e.g., 2020" 
                min="1950" 
                max={new Date().getFullYear() + 1}
                required 
              />
            </div>
            <div className="form-group">
              <label className="modern-label">License Plate</label>
              <input 
                type="text" 
                name="licensePlate" 
                value={formData.licensePlate} 
                onChange={handleChange} 
                className="modern-input" 
                placeholder="Optional" 
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Save Vehicle
          </button>
        </form>
      )}

      {vehicles.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
          <Car size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
          <p>You haven't added any vehicles yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {vehicles.map(vehicle => (
            <div key={vehicle._id} className="flex-between" style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white' }}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </div>
                {vehicle.licensePlate && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ padding: '2px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', fontFamily: 'monospace' }}>
                      {vehicle.licensePlate}
                    </span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleDelete(vehicle._id)}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }}
                title="Delete Vehicle"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGarage;
