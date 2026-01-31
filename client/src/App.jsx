import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import MyOrders from './pages/MyOrders';
import Chat from './pages/Chat';
import ChatList from './pages/ChatList';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import FarmerDashboard from './pages/FarmerDashboard';
import MyProducts from './pages/MyProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import FarmerOrders from './pages/FarmerOrders';
import ProductDetail from './pages/ProductDetail';
import BuyPage from './pages/BuyPage';
import PrivateRoute from './components/PrivateRoute';
import LanguageSelection from './components/LanguageSelection';
import LandingPage from './pages/LandingPage';
import TransactionHistory from './pages/TransactionHistory';
import ChatBot from './components/ChatBot';
import { useNavigate } from 'react-router-dom';

const LanguageWrapper = () => {
  const navigate = useNavigate();
  return <LanguageSelection onSelect={() => navigate('/home')} />;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavAndContainer = location.pathname === '/' || location.pathname === '/home';

  return (
    <>
      {!hideNavAndContainer && <Navigation />}
      <div className={hideNavAndContainer ? "" : "container"}>
        <Routes>
          <Route path="/" element={<LanguageWrapper />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Note: The original '/' route for Dashboard is shadowed by LanguageWrapper. 
              Ideally Dashboard should be moved to '/dashboard' or similar if reachable.
              Leaving as is per request structure. */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/marketplace" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
          <Route path="/product/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
          <Route path="/buy/:id" element={<PrivateRoute><BuyPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />

          {/* Farmer Routes */}
          <Route path="/farmer-dashboard" element={<PrivateRoute><FarmerDashboard /></PrivateRoute>} />
          <Route path="/my-products" element={<PrivateRoute><MyProducts /></PrivateRoute>} />
          <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          <Route path="/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
          <Route path="/farmer-orders" element={<PrivateRoute><FarmerOrders /></PrivateRoute>} />
          <Route path="/chats" element={<PrivateRoute><ChatList /></PrivateRoute>} />
          <Route path="/chat/:userId" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/success" element={<PrivateRoute><Success /></PrivateRoute>} />
          <Route path="/cancel" element={<PrivateRoute><Cancel /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><TransactionHistory /></PrivateRoute>} />
        </Routes>
      </div>
      <ChatBot />
    </>
  );
};

import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppContent />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
