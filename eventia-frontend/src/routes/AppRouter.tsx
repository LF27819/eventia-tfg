import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import EventsPage from "../pages/EventsPage";
import EventDetailPage from "../pages/EventDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import ProfilePage from "../pages/ProfilePage";
import AdminPage from "../pages/AdminPage";
import OrganizerPage from "../pages/OrganizerPage";
import MyTicketsPage from "../pages/MyTicketsPage";
import ArtistsPage from "../pages/ArtistsPage";
import OrganizerEventFormPage from "../pages/OrganizerEventFormPage";

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
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/organizador" element={<OrganizerPage />} />
      <Route path="/mis-entradas" element={<MyTicketsPage />} />
      <Route path="/artistas" element={<ArtistsPage />} />
      <Route path="/organizador/eventos/nuevo" element={<OrganizerEventFormPage />} />
      <Route path="/organizador/eventos/:id/editar" element={<OrganizerEventFormPage />} />
    </Routes>
  );
}

export default AppRouter;