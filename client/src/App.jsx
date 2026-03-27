import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Navbar from "./Components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./Components/AdminRoute";
import Dashboard from "./pages/Dashboard";
import CreateClub from "./pages/admin/CreateClub";
import AssignLead from "./pages/admin/AssignLead";
import ManageUsers from "./pages/admin/ManageUsers";
import AllClubs from "./pages/AllClubs";
import CreateEvent from "./pages/CreateEvent";
import ClubLeadDashboard from "./pages/ClubLeadDashboard";
import ClubLeadRoute from "./Components/ClubLeadRoute";
import { Navigate } from "react-router-dom";
import UpcomingEvents from "./pages/UpcomingEvents";
import ClubEvents from "./pages/ClubEvents";
import MyEvents from "./pages/MyEvents";
import Notifications from "./pages/Notifications";
import SuggestEvent from "./pages/SuggestEvent";
import Suggestions from "./pages/Suggestions";
function App() {
  
 
  return (
    <div className="h-screen flex flex-col overflow-hidden" >
    <AuthProvider>
      <Router>
            <Navbar />
            <div className="flex-1 overflow-y-auto">

        <Routes>
          <Route path="/" element={<Home/>} /> {/* home page */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/create-club" element={<AdminRoute><CreateClub /></AdminRoute>} />
          <Route path="/admin/assign-lead" element={<AdminRoute><AssignLead /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/clubs" element={<AllClubs />} />
           <Route
    path="/create-event"
    element={
      <ClubLeadRoute>
        <CreateEvent />
      </ClubLeadRoute>
    }
  />
  <Route path="/suggestions" element={<Suggestions />} />
  <Route path="/suggest-event" element={<SuggestEvent />} />
<Route path="/club-dashboard"element={ <ClubLeadRoute><ClubLeadDashboard /></ClubLeadRoute>
  }/>
<Route path="/club/:id" element={<ClubEvents />} />
<Route path="/upcoming-events" element={<UpcomingEvents />} />

<Route path="/my-events" element={<MyEvents />} />
<Route path="/notifications" element={<Notifications />} />
</Routes>
</div>
      </Router>
    </AuthProvider>
    </div>
  );
}

export default App;
