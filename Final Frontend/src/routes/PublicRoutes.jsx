import { Routes, Route } from "react-router-dom";

// AUTH
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// HOME & PRODUCT
import Home from "../pages/Home/Home";
import ProductDetail from "../pages/Product/ProductDetail";

// PROFILE
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import SellerProfile from "../pages/Profile/SellerProfile";

// NAVBAR LINKS
import Messages from "../pages/Messages/Messages";
import Notifications from "../pages/Notifications/Notifications";
import Favourites from "../pages/Favourites/Favourites";

// SELL
import Sell from "../pages/Sell/Sell";

// SELL FORMS
import CarForm from "../pages/Sell/SubCategory/CarForm";
import BikeForm from "../pages/Sell/SubCategory/BikeForm";
import ScooterForm from "../pages/Sell/SubCategory/ScooterForm";
import BicycleForm from "../pages/Sell/SubCategory/BicycleForm";
import FurnitureForm from "../pages/Sell/SubCategory/FurnitureForm";
import ElectronicsForm from "../pages/Sell/SubCategory/ElectronicsForm";
import FashionForm from "../pages/Sell/SubCategory/FashionForm";
import PetForm from "../pages/Sell/SubCategory/PetForm";
import MobileForm from "../pages/Sell/SubCategory/MobileForm";
import SportsForm from "../pages/Sell/SubCategory/SportsForm";

// SYSTEM
import NotFound from "../pages/System/NotFound";
import Unauthorized from "../pages/System/Unauthorized";

// ROUTE GUARD
import ProtectedRoute from "./ProtectedRoute";

// EDIT LISTING
import EditListing from "../pages/Sell/EditListing";

/* Admin routes */
import AdminRoutes from "./AdminRoutes";
import AdminLayout from "../pages/admin/layout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Calendar from "../pages/admin/Calendar";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageListings from "../pages/admin/ManageListings";

export default function PublicRoutes() {
  return (
    <Routes>
      {/* 🟢 PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route path="/seller/:id" element={<SellerProfile />} />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favourites"
        element={
          <ProtectedRoute>
            <Favourites />
          </ProtectedRoute>
        }
      />

      {/* Sell main route */}
      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <Sell />
          </ProtectedRoute>
        }
      />

      {/* Sell sub-forms */}

      <Route
        path="/sell/cars"
        element={
          <ProtectedRoute>
            <CarForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/bikes/:type"
        element={
          <ProtectedRoute>
            <BikeForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/bikes/scooters"
        element={
          <ProtectedRoute>
            <ScooterForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/bikes/bicycles"
        element={
          <ProtectedRoute>
            <BicycleForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/furniture"
        element={
          <ProtectedRoute>
            <FurnitureForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/electronics"
        element={
          <ProtectedRoute>
            <ElectronicsForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/fashion"
        element={
          <ProtectedRoute>
            <FashionForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/pets"
        element={
          <ProtectedRoute>
            <PetForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/mobile"
        element={
          <ProtectedRoute>
            <MobileForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/sport"
        element={
          <ProtectedRoute>
            <SportsForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-listing/:id"
        element={
          <ProtectedRoute>
            <EditListing />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES (ALL ADMIN PAGES HERE) */}
      {/* ADMIN ROUTES (ALL ADMIN PAGES HERE) */}
      <Route element={<AdminRoutes />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="listings" element={<ManageListings />} />
        </Route>
      </Route>

      {/* 404 - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
