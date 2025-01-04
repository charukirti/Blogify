import { BrowserRouter, Route, Routes } from "react-router";

import Blogs from "./pages/Blogs";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";
import SignIn from "./ui/auth/SignIn";
import SignUp from "./ui/auth/SignUp";
import Analytics from "./ui/analytics/Analytics";
import AppLayout from "./ui/AppLayout";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authservice from "./services/auth";
import { login, logout } from "./store/authSlice";
import CreateBlog from "./ui/blogs/CreateBlog";
import ProtectedRoute from "./ui/ProtectedRoute";
import Loader from "./ui/Loader";
import Profile from "./pages/Profile";
import PageNotFound from "./ui/PageNotFound";
import EditPost from "./pages/EditPost";

function App() {
  const [loading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(
    function () {
      authservice
        .getCurrentUser()
        .then((userData) => {
          if (userData) {
            dispatch(login({ userData }));
          } else {
            dispatch(logout());
          }
        })
        .catch((error) => {
          console.error(error);
          throw error;
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [dispatch]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/signin"
            element={
              <ProtectedRoute isAuthenticated={false}>
                <SignIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute isAuthenticated={false}>
                <SignUp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={true}>
                <Blogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blog/:id"
            element={
              <ProtectedRoute isAuthenticated>
                <Blog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute isAuthenticated>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute isAuthenticated>
                <EditPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute isAuthenticated>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute isAuthenticated>
                <PageNotFound />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
