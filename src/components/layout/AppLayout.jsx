import { Outlet } from "react-router";

import Header from "../header/Header";

export default function AppLayout() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-7xl px-4">
        <Outlet />
      </main>
    </div>
  );
}
