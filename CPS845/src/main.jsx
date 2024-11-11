import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './LoginPage';
import HomePage from './HomePage'; 
import ViewCoursesPage from './ViewCoursesPage';
import CoursePage from './CoursePage';
import CourseProjectsPage from './CourseProjectsPage';
import CourseSubmissionsPage from './CourseSubmissionsPage';
import CourseEvaluationsPage from './CourseEvaluationsPage';
import ProjectInstructions from './ProjectInstructions';
<<<<<<< HEAD
import Admin from './Admin';
=======
import ResetPassword from './ResetPassword';
>>>>>>> 8f93eef101ec39b150cafc11569b71cde9443a4c
import './main.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/ViewCourses" element={<ViewCoursesPage />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="/courses/:id/projects" element={<CourseProjectsPage />} />
        <Route path="/courses/:id/projects/:project_id" element={<ProjectInstructions />} />
        <Route path="/courses/:id/submissions" element={<CourseSubmissionsPage />} />
        <Route path="/courses/:id/evaluations" element={<CourseEvaluationsPage />} />
<<<<<<< HEAD
        <Route path="/admin" element={<Admin />} />
=======
        <Route path="/reset-password" element={<ResetPassword />} />
>>>>>>> 8f93eef101ec39b150cafc11569b71cde9443a4c
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
