import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import dashboardRoutes from "../../utils/dashboardRoutes";
import { AuthContext } from "../../context/AuthContext";
export default function Login(){
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form,setForm]=useState({ email:"", password:"" });
  const [loading,setLoading]=useState(false);
  const handleChange = e=> setForm(s=>({...s,[e.target.name]: e.target.value}));
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try{
      const data = await loginUser({ email: form.email, password: form.password });
      login(data.user, data.token);
      const redirect = dashboardRoutes[data.user.companyName]?.[data.user.role];
      navigate(redirect||"/");
    }catch(err){ alert(err?.response?.data?.message||"Login failed"); console.error(err); }finally{ setLoading(false); }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to TriConnect</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input name="password" value={form.password} onChange={handleChange} required type="password" placeholder="Password" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold transition duration-200">{loading? 'Logging in...':'Login'}</button>
        </form>
        <p className="text-center text-sm mt-4">Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Sign up</Link></p>
      </div>
    </div>
  );
}