import { Outlet } from "react-router-dom";
import Header from "./Header";
import AuthHeader from "../../auth/authHeader";

export function MainLayout() {
  return (
    <>
      <Header /> {/* здесь header всегда закреплён */}
      <main>
        <Outlet /> {/* сюда рендерятся дочерние страницы */}
      </main>
    </>
  );
}

export function AuthLayout() {
  return (
    <>
      <AuthHeader />

      <main className="min-h-screen pt-20 lg:pt-10 flex items-center justify-center bg-dark-900">
        <Outlet />
      </main>
    </>
  );
}
