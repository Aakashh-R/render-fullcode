import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const ProtectedRoute = ({ children, allowedCompany, allowedRole }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  if(!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if(allowedCompany && allowedRole){
    if(user.companyName !== allowedCompany || user.role !== allowedRole){
      return <div className="p-6">Unauthorized — you don't have access to this page.</div>;
    }
  }
  return children;
};
export default ProtectedRoute;