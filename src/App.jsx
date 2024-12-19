import { BrowserRouter, Route, Routes } from "react-router";

import Blogs from "./pages/Blogs";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";
import SignIn from "./features/auth/SignIn";
import SignUp from "./features/auth/SignUp";
import Analytics from "./features/analytics/Analytics";
import Profile from "./features/profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={ <SignIn/>} />
        <Route path="/signup" element={ <SignUp/>} />
        <Route path="/" element={<Blogs />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/dashboard" element={ <Dashboard/>} />
        <Route path="/dashboard/Profile" element={ <Profile/>} />
        <Route path="/dashboard/analytics" element={ <Analytics/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
