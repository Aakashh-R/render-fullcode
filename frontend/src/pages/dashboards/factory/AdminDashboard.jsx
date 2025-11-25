// FactoryAdminDashboard.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = {
  production: {
    id: 'production',
    title: 'Production Orders',
    short: 'Manage production runs and schedules',
  },
  inventory: {
    id: 'inventory',
    title: 'Inventory',
    short: 'Raw materials, WIP and finished goods',
  },
  maintenance: {
    id: 'maintenance',
    title: 'Maintenance',
    short: 'Machine maintenance and service logs',
  },
  quality: { id: 'quality', title: 'Quality Control', short: 'Inspections, QC checks and NCRs' },
  workers: {
    id: 'workers',
    title: 'Workers',
    short: 'Staff roster, attendance and certifications',
  },
  reports: { id: 'reports', title: 'Reports', short: 'Production, quality and downtime reports' },
  settings: { id: 'settings', title: 'Settings', short: 'Site settings, shifts and integrations' },
};

const SAMPLE_MACHINES = Array.from({ length: 14 }).map((_, i) => ({
  id: `MC-${800 + i}`,
  name: ['Press A', 'Cutter B', 'Welder C', 'Painter D'][i % 4],
  status: i % 6 === 0 ? 'Down' : i % 4 === 0 ? 'Maintenance' : 'Running',
  lastService: `2025-11-${(i % 25) + 1}`,
}));

export default function FactoryAdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('production');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const featuresList = useMemo(() => Object.values(FEATURES), []);
  const filteredFeatures = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return featuresList;
    return featuresList.filter(
      f => f.title.toLowerCase().includes(q) || f.short.toLowerCase().includes(q)
    );
  }, [query, featuresList]);

  const machinesFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_MACHINES;
    return SAMPLE_MACHINES.filter(
      m =>
        m.id.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.status.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      (active === 'maintenance' ? machinesFiltered.length : filteredFeatures.length) / perPage
    )
  );
  const pagedItems = (active === 'maintenance' ? machinesFiltered : filteredFeatures).slice(
    (page - 1) * perPage,
    page * perPage
  );

  function exportSpec() {
    const spec = Object.values(FEATURES)
      .map(f => `- ${f.title}: ${f.short}`)
      .join('\n');
    const blob = new Blob([`Factory Admin Specification\n\n${spec}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factory_admin_spec.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportCSV(rows, headers, filename) {
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => r[h] ?? '').join(','))].join(
      '\n'
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">Factory Admin</h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Manage production, inventory and plant operations.
            </p> */}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search features, machines, ids..."
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm w-56 sm:w-72 focus:outline-none"
            />
            <button
              onClick={exportSpec}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm"
            >
              Specification
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm"
            >
              Home
            </button>
            <button
              onClick={() => {
                if (active === 'maintenance')
                  exportCSV(
                    machinesFiltered,
                    ['id', 'name', 'status', 'lastService'],
                    'machines.csv'
                  );
                else exportSpec();
              }}
              className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm"
            >
              Export
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
          {active === 'production' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-800">Production Orders</h2>
                <div className="text-sm text-slate-500">Manage schedules and priorities</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Running Orders</div>
                  <div className="text-2xl font-semibold mt-2">18</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Planned Orders</div>
                  <div className="text-2xl font-semibold mt-2">24</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Blocked</div>
                  <div className="text-2xl font-semibold mt-2">2</div>
                </div>
              </div>
            </div>
          )}

          {active === 'inventory' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-800">Inventory</h2>
                <div className="text-sm text-slate-500">Raw materials and WIP</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Raw Material Value</div>
                  <div className="text-2xl font-semibold mt-2">₹ 2,480,000</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">WIP</div>
                  <div className="text-2xl font-semibold mt-2">1,120 units</div>
                </div>
              </div>
            </div>
          )}

          {active === 'maintenance' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-800">Maintenance</h2>
                <div className="text-sm text-slate-500">Machine status and service logs</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase">
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Machine</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Last Service</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedItems.map(m => (
                      <tr key={m.id} className="border-t">
                        <td className="px-3 py-3 text-sm text-slate-700">{m.id}</td>
                        <td className="px-3 py-3 text-sm text-slate-700">{m.name}</td>
                        <td className="px-3 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              m.status === 'Running'
                                ? 'bg-green-100 text-green-800'
                                : m.status === 'Maintenance'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-500">{m.lastService}</td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setSelected(m)}
                              className="text-sm px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700"
                            >
                              View
                            </button>
                            <button
                              onClick={() => alert('Create maintenance work order')}
                              className="text-sm px-2 py-1 rounded-lg bg-slate-100 text-slate-700"
                            >
                              Work Order
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

          {active === 'quality' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Quality Control</h2>
              <p className="text-sm text-slate-500 mb-4">Inspections and NCR tracking.</p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm font-medium">Last inspection: 2025-11-14</div>
                  <div className="text-xs text-slate-500">Open NCRs: 3</div>
                </div>
              </div>
            </div>
          )}

          {active === 'workers' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Workers</h2>
              <p className="text-sm text-slate-500 mb-4">Rosters, attendance and certifications.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">On Duty</div>
                  <div className="text-2xl font-semibold mt-2">128</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Cert Expiring</div>
                  <div className="text-2xl font-semibold mt-2">6</div>
                </div>
              </div>
            </div>
          )}

          {active === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Reports</h2>
              <p className="text-sm text-slate-500 mb-4">Export production and downtime reports.</p>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                  Production Report
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">
                  Downtime Report
                </button>
              </div>
            </div>
          )}

          {active === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Settings</h2>
              <p className="text-sm text-slate-500 mb-4">
                Shift patterns, integrations and site config.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <input type="checkbox" defaultChecked />
                  <div>
                    <div className="text-sm font-medium">Enable Auto Scheduling</div>
                    <div className="text-xs text-slate-500">
                      Auto-assign production based on capacity
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <input type="checkbox" />
                  <div>
                    <div className="text-sm font-medium">Enable IoT Telemetry</div>
                    <div className="text-xs text-slate-500">Collect machine metrics</div>
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
            className="relative w-full sm:max-w-lg mx-4 sm:mx-0 bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-auto"
            style={{ maxHeight: '90vh' }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{selected.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selected.id}</p>
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
                  Last Service: <span className="font-medium">{selected.lastService}</span>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Use the Work Order action to schedule service or mark as serviced.
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => alert('Create work order - implement API')}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                >
                  Work Order
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
