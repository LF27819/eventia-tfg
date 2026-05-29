import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import EventsPage from "../pages/EventsPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import RegisterPage from "../pages/RegisterPage";
import AdminPage from "../pages/AdminPage";
import OrganizerPage from "../pages/OrganizerPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import RoleRoute from "./RoleRoute";
import EventDetailPage from "../pages/EventDetailPage";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/eventos" element={<EventsPage />} />
            <Route path="/eventos/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/perfil"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <RoleRoute allowedRoles={["ADMIN"]}>
                        <AdminPage />
                    </RoleRoute>
                }
            />

            <Route
                path="/organizador"
                element={
                    <RoleRoute allowedRoles={["ORGANIZADOR"]}>
                        <OrganizerPage />
                    </RoleRoute>
                }
            />

            <Route
                path="/mis-reservas"
                element={
                    <RoleRoute allowedRoles={["CLIENTE"]}>
                        <MyBookingsPage />
                    </RoleRoute>
                }
            />
        </Routes>
    );
}

export default AppRouter;