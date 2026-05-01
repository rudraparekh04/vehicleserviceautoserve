import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import GarageDetails from './pages/GarageDetails';
import UserDashboard from './pages/user/UserDashboard';
import GarageDashboard from './pages/garage/GarageDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/garage/:id" element={<GarageDetails />} />

            {/* Common Authenticated Routes */}
            <Route element={<ProtectedRoute allowedRoles={['USER', 'GARAGE_OWNER', 'ADMIN']} />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* User Routes */}
            <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
              <Route path="/user" element={<UserDashboard />} />
            </Route>

            {/* Garage Routes */}
            <Route element={<ProtectedRoute allowedRoles={['GARAGE_OWNER', 'ADMIN']} />}>
              <Route path="/garage" element={<GarageDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
