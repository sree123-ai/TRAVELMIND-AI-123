import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LanguageSelection } from './pages/LanguageSelection';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Questionnaire } from './pages/Questionnaire';
import { AIAnalysis } from './pages/AIAnalysis';
import { Recommendations } from './pages/Recommendations';
import { DestinationDetails } from './pages/DestinationDetails';
import { Itinerary } from './pages/Itinerary';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LanguageSelection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/analysis" element={<AIAnalysis />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/destination/:id" element={<DestinationDetails />} />
                <Route path="/itinerary" element={<Itinerary />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
