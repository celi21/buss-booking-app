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
import { useDispatch } from "react-redux";
import { retrieveUser } from "./store/slices/AuthSlice";
import AdminDashboardLayout from "./pages/admin-dashboard/AdminDashboardLayout";
import BusTypes from "./pages/admin-dashboard/pages/bus-types/BusTypes";
import BusRoutes from "./pages/admin-dashboard/pages/bus-routes/BusRoutes";
import Buses from "./pages/admin-dashboard/pages/buses/Buses";
import EditBus from "./pages/admin-dashboard/pages/buses/components/edit-bus/EditBus";
import Schedules from "./pages/admin-dashboard/pages/schedules/Schedules";

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
        <Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
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
          {/* <Route path="/view-bus" element={<ViewBus />} />
          <Route path="/booking/:busId" element={<ViewBusBookings />} />
          <Route path="/booking/:busId" element={<ViewBusBookings />} /> */}
        </Route>
        <Route element={<ProtectedUserRoute />}>
          <Route path="/booking" element={<SearchTickets />} />
          <Route path="/booking/view" element={<ViewBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
