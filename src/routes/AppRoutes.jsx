import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import Categories from "../pages/Categories";
import Dashboard from "../pages/Dashboard";
import Movies from "../pages/Movies";
import { useStore } from "../store/useStore";

const ProtectedRoute = ({ children, requireUser, requireCategories }) => {
  const { user, categories } = useStore();
  const hasUser = user.name && user.email;
  const hasCategories = categories.length >= 3;

  if (requireCategories && (!hasUser || !hasCategories)) {
    return <Navigate to={hasUser ? "/categories" : "/"} replace />;
  }
  if (requireUser && !hasUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route
        path="/categories"
        element={
          <ProtectedRoute requireUser>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireUser requireCategories>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/movies"
        element={
          <ProtectedRoute requireUser requireCategories>
            <Movies />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
