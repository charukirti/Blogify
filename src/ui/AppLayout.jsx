import { Outlet } from "react-router";

import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex   flex-col">
      <Header />
      <Outlet />
    </div>
  );
}
