import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/signup";
import Home from "./pages/client/Home";
import UploadCvPage from "./pages/client/UploadCv";

import EmployerRoute from "./routes/EmployerRoute";
import AddJobOfferPage from "./pages/employer/AddJobOfferPage";
import EditJobOfferPage from "./pages/employer/EditJobOfferPage";
import EmployerPage from "./pages/employer/EmployerPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserManagementPage from "./pages/admin/AdminUsersPage";

import ClientLayout from "./layouts/ClientLayout";
import EmployerLayout from "./layouts/EmployerLayout";

import LoadingM from "./components/animations/LoadingM";
import LoginSuccess from "./pages/LoginSuccess";
import ApplicantsPage from "./pages/employer/Applicant";
import BrowseJobs from "./pages/client/BrowseJobs";
import MatchesPage from "./pages/client/MatchesPage";
import ApplicationsPage from "./pages/client/Application";

import ClientRoute from "./routes/ClientRoute";
import NotFoundPage from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobManagementPage from "./pages/admin/JobManagementPage";
import ApplicationManagementPage from "./pages/admin/ApplicationManagementPage";
import CVManagementPage from "./pages/admin/CVManagementPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
  />
        <Routes>

        <Route path="*" element={<NotFoundPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login/success" element={<LoginSuccess />} />
          <Route path="/loading" element={<LoadingM />} />

          {/* CLIENT ROUTES */}
          <Route path="/" element={<ClientLayout />}>
            <Route
              index
              element={
                
                  <Home />
                
              }
            />
            <Route
              path="/upload"
              element={
                <ClientRoute>
                  <UploadCvPage />
                </ClientRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ClientRoute>
                  <BrowseJobs />
                </ClientRoute>
              }
            />
            <Route
              path="/matches"
              element={
                <ClientRoute>
                  <MatchesPage />
                </ClientRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ClientRoute>
                  <ApplicationsPage />
                </ClientRoute>
              }
            />
          </Route>

          {/* EMPLOYER ROUTES */}
          <Route path="/employer" element={<EmployerLayout />}>
            <Route
              path="dashboard"
              element={
                <EmployerRoute>
                  <EmployerPage />
                </EmployerRoute>
              }
            />
            <Route
              path="jobs"
              element={
                <EmployerRoute>
                  <EmployerPage />
                </EmployerRoute>
              }
            />
            <Route
              path="jobs/new"
              element={
                <EmployerRoute>
                  <AddJobOfferPage />
                </EmployerRoute>
              }
            />
            <Route
              path="jobs/:id/edit"
              element={
                <EmployerRoute>
                  <EditJobOfferPage />
                </EmployerRoute>
              }
            />
            <Route
              path="jobs/:id/applicants"
              element={
                <EmployerRoute>
                  <ApplicantsPage />
                </EmployerRoute>
              }
            />
          </Route>

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
    {/* Admin Dashboard */}
    <Route
      path="dashboard"
      element={
        <AdminRoute>
          <AdminDashboardPage />
        </AdminRoute>
      }
    />

    {/* Management Pages */}
    <Route
      path="users"
      element={
        <AdminRoute>
          <UserManagementPage />
        </AdminRoute>
      }
    />
    <Route
      path="jobs"
      element={
        <AdminRoute>
          <JobManagementPage />
        </AdminRoute>
      }
    />
    <Route
      path="applications"
      element={
        <AdminRoute>
          <ApplicationManagementPage />
        </AdminRoute>
      }
    />
    <Route
      path="cvs"
      element={
        <AdminRoute>
          <CVManagementPage />
        </AdminRoute>
      }
    />
  </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
