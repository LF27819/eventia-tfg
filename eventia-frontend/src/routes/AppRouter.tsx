import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import EventsPage from "../pages/EventsPage";
import EventDetailPage from "../pages/EventDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import ProfilePage from "../pages/ProfilePage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/eventos" element={<EventsPage />} />
      <Route path="/eventos/:id" element={<EventDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/mis-reservas" element={<MyBookingsPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
    </Routes>
  );
}

export default AppRouter;