import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { login, logout } from "./store/authSlice";
import { useDispatch } from "react-redux";
import authservice from "./services/auth";
import Loader from "./components/Loader";
import AppLayout from "./components/layout/AppLayout";
import AuthCallback from "./pages/AuthCallback";
import AuthFailure from "./pages/AuthFailure";
const Blogs = lazy(() => import("./pages/Blogs"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Blog = lazy(() => import("./pages/Blog"));
const SignIn = lazy(() => import("./feat/auth/SignIn"));
const SignUp = lazy(() => import("./feat/auth/SignUp"));
const CreateBlog = lazy(() => import("./feat/blogs/CreateBlog"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Profile = lazy(() => import("./pages/Profile"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
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
              path="/profile"
              element={
                <ProtectedRoute isAuthenticated>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/callback"
              element={
                <ProtectedRoute isAuthenticated = {false}>
                  <AuthCallback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth/failure"
              element={
                <ProtectedRoute isAuthenticated>
                  <AuthFailure />
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
