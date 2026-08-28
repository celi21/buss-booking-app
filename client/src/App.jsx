import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import ViewBookings from "./pages/ViewBookings";
import SearchTickets from "./pages/SearchTickets";
import AdminHome from "./pages/admin-dashboard/pages/admin-home/AdminHome";
import UserHome from "./pages/user-dashboard/pages/user-home/UserHome";
import UserBookings from "./pages/user-dashboard/pages/user-bookings/UserBookings";
import { useDispatch } from "react-redux";
import { retrieveUser } from "./store/slices/AuthSlice";
import AdminDashboardLayout from "./pages/admin-dashboard/AdminDashboardLayout";
import UserDashboardLayout from "./pages/user-dashboard/UserDashboardLayout";
import BusTypes from "./pages/admin-dashboard/pages/bus-types/BusTypes";
import BusRoutes from "./pages/admin-dashboard/pages/bus-routes/BusRoutes";
import Buses from "./pages/admin-dashboard/pages/buses/Buses";
import EditBus from "./pages/admin-dashboard/pages/buses/components/edit-bus/EditBus";
import Schedules from "./pages/admin-dashboard/pages/schedules/Schedules";
import Bookings from "./pages/admin-dashboard/pages/bookings/Bookings";
import AddBooking from "./pages/admin-dashboard/pages/add-booking/AddBooking";
import EditBooking from "./pages/admin-dashboard/pages/edit-booking/EditBooking";
import Booking from "./pages/booking/Booking";
import SearchBooking from "./pages/search-booking/SearchBooking";
import Reports from "./pages/admin-dashboard/pages/reports/Reports";
import Dispatch from "./pages/admin-dashboard/pages/dispatch/Dispatch";
import DispatchTaskQueue from "./pages/admin-dashboard/pages/dispatch-tasks/DispatchTaskQueue";
import PassengerHome from "./pages/user-dashboard/pages/passenger-home/PassengerHome";
import PassengerWallet from "./pages/user-dashboard/pages/passenger-wallet/PassengerWallet";
import PassengerSupport from "./pages/user-dashboard/pages/passenger-support/PassengerSupport";
import PassengerProfile from "./pages/user-dashboard/pages/passenger-profile/PassengerProfile";
import AuthCallback from "./pages/AuthCallback";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import AppInfo from "./pages/AppInfo";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveUser());
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="booking" element={<Booking />} />
        <Route path="booking/:bookingId" element={<SearchBooking />} />
        <Route path="auth/callback" element={<AuthCallback />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="terms" element={<Terms />} />
        <Route path="app" element={<AppInfo />} />

        <Route
          path="admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminHome />} />
          <Route path="bus-types" element={<BusTypes />} />
          <Route path="bus-routes" element={<BusRoutes />} />
          <Route path="buses" element={<Buses />} />
          <Route path="edit-bus/:busId" element={<EditBus />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="add-booking" element={<AddBooking />} />
          <Route path="edit-booking/:bookingId" element={<EditBooking />} />
          <Route path="reports" element={<Reports />} />
          <Route path="dispatch" element={<Dispatch />} />
          <Route path="task-queue" element={<DispatchTaskQueue />} />
        </Route>

        <Route
          path="user"
          element={
            <ProtectedUserRoute>
              <UserDashboardLayout />
            </ProtectedUserRoute>
          }
        >
          <Route index element={<PassengerHome />} />
          <Route path="dashboard" element={<PassengerHome />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="home" element={<PassengerHome />} />
          <Route path="wallet" element={<PassengerWallet />} />
          <Route path="support" element={<PassengerSupport />} />
          <Route path="profile" element={<PassengerProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
