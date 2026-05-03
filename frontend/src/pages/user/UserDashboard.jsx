import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, CheckCircle, Clock, MapPin, Plus, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import MyGarage from '../../components/MyGarage';

const UserDashboard = () => {
  const { api } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, garagesRes] = await Promise.all([
          api.get('/user/bookings'),
          api.get('/garage/all')
        ]);
        setBookings(bookingsRes.data.data);
        setGarages(garagesRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  if (loading) return <div className="container mt-8 text-center">Loading your dashboard...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: '350px', width: '100%', marginBottom: '3rem', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img src="/images/user_hero.png" alt="User Dashboard Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', padding: '0 20px' }}>
          <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: '800', textShadow: '0 4px 10px rgba(0,0,0,0.8)', margin: 0, letterSpacing: '-1px' }}>Welcome Back</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginTop: '15px', maxWidth: '600px', margin: '15px auto 0' }}>Track your vehicle's health and upcoming service appointments.</p>
        </div>
      </div>

      <div className="container mb-12">
        {/* Garage Section */}
        <div style={{ marginBottom: '4rem' }}>
          <MyGarage />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', position: 'relative' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>My Bookings</h2>
        </div>

      {bookings.length > 0 ? (
        <div className="grid-cols-2 mb-12">
          {bookings.map((booking) => (
            <div key={booking._id} className="glass-panel">
              <div className="flex-between mb-4">
                <h3 style={{ fontSize: '1.1rem' }}>{booking.serviceId?.name || 'Deleted Service'}</h3>
                <span className={`badge ${booking.status === 'PENDING' ? 'badge-pending' : booking.status === 'APPROVED' ? 'badge-approved' : 'badge-rejected'}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-muted mb-2">Garage: {booking.garageId?.name || 'Unknown'}</p>
              <div className="flex-between" style={{ color: 'var(--text-muted)' }}>
                <span className="flex-between" style={{ gap: '5px' }}>
                  <Calendar size={16} />
                  {new Date(booking.date).toLocaleDateString()}
                </span>
                <span className="flex-between" style={{ gap: '5px', color: 'var(--primary)' }}>
                  ${booking.serviceId?.price || '0'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel text-center mb-12" style={{ padding: '3rem', background: 'rgba(255,255,255,0.02)' }}>
          <Clock size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '1rem', color: 'white' }}>No Active Bookings</h3>
          <p style={{ color: 'var(--text-muted)' }}>You haven't scheduled any services yet. Browse available garages below to get started.</p>
        </div>
      )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>Available Garages</h2>
        </div>
      
      {garages.length > 0 ? (
        <div className="grid-cols-2">
          {garages.map((garage) => (
            <div key={garage._id} className="glass-panel">
              <div className="flex-between mb-4">
                <h3 style={{ fontSize: '1.25rem' }}>{garage.name}</h3>
                <span className="badge badge-approved">Verified</span>
              </div>
              <p className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '20px', justifyContent: 'flex-start', gap: '8px' }}>
                <MapPin size={16} />
                <span>{garage.email}</span>
              </p>
              <Link to={`/garage/${garage._id}`} className="btn btn-primary" style={{ width: '100%', display: 'inline-block', textAlign: 'center' }}>
                View Services
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel text-center text-muted">
          No verified garages available at the moment.
        </div>
      )}
      </div>
    </div>
  );
};

export default UserDashboard;
