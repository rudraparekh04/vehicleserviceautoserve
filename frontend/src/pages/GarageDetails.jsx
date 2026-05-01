import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, DollarSign, CalendarPlus } from 'lucide-react';

const GarageDetails = () => {
  const { id } = useParams();
  const { api, user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`/garage/${id}/services`);
        setServices(res.data.data);
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [id, api]);

  const openBookingModal = (service) => {
    if (!user) {
      setBookingError('You must be logged in to book a service.');
      return;
    }
    
    setBookingError(null);
    setSelectedService(service);
    
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const confirmBooking = async () => {
    if (!bookingDate) {
      setBookingError('Please select a date.');
      setIsModalOpen(false);
      return;
    }

    try {
      setBookingError(null);
      await api.post('/user/bookings', {
        garageId: id,
        serviceId: selectedService._id,
        date: new Date(bookingDate).toISOString()
      });
      setBookingSuccess('Booking request sent successfully!');
      setIsModalOpen(false);
      setSelectedService(null);
      setTimeout(() => setBookingSuccess(null), 3000);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed');
      setIsModalOpen(false);
    }
  };

  if (loading) return <div className="container mt-8 text-center">Loading services...</div>;

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h2>Garage Services</h2>
        <p className="text-muted">Select a service below to request a booking.</p>
      </div>

      {bookingSuccess && <div className="badge badge-approved mb-4" style={{ display: 'block', textAlign: 'center', padding: '10px' }}>{bookingSuccess}</div>}
      {bookingError && <div className="badge badge-rejected mb-4" style={{ display: 'block', textAlign: 'center', padding: '10px' }}>{bookingError}</div>}

      <div className="grid-cols-2">
        {services.map((service) => (
          <div key={service._id} className="glass-panel">
            <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>{service.name}</h3>
            <p className="text-muted mb-4">{service.description}</p>
            
            <div className="flex-between mb-2">
              <span className="flex-between" style={{ gap: '5px', color: 'var(--success)' }}>
                <DollarSign size={16} />
                <strong>${service.price}</strong>
              </span>
              <span className="flex-between" style={{ gap: '5px', color: 'var(--text-muted)' }}>
                <Clock size={16} />
                {service.duration} hours
              </span>
            </div>
            
            <button 
              onClick={() => openBookingModal(service)} 
              className="btn btn-primary mt-4 flex-between" 
              style={{ width: '100%', gap: '8px' }}
            >
              <CalendarPlus size={16} />
              Book Service
            </button>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="glass-panel text-center text-muted">
          This garage has no services listed yet.
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && selectedService && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', position: 'relative' }}>
            <h3 className="mb-4">Confirm Booking</h3>
            
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <p className="mb-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Service:</span>
                <strong>{selectedService.name}</strong>
              </p>
              <p className="mb-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Price:</span>
                <span style={{ color: 'var(--success)' }}><strong>${selectedService.price}</strong></span>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Duration:</span>
                <span>{selectedService.duration} hours</span>
              </p>
            </div>
            
            <div className="form-group mb-6">
              <label className="form-label">Select Booking Date:</label>
              <input 
                type="date" 
                className="form-control" 
                value={bookingDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>

            <div className="flex-between" style={{ gap: '15px' }}>
              <button onClick={closeBookingModal} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={confirmBooking} className="btn btn-primary" style={{ flex: 1 }}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarageDetails;
