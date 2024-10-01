import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import Trade from './pages/Trade';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className='container'>
          <Routes>
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/trade" element={<Trade />} />
          </Routes>
        </div>
        </div>
    </Router>
  );
}

export default App;
