import React, { useMemo, useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../api/authApi";
import dashboardRoutes from "../../utils/dashboardRoutes";
import { AuthContext } from "../../context/AuthContext";
// default fallback list (used if backend is unavailable)
const DEFAULT_COMPANIES = [
  { name: 'Factory', roles: ['Company Owner', 'Admin'] },
  { name: 'Shipper', roles: ['Company Owner', 'Admin', 'Documentation Department', 'Accounts Department'] },
  { name: 'Transporter', roles: ['Company Owner', 'Admin', 'Truck Driver'] },
  { name: "Clearance Agent", roles: ['Company Owner', 'Admin', 'Documentation Department', 'Accounts Department'] },
];
export default function Signup(){
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form,setForm]=useState({ name:"", email:"", password:"", companyName:"", role:"" });
  const [companies,setCompanies]=useState(DEFAULT_COMPANIES);
  const [loading,setLoading]=useState(false);
  const selectedCompany = useMemo(()=> companies.find(c=>c.name===form.companyName), [companies, form.companyName]);

  useEffect(() => {
  console.log('Signup component mounted (debug)', { env: import.meta.env.MODE });
}, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const base = import.meta.env.VITE_API_BASE_URL || '';
        const url = base ? `${base.replace(/\/$/, '')}/api/data/roles` : '/api/data/roles';
        const res = await fetch(url);
        const json = await res.json();
        if (!mounted) return;
        if (json?.ok && Array.isArray(json.companies)) setCompanies(json.companies);
      } catch (e) {
          console.error("Failed to load companies/roles from backend:", e);
      }
    }
    load();
    return () => (mounted = false);
  }, []);
  const handleChange = e=> setForm(s=>({...s,[e.target.name]: e.target.value}));
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try{
      const data = await signupUser({ name: form.name, email: form.email, password: form.password, companyName: form.companyName, role: form.role });
      console.log('signup response user:', data.user);
      login(data.user, data.token);
      const redirect = dashboardRoutes[data.user.companyName]?.[data.user.role];
      console.log(redirect)
      navigate(redirect||"/");
    }catch(err){
      alert(err?.response?.data?.message||"Signup failed");
      console.error(err);
    }finally{ setLoading(false); }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your TriConnect Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input name="password" value={form.password} onChange={handleChange} required type="password" placeholder="Password" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          <select name="companyName" value={form.companyName} onChange={handleChange} required className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="" disabled hidden>Select Company</option>
            {companies.map((c,i)=>(<option key={i} value={c.name}>{c.name}</option>))}
          </select>
          {selectedCompany && (<select name="role" value={form.role} onChange={handleChange} required className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"><option value="" disabled hidden>Select Role</option>{selectedCompany.roles.map((r,i)=>(<option key={i} value={r}>{r}</option>))}</select>)}
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold transition duration-200">{loading? 'Creating...':'Sign Up'}</button>
        </form>
        <p className="text-center text-sm mt-4">Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link></p>
      </div>
    </div>
  );
}