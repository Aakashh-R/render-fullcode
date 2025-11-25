// ClearanceAgentAdminDashboard.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = {
  clearances: {
    id: 'clearances',
    title: 'Clearance Orders',
    short: 'Manage clearance jobs and statuses',
  },
  manifests: {
    id: 'manifests',
    title: 'Manifests',
    short: 'Create and submit manifests to port/customs',
  },
  filings: {
    id: 'filings',
    title: 'Customs Filings',
    short: 'Track declarations, HSN, and filing status',
  },
  schedules: {
    id: 'schedules',
    title: 'Vessel / Flight Schedules',
    short: 'View ETAs, cut-offs and slot bookings',
  },
  vendors: {
    id: 'vendors',
    title: 'Vendors & CNF',
    short: 'Manage C&F agents, forwarders and vendors',
  },
  billing: {
    id: 'billing',
    title: 'Billing & Claims',
    short: 'Client invoicing, duty charges and claims',
  },
  reports: { id: 'reports', title: 'Reports', short: 'Aging, cash flow and customs reports' },
  settings: {
    id: 'settings',
    title: 'Settings',
    short: 'System settings, integrations and webhooks',
  },
};

const SAMPLE_CLEARANCES = Array.from({ length: 20 }).map((_, i) => ({
  id: `CL-${4000 + i}`,
  refNo: `REF-${700 + i}`,
  client: ['A1 Traders', 'Oceanex', 'TransGlobal'][i % 3],
  status: ['Pending', 'Filed', 'Cleared', 'Hold'][i % 4],
  duty: (Math.floor(Math.random() * 200) + 30) * 100,
  eta: `2025-11-${(i % 28) + 1}`,
}));

export default function ClearanceAgentAdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('clearances');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_CLEARANCES;
    return SAMPLE_CLEARANCES.filter(
      r =>
        r.id.toLowerCase().includes(q) ||
        r.refNo.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        String(r.duty).includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / perPage));
  const paged = filteredRecords.slice((page - 1) * perPage, page * perPage);

  function exportCSV(rows = filteredRecords, filename = 'clearances.csv') {
    const hdr = 'id,refNo,client,status,duty,eta';
    const body = rows.map(r => `${r.id},${r.refNo},${r.client},${r.status},${r.duty},${r.eta}`);
    const blob = new Blob([[hdr, ...body].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadSpec() {
    const spec = Object.values(FEATURES)
      .map(f => `- ${f.title}: ${f.short}`)
      .join('\n');
    const blob = new Blob([`Clearance Agent Admin Specification\n\n${spec}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clearance_agent_admin_spec.txt`;
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
              Clearance Agent — Admin
            </h1>
    
            
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search id, ref, client, status..."
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none"
            />
            <button
              onClick={() => exportCSV()}
              className="ml-2 px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm"
            >
              Export
            </button>
            <button
              onClick={downloadSpec}
              className="ml-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm"
            >
              Specification
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="ml-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm"
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
                  setActive(f.id);
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-xl text-sm ${
                  active === f.id
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
          {active === 'clearances' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-800">Clearance Orders</h2>
                <div className="text-sm text-slate-500">Total {filteredRecords.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase">
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Ref</th>
                      <th className="px-3 py-2">Client</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Duty</th>
                      <th className="px-3 py-2">ETA</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map(r => (
                      <tr key={r.id} className="border-t">
                        <td className="px-3 py-3 text-sm text-slate-700">{r.id}</td>
                        <td className="px-3 py-3 text-sm text-slate-700">{r.refNo}</td>
                        <td className="px-3 py-3 text-sm text-slate-700">{r.client}</td>
                        <td className="px-3 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              r.status === 'Cleared'
                                ? 'bg-green-100 text-green-800'
                                : r.status === 'Filed'
                                ? 'bg-amber-100 text-amber-800'
                                : r.status === 'Hold'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-700">
                          ₹ {r.duty.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-500">{r.eta}</td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setSelected(r)}
                              className="text-sm px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700"
                            >
                              View
                            </button>
                            <button
                              onClick={() => alert('Open filing flow - implement API')}
                              className="text-sm px-2 py-1 rounded-lg bg-slate-100 text-slate-700"
                            >
                              File
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

          {active === 'manifests' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Manifests</h2>
              <p className="text-sm text-slate-500 mb-4">
                Create, edit and submit manifests to port/customs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Pending Submission</div>
                  <div className="text-2xl font-semibold mt-2">6</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Submitted Today</div>
                  <div className="text-2xl font-semibold mt-2">3</div>
                </div>
              </div>
            </div>
          )}

          {active === 'filings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Customs Filings</h2>
              <p className="text-sm text-slate-500 mb-4">
                Track declarations, HSN mapping and filing statuses.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm font-medium">Latest Filing: REF-712</div>
                  <div className="text-xs text-slate-500 mt-1">Status: Filed • 2025-11-17</div>
                </div>
              </div>
            </div>
          )}

          {active === 'schedules' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Vessel / Flight Schedules</h2>
              <p className="text-sm text-slate-500 mb-4">ETAs, cut-offs and slot availability.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Next Vessel</div>
                  <div className="text-sm font-medium mt-1">
                    MV OCEANIC — ETA 2025-11-21 • Cut-off 2025-11-20
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Next Flight</div>
                  <div className="text-sm font-medium mt-1">
                    FL 908 — ETA 2025-11-19 • Cut-off 2025-11-18
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === 'vendors' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Vendors & CNF</h2>
              <p className="text-sm text-slate-500 mb-4">
                Manage C&F agents, forwarders and vendors.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm font-medium">Oceanic CNF</div>
                  <div className="text-xs text-slate-500 mt-1">Contact: +91-9876543210</div>
                </div>
              </div>
            </div>
          )}

          {active === 'billing' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Billing & Claims</h2>
              <p className="text-sm text-slate-500 mb-4">
                Issue client invoices, duty billing and manage claims.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => exportCSV()}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                >
                  Export Billing
                </button>
                <button
                  onClick={() => alert('Open claims UI')}
                  className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm"
                >
                  Claims
                </button>
              </div>
            </div>
          )}

          {active === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Reports</h2>
              <p className="text-sm text-slate-500 mb-4">
                Aging, duty summary and customs reports.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                  Aging Report
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">
                  Duty Summary
                </button>
              </div>
            </div>
          )}

          {active === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Settings</h2>
              <p className="text-sm text-slate-500 mb-4">Integrations, user roles and webhooks.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <input type="checkbox" defaultChecked />
                  <div>
                    <div className="text-sm font-medium">Enable Customs API</div>
                    <div className="text-xs text-slate-500">Push filings automatically</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <input type="checkbox" />
                  <div>
                    <div className="text-sm font-medium">Enable Auto Billing</div>
                    <div className="text-xs text-slate-500">Generate invoices on clearance</div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div onClick={() => setSelected(null)} className="absolute inset-0 bg-black/40"></div>
          <div
            className="relative w-full sm:max-w-md mx-4 sm:mx-0 bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-auto"
            style={{ maxHeight: '90vh' }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{selected.id}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {selected.refNo} • {selected.client}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-600">
                <div className="mb-2">
                  Status: <span className="font-medium">{selected.status}</span>
                </div>
                <div className="mb-2">
                  Duty: <span className="font-medium">₹ {selected.duty.toLocaleString()}</span>
                </div>
                <div className="mb-2">
                  ETA: <span className="font-medium">{selected.eta}</span>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Use the File action to submit declaration, or the Pay action to settle duties.
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => exportCSV([selected], `clearance_${selected.id}.csv`)}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                >
                  Export
                </button>
                <button
                  onClick={() => setSelected(null)}
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
  );
}
