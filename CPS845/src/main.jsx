import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './LoginPage';
import HomePage from './HomePage'; 
import CreateSLAP from './CreateSLAP';
import CreateProject from './CreateProject';
import ViewCoursesPage from './ViewCoursesPage';
import CoursePage from './CoursePage';
import CourseProjectsPage from './CourseProjectsPage';
import CourseSubmissionsPage from './CourseSubmissionsPage';
import CourseEvaluationsPage from './CourseEvaluationsPage';
import ProjectInstructions from './ProjectInstructions';
import EditProject from './EditProject';
import UploadDocument from './UploadDocument';
import SubmitAssignment from './SubmitAssignment';
import SLAPDetails from './SLAPDetails';
import SubmitEvaluation from './SubmitEvaluation';
import Admin from './Admin';
import ResetPassword from './ResetPassword';
import SendMessage from './sendMessage';
import ViewMessages from './ViewMessages';


import './main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/CreateSLAP" element={<CreateSLAP />} />
        <Route path="/home/CreateProject" element={<CreateProject />} />
        <Route path="/home/ViewCourses" element={<ViewCoursesPage />} />
        <Route path="/courses/:id" element={<CoursePage />} />
        <Route path="/courses/:id/projects" element={<CourseProjectsPage />} />
        <Route path="/courses/:id/projects/:project_id" element={<ProjectInstructions />} />
        <Route path="/courses/:id/projects/:project_id/EditProject" element={<EditProject />} />
        <Route path="/courses/:id/projects/:project_id/UploadDocument" element={<UploadDocument />} />
        <Route path="/courses/:id/projects/:project_id/SubmitAssignment" element={<SubmitAssignment />} />
        <Route path="/courses/:id/submissions" element={<CourseSubmissionsPage />} />
        <Route path="/courses/:id/submissions/:submission_id/SubmitEvaluation" element={<SubmitEvaluation />} />
        <Route path="/courses/:id/evaluations" element={<CourseEvaluationsPage />} />
        <Route path="/slaps/:id" element={<SLAPDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/sendMessage" element={<SendMessage />} />
        <Route path="/viewMessages/:courseId/:sender" element={<ViewMessages />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
