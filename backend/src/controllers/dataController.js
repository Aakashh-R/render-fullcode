export const getCompanyRoleData = (req, res) => {
  const { company, role } = req.params;
  if (req.user.companyName.toLowerCase() !== company.toLowerCase()) {
    return res.status(403).json({ message: "Forbidden: company mismatch" });
  }
  if (req.user.role.toLowerCase() !== role.toLowerCase()) {
    return res.status(403).json({ message: "Forbidden: role mismatch" });
  }
  return res.json({ ok: true, data: { message: `Welcome ${req.user.name} to ${company} - ${role} dashboard` } });
};

// Public endpoint returning allowed companies and roles for signup
import { COMPANIES_ROLES } from '../config/roles.js';
export const getCompaniesRoles = (req, res) => {
  return res.json({ ok: true, companies: COMPANIES_ROLES });
};