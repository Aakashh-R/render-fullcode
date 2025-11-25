// AdminDashboard.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = {
  users: { id: 'users', title: 'User Management', short: 'Manage users, roles and access.' },
  billing: { id: 'billing', title: 'Billing & Invoices', short: 'View invoices and payments.' },
  audit: { id: 'audit', title: 'Audit Logs', short: 'System activity and changes.' },
  system: { id: 'system', title: 'System Settings', short: 'Global settings and integrations.' },
  reports: { id: 'reports', title: 'Reports & Analytics', short: 'Download KPIs and usage.' },
  notifications: {
    id: 'notifications',
    title: 'Notifications',
    short: 'Manage templates and alerts.',
  },
};

const SAMPLE_USERS = Array.from({ length: 23 }).map((_, i) => ({
  id: `U-${1000 + i}`,
  name: ['Asha Patel', 'Ravi Kumar', 'Maya Singh', 'Karthik R'][i % 4],
  email: `user${i + 1}@example.com`,
  role: ['admin', 'owner', 'logistics', 'driver'][i % 4],
  status: i % 5 === 0 ? 'Suspended' : 'Active',
  lastLogin: `2025-11-${(i % 28) + 1}`,
}));

export default function AdminDashboard() {
  const [query, setQuery] = useState('');
  const [activeFeature, setActiveFeature] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 8;
  const navigate = useNavigate();

  const usersFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_USERS;
    return SAMPLE_USERS.filter(
      u =>
        u.id.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(usersFiltered.length / perPage));
  const pagedUsers = usersFiltered.slice((page - 1) * perPage, page * perPage);

  function openUser(user) {
    setSelectedUser(user);
  }
  function closeUser() {
    setSelectedUser(null);
  }

  function downloadSpec() {
    const content = Object.values(FEATURES)
      .map(f => `- ${f.title}: ${f.short}`)
      .join('\n');
    const blob = new Blob([`Admin Dashboard Specification\n\n${content}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_dashboard_spec.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">Admin Dashboard</h1>
            {/* <p className="text-sm text-slate-500 mt-1">Central admin controls for the platform.</p> */}
          </div>

          <div className="flex gap-2 items-center">
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search users, id, email..."
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm w-56 sm:w-72 focus:outline-none"
            />
            <button
              onClick={() => downloadSpec()}
              className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm"
            >
              Specification
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm"
            >
              Home
            </button>
          </div>
        </header>

        <nav className="mb-6">
          <div className="flex flex-wrap gap-3">
            {Object.values(FEATURES).map(f => (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFeature(f.id);
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-xl text-sm ${
                  activeFeature === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {f.title}
              </button>
            ))}
          </div>
        </nav>

        <section>
          {activeFeature === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-800">Users</h2>
                <div className="text-sm text-slate-500">Showing {usersFiltered.length} users</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase">
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Role</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Last Login</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedUsers.map(u => (
                      <tr key={u.id} className="border-t">
                        <td className="px-3 py-3 text-sm text-slate-700">{u.id}</td>
                        <td className="px-3 py-3 text-sm text-slate-700">{u.name}</td>
                        <td className="px-3 py-3 text-sm text-slate-500">{u.email}</td>
                        <td className="px-3 py-3 text-sm text-slate-600">{u.role}</td>
                        <td className="px-3 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-500">{u.lastLogin}</td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => openUser(u)}
                              className="text-sm px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700"
                            >
                              View
                            </button>
                            <button className="text-sm px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-xl bg-white border border-slate-200"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded-xl bg-white border border-slate-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'billing' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Billing & Invoices</h2>
              <p className="text-sm text-slate-600 mb-4">
                Recent invoices, payments and billing configuration.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Outstanding</div>
                  <div className="text-2xl font-semibold mt-2">₹ 124,500</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Due this month</div>
                  <div className="text-2xl font-semibold mt-2">₹ 48,200</div>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'audit' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Audit Logs</h2>
              <p className="text-sm text-slate-600 mb-4">Recent system events and security logs.</p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="p-3 bg-slate-50 rounded-md">
                  [2025-11-18 09:12] User U-1001 updated role from driver → logistics
                </div>
                <div className="p-3 bg-slate-50 rounded-md">
                  [2025-11-18 08:55] Failed login attempt for user user7@example.com
                </div>
                <div className="p-3 bg-slate-50 Rounded-md">
                  [2025-11-17 15:42] Billing settings updated by admin
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'system' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">System Settings</h2>
              <p className="text-sm text-slate-600 mb-4">
                Feature flags, integrations and environment settings.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <input type="checkbox" defaultChecked />
                  <div>
                    <div className="text-sm font-medium">Enable Maintenance Mode</div>
                    <div className="text-xs text-slate-500">Temporarily prevent new signups</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <input type="checkbox" />
                  <div>
                    <div className="text-sm font-medium">Enable Feature X</div>
                    <div className="text-xs text-slate-500">Internal beta toggle</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeFeature === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Reports & Analytics</h2>
              <p className="text-sm text-slate-600 mb-4">Download system reports and KPIs.</p>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                  Download Usage Report
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">
                  Download Financial Report
                </button>
              </div>
            </div>
          )}

          {activeFeature === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Notifications</h2>
              <p className="text-sm text-slate-600 mb-4">Configure templates and alert rules.</p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm font-medium">Shipment Delay Alert</div>
                  <div className="text-xs text-slate-500">
                    Sent to customers when delivery delayed over 48h
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm font-medium">Invoice Reminder</div>
                  <div className="text-xs text-slate-500">2 reminders before due date</div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div onClick={closeUser} className="absolute inset-0 bg-black/40"></div>
          <div className="relative w-full sm:max-w-md mx-4 sm:mx-0 bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedUser.email}</p>
                </div>
                <button onClick={closeUser} className="text-slate-500 hover:text-slate-700">
                  Close
                </button>
              </div>

              <div className="mt-4 text-sm text-slate-600">
                <div className="mb-2">
                  ID: <span className="font-medium">{selectedUser.id}</span>
                </div>
                <div className="mb-2">
                  Role: <span className="font-medium">{selectedUser.role}</span>
                </div>
                <div className="mb-2">
                  Status: <span className="font-medium">{selectedUser.status}</span>
                </div>
                <div className="mb-2">
                  Last Login: <span className="font-medium">{selectedUser.lastLogin}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                  Suspend
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
