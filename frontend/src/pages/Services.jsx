import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const { api } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/garage/all-services');
        setServices(res.data.data);
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [api]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: '300px', width: '100%', marginBottom: '3rem', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <img src="/images/user_hero.png" alt="Services Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1597816172671-5b7f7375e01b?q=80&w=2000&auto=format&fit=crop' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', padding: '0 20px' }}>
          <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: '800', textShadow: '0 4px 10px rgba(0,0,0,0.8)', margin: 0, letterSpacing: '-1px' }}>All Services</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px', margin: '10px auto 0' }}>Browse through our comprehensive range of vehicle services.</p>
        </div>
      </div>

      <div className="container mb-12">
        {/* Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
            <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search services by name or description..."
              className="modern-input"
              style={{ paddingLeft: '45px', borderRadius: '30px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted py-8">Loading services...</div>
        ) : filteredServices.length > 0 ? (
          <div className="grid-cols-2">
            {filteredServices.map((service) => (
              <div key={service._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="flex-between mb-4">
                  <h3 style={{ fontSize: '1.25rem', color: 'white', margin: 0 }}>{service.name}</h3>
                  <span className="badge badge-approved" style={{ fontSize: '1rem' }}>${service.price}</span>
                </div>
                
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px', flexGrow: 1, lineHeight: '1.5' }}>
                  {service.description}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <MapPin size={16} color="var(--primary)" />
                    <span>Offered by: <strong style={{ color: 'white' }}>{service.garageOwnerId?.name || 'Unknown Garage'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <Clock size={16} color="var(--primary)" />
                    <span>Duration: <strong style={{ color: 'white' }}>{service.duration || 60} mins</strong></span>
                  </div>
                </div>
                
                <Link to={`/garage/${service.garageOwnerId?._id}`} className="btn btn-primary" style={{ width: '100%', display: 'inline-block', textAlign: 'center', marginTop: 'auto' }}>
                  Book Service
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel text-center text-muted py-8" style={{ padding: '3rem' }}>
            <h3>No services found</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
