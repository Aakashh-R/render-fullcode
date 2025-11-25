// RoleBasedDashboard.jsx
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = ['owner', 'driver', 'logistics', 'admin'];

const FEATURES = {
  transport: {
    id: 'transport',
    title: 'Transport Orders',
    short: 'Create and assign transport orders, view status.',
  },
  fleet: { id: 'fleet', title: 'Fleet Management', short: 'View fleet, maintenance schedule.' },
  invoices: { id: 'invoices', title: 'Invoicing & Billing', short: 'Create & send invoices.' },
  compliance: {
    id: 'compliance',
    title: 'Compliance & Licenses',
    short: 'Manage permits and insurance.',
  },
  reports: { id: 'reports', title: 'Reports & KPIs', short: 'View utilization and KPIs.' },
  drivers: { id: 'drivers', title: 'Driver Management', short: 'Hire, train and assign drivers.' },
  docs: { id: 'docs', title: 'Export Documents', short: 'LR, E-way, gate pass and customs docs.' },
  settings: { id: 'settings', title: 'System Settings', short: 'App config and permissions.' },
};

const ROLE_FEATURES = {
  owner: ['transport', 'fleet', 'invoices', 'compliance', 'reports', 'drivers', 'settings'],
  logistics: ['transport', 'docs', 'drivers', 'reports'],
  driver: ['docs', 'transport'],
  admin: ['settings', 'reports', 'invoices', 'drivers'],
};

const RoleContext = createContext();
function useRole() {
  return useContext(RoleContext);
}

function FeatureCard({ feature, onOpen }) {
  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col">
      <div>
        <h3 className="text-lg font-medium text-slate-800">{feature.title}</h3>
        <p className="text-sm text-slate-500 mt-2">{feature.short}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onOpen(feature)}
          className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium"
        >
          Open
        </button>
        <button
          onClick={() => downloadFeatureSpec(feature)}
          className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm"
        >
          Download Spec
        </button>
        <span className="ml-auto text-xs text-slate-400">#{feature.id}</span>
      </div>
    </article>
  );
}

function downloadFeatureSpec(feature) {
  const content = `Feature: ${feature.title}\n\n${feature.short}`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${feature.id}_spec.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function RoleBasedDashboard() {
  const [role, setRole] = useState('owner');
  const [openFeature, setOpenFeature] = useState(null);
  const navigate = useNavigate();

  const availableFeatureIds = ROLE_FEATURES[role] || [];
  const availableFeatures = availableFeatureIds.map(id => FEATURES[id]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                Transporter Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <button
                onClick={() => navigate('/signup')}
                className="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-sm"
              >
                Home
              </button>
              <button
                onClick={() => {
                  const spec = availableFeatures.map(f => `- ${f.title}: ${f.short}`).join('\n');
                  const blob = new Blob([`Role: ${role}\n\n${spec}`], {
                    type: 'text/plain;charset=utf-8',
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `role_${role}_spec.txt`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-2 rounded-2xl bg-indigo-600 text-white text-sm"
              >
                Specification
              </button>
            </div>
          </header>

          <section>
            {/* <h2 className="text-sm text-slate-500 mb-3">
              Features for <strong>{role}</strong>
            </h2> */}

            {availableFeatures.length === 0 ? (
              <div className="p-4 bg-white rounded-xl shadow-sm text-slate-600">
                No features assigned.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableFeatures.map(f => (
                  <FeatureCard key={f.id} feature={f} onOpen={feat => setOpenFeature(feat)} />
                ))}
              </div>
            )}
          </section>
        </div>

        {openFeature && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
              onClick={() => setOpenFeature(null)}
              className="absolute inset-0 bg-black/40"
            ></div>
            <div className="relative w-full sm:max-w-2xl mx-4 sm:mx-0 bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{openFeature.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{openFeature.short}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/isgnup')}
                      className="text-sm px-3 py-2 rounded-lg bg-white border border-slate-200"
                    >
                      Home
                    </button>
                    <button
                      onClick={() => setOpenFeature(null)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  <p>
                    <strong>Actions</strong>
                  </p>
                  <ul className="list-disc ml-5 mt-2 text-sm text-slate-600">
                    {getActionsForFeature(openFeature.id, role).map(a => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => downloadFeatureSpec(openFeature)}
                    className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                  >
                    Download Spec
                  </button>
                  <button
                    onClick={() => setOpenFeature(null)}
                    className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleContext.Provider>
  );
}

function getActionsForFeature(featureId, role) {
  const base = {
    transport: ['Create Order', 'Track Order', 'Assign Driver'],
    fleet: ['View Fleet', 'Schedule Maintenance', 'Add/Remove Vehicle'],
    invoices: ['Create Invoice', 'View Payments', 'Send Reminder'],
    compliance: ['View Permits', 'Upload Documents', 'Renew Insurance'],
    reports: ['Download KPI', 'Filter by Date', 'Export CSV'],
    drivers: ['Add Driver', 'View Performance', 'Assign Incentive'],
    docs: ['Generate LR', 'Upload Gate-Pass', 'View Customs Status'],
    settings: ['Manage Users', 'Update Permissions', 'System Logs'],
  };
  const actions = base[featureId] || ['View'];
  if (role === 'driver') return actions.slice(0, Math.min(2, actions.length));
  if (role === 'owner') return [...actions, 'View Financial Impact'];
  return actions;
}
