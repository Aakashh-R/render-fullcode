import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
// factory
import FactoryCompanyOwner from "./pages/dashboards/factory/CompanyOwnerDashboard";
import FactoryAdmin from "./pages/dashboards/factory/AdminDashboard";
// shipper
import ShipperCompanyOwner from "./pages/dashboards/shipper/CompanyOwnerDashboard";
import ShipperAdmin from "./pages/dashboards/shipper/AdminDashboard";
import ShipperDocumentation from "./pages/dashboards/shipper/DocumentationDashboard";
// import ShipperLogistics from "./pages/dashboards/shipper/LogisticsDashboard";
import ShipperAccounts from "./pages/dashboards/shipper/AccountsDashboard";
// import ShipperOfficeBoy from "./pages/dashboards/shipper/OfficeBoyDashboard";
// import ShipperStoneMarker from "./pages/dashboards/shipper/StoneMarkerDashboard";
// transporter
import TransporterCompanyOwner from "./pages/dashboards/transporter/CompanyOwnerDashboard";
import TransporterAdmin from "./pages/dashboards/transporter/AdminDashboard";
import TruckDriver from "./pages/dashboards/transporter/TruckDriverDashboard";
// clearance agents
import ClearanceCompanyOwner from "./pages/dashboards/clearanceAgents/CompanyOwnerDashboard";
import ClearanceAdmin from "./pages/dashboards/clearanceAgents/AdminDashboard";
import ClearanceDocumentation from "./pages/dashboards/clearanceAgents/DocumentationDashboard";
// import ClearanceLogistics from "./pages/dashboards/clearanceAgents/LogisticsDashboard";
import ClearanceAccounts from "./pages/dashboards/clearanceAgents/AccountsDashboard";
// import ClearanceOfficeBoy from "./pages/dashboards/clearanceAgents/OfficeBoyDashboard";

function App(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="/factory/company-owner" element={<ProtectedRoute><FactoryCompanyOwner /></ProtectedRoute>} />
      <Route path="/factory/admin" element={<ProtectedRoute><FactoryAdmin /></ProtectedRoute>} />

      <Route path="/shipper/company-owner" element={<ProtectedRoute><ShipperCompanyOwner /></ProtectedRoute>} />
      <Route path="/shipper/admin" element={<ProtectedRoute><ShipperAdmin /></ProtectedRoute>} />
      <Route path="/shipper/documentation" element={<ProtectedRoute><ShipperDocumentation /></ProtectedRoute>} />
      {/* <Route path="/shipper/logistics" element={<ProtectedRoute><ShipperLogistics /></ProtectedRoute>} /> */}
      <Route path="/shipper/accounts" element={<ProtectedRoute><ShipperAccounts /></ProtectedRoute>} />
      {/* <Route path="/shipper/office-boy" element={<ProtectedRoute><ShipperOfficeBoy /></ProtectedRoute>} /> */}
      {/* <Route path="/shipper/stone-marker" element={<ProtectedRoute><ShipperStoneMarker /></ProtectedRoute>} /> */}

      <Route path="/transporter/company-owner" element={<ProtectedRoute><TransporterCompanyOwner /></ProtectedRoute>} />
      <Route path="/transporter/admin" element={<ProtectedRoute><TransporterAdmin /></ProtectedRoute>} />
      <Route path="/transporter/truck-driver" element={<ProtectedRoute><TruckDriver /></ProtectedRoute>} />

      <Route path="/clearance-agents/company-owner" element={<ProtectedRoute><ClearanceCompanyOwner /></ProtectedRoute>} />
      <Route path="/clearance-agents/admin" element={<ProtectedRoute><ClearanceAdmin /></ProtectedRoute>} />
      <Route path="/clearance-agents/documentation" element={<ProtectedRoute><ClearanceDocumentation /></ProtectedRoute>} />
      {/* <Route path="/clearance-agents/logistics" element={<ProtectedRoute><ClearanceLogistics /></ProtectedRoute>} /> */}
      <Route path="/clearance-agents/accounts" element={<ProtectedRoute><ClearanceAccounts /></ProtectedRoute>} />

      {/* <Route path="/clearance-agents/office-boy" element={<ProtectedRoute><ClearanceOfficeBoy /></ProtectedRoute>} /> */}

    </Routes>
  );
}
export default App;