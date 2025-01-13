import { Outlet } from "react-router";

import Header from "../header/Header";

export default function AppLayout() {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4  ">
      <Outlet />
      </main>
    </div>
  );
}
