import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage'; // Rename App content as HomePage
import ViewCoursesPage from './ViewCoursesPage';

import './App.css';

function App() {


  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/home/ViewCourses" element={<ViewCoursesPage />} />
    </Routes>
  );
}

export default App;
