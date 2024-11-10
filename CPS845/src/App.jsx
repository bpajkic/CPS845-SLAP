import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage'; 
import ViewCoursesPage from './ViewCoursesPage';
import CoursePage from './CoursePage';
import CourseProjectsPage from './CourseProjectsPage';
import CourseSubmissionsPage from './CourseSubmissionsPage';
import CourseEvaluationsPage from './CourseEvaluationsPage';

import './App.css';

function App() {


  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/home/ViewCourses" element={<ViewCoursesPage />} />
      <Route path="/courses/:id" element={<CoursePage />} />
      <Route path="/courses/:id/projects" element={<CourseProjectsPage />} />
      <Route path="/courses/:id/submissions" element={<CourseSubmissionsPage />} />
      <Route path="/courses/:id/evaluations" element={<CourseEvaluationsPage />} />
    </Routes>
  );
}

export default App;
