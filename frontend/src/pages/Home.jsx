import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Wrench, ShieldCheck, MapPin, Users, Building2, Star } from 'lucide-react';

const Home = () => {
  const { api } = useAuth();
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const res = await api.get('/garage/all');
        setGarages(res.data.data);
      } catch (err) {
        console.error('Failed to fetch garages', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGarages();
  }, [api]);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content text-center" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)', fontWeight: 'bold' }}>
            Premium Vehicle Service at Your Fingertips
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#e2e8f0', marginBottom: '40px', textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
            Book trusted garages for oil changes, tyre replacements, and full servicing instantly.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <a href="#garages" className="btn btn-white" style={{ padding: '12px 30px', fontSize: '1.1rem', borderRadius: '30px' }}>Find a Garage</a>
            <Link to="/register" className="btn btn-white-outline" style={{ padding: '12px 30px', fontSize: '1.1rem', borderRadius: '30px' }}>Become a Partner</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-8">
        <div className="grid-cols-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="glass-panel text-center" style={{ border: '1px solid #e2e8f0' }}>
            <Car size={40} color="var(--primary)" style={{ margin: '0 auto 15px' }} />
            <h3 className="mb-2">All Vehicle Types</h3>
            <p className="text-muted">From compact cars to SUVs, we've got you covered.</p>
          </div>
          <div className="glass-panel text-center" style={{ border: '1px solid #e2e8f0' }}>
            <Wrench size={40} color="var(--secondary)" style={{ margin: '0 auto 15px' }} />
            <h3 className="mb-2">Expert Mechanics</h3>
            <p className="text-muted">Only vetted and highly rated garages make the cut.</p>
          </div>
          <div className="glass-panel text-center" style={{ border: '1px solid #e2e8f0' }}>
            <ShieldCheck size={40} color="var(--success)" style={{ margin: '0 auto 15px' }} />
            <h3 className="mb-2">Guaranteed Quality</h3>
            <p className="text-muted">Services backed by our platform quality guarantee.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-4">
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '20px', padding: '30px' }}>
          <div className="text-center">
            <Users size={36} color="var(--primary)" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>500+</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '1.1rem' }}>Active Users</p>
          </div>
          <div className="text-center">
            <Building2 size={36} color="var(--secondary)" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>50+</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '1.1rem' }}>Partner Garages</p>
          </div>
          <div className="text-center">
            <Star size={36} color="#f59e0b" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>10k+</h3>
            <p className="text-muted" style={{ margin: 0, fontSize: '1.1rem' }}>Services Completed</p>
          </div>
        </div>
      </section>

      {/* Garages List */}
      <section id="garages" className="container py-8">
        <h2 className="text-center mb-8" style={{ fontSize: '2rem' }}>Available Garages</h2>
        {loading ? (
          <p className="text-center">Loading garages...</p>
        ) : garages.length > 0 ? (
          <div className="grid-cols-2">
            {garages.map((garage) => (
              <div key={garage._id} className="glass-panel">
                <div className="flex-between mb-4">
                  <h3 style={{ fontSize: '1.25rem' }}>{garage.name}</h3>
                  <span className="badge badge-approved">Verified</span>
                </div>
                <p className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '20px', justifyContent: 'flex-start', gap: '8px' }}>
                  <MapPin size={16} />
                  <span>{garage.email}</span> {/* Usually would have address here, but email is fine for now */}
                </p>
                <Link to={`/garage/${garage._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                  View Services
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted glass-panel">No verified garages available at the moment.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
