import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import ThreatLog from './components/ThreatLog';
import Settings from './components/Settings';

function App() {
  const [activeView, setActiveView] = useState('monitor');

  return (
    <>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      {activeView === 'monitor' && <Dashboard />}
      {activeView === 'analytics' && <Analytics />}
      {activeView === 'threats' && <ThreatLog />}
      {activeView === 'settings' && <Settings />}
    </>
  );
}

export default App;

