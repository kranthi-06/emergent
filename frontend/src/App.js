import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import SensorMonitoring from './pages/SensorMonitoring';
import IrrigationControl from './pages/IrrigationControl';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import Weather from './pages/Weather';
import Settings from './pages/Settings';
import About from './pages/About';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            theme={theme}
            toggleTheme={toggleTheme}
          />
          
          <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sensors" element={<SensorMonitoring />} />
              <Route path="/irrigation" element={<IrrigationControl />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </Router>
  );
}
