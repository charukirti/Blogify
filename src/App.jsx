import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { login, logout } from "./store/authSlice";
import { useDispatch } from "react-redux";
import authservice from "./services/auth";
import Loader from "./ui/Loader";
import AppLayout from './ui/AppLayout'
const Blogs = lazy(() => import("./pages/Blogs"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Blog = lazy(() => import("./pages/Blog"));
const SignIn = lazy(() => import("./ui/auth/SignIn"));
const SignUp = lazy(() => import("./ui/auth/SignUp"));
const Analytics = lazy(() => import("./ui/analytics/Analytics"));
const CreateBlog = lazy(() => import("./ui/blogs/CreateBlog"));
const ProtectedRoute = lazy(() => import("./ui/ProtectedRoute"));
const Profile = lazy(() => import("./pages/Profile"));
const PageNotFound = lazy(() => import("./ui/PageNotFound"));
const EditPost = lazy(() => import("./pages/EditPost"));

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
      <Suspense fallback={<Loader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
