import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage'; // Rename App content as HomePage
import supabase from '../supabaseClient';

import './App.css';

function App() {
  console.log(supabase)

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;
