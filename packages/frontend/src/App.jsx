import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import { ConnectKitProvider } from 'connectkit';
import { WagmiConfig } from 'wagmi';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import TenantDashboard from './pages/TenantDashboard';
import CreateRental from './pages/CreateRental';
import Connect from './pages/Connect';
import HowItWorks from './pages/HowItWorks';
import Marketplace from './pages/Marketplace';
import Landlord from './pages/Landlord';
import Tenant from './pages/Tenant';
import NotFound from './pages/NotFound';

import { wagmiConfig } from './utils/wagmiConfig';

const App = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider>
        <Router>
          <RoleProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-gray-50">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
                <Route path="/tenant-dashboard" element={<TenantDashboard />} />
                <Route path="/create-rental" element={<CreateRental />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/landlord" element={<Landlord />} />
                <Route path="/tenant" element={<Tenant />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          </RoleProvider>
        </Router>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
