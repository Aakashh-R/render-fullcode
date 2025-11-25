// src/utils/dashboardRoutes.js
const dashboardRoutes = {
  Factory: {
    "Company Owner": "/factory/company-owner",
    Admin: "/factory/admin",
  },
  Shipper: {
    "Company Owner": "/shipper/company-owner",
    Admin: "/shipper/admin",
    "Documentation Department": "/shipper/documentation",
    "Logistics Department": "/shipper/logistics",
    "Accounts Department": "/shipper/accounts",
    "Office Boy": "/shipper/office-boy",
    "Stone Marker": "/shipper/stone-marker",
  },
  Transporter: {
    "Company Owner": "/transporter/company-owner",
    Admin: "/transporter/admin",
    "Truck Driver": "/transporter/truck-driver",
  },
  "Clearance Agent": {
    "Company Owner": "/clearance-agents/company-owner",
    Admin: "/clearance-agents/admin",
    "Documentation Department": "/clearance-agents/documentation",
    "Logistics Department": "/clearance-agents/logistics",
    "Accounts Department": "/clearance-agents/accounts",
    "Office Boy": "/clearance-agents/office-boy",
  },
};

export default dashboardRoutes;
