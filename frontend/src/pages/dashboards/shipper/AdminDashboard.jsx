// ShipperAdminDashboard.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = {
  shipments: { id: 'shipments', title: 'Shipments', short: 'Manage all shipments and statuses' },
  bookings: { id: 'bookings', title: 'Bookings', short: 'Create and track bookings' },
  customers: { id: 'customers', title: 'Customers', short: 'Customer list and account details' },
  rates: { id: 'rates', title: 'Rate Cards', short: 'Manage rates and contracts' },
  billing: { id: 'billing', title: 'Billing', short: 'Invoices and payments' },
  reports: { id: 'reports', title: 'Reports', short: 'Operational and financial reports' },
  settings: { id: 'settings', title: 'Settings', short: 'System settings and integrations' },
};

const SAMPLE_SHIPMENTS = Array.from({ length: 20 }).map((_, i) => ({
  id: `SHP-${5000 + i}`,
  origin: ['Chennai', 'Mumbai', 'Kolkata', 'Delhi'][i % 4],
  destination: ['London', 'Dubai', 'Singapore', 'Sydney'][i % 4],
  status: ['Booked', 'In Transit', 'At Port', 'Delivered'][i % 4],
  weight: `${(Math.floor(Math.random() * 20) + 1) * 50} kg`,
  eta: `2025-12-${(i % 28) + 1}`,
}));

const SAMPLE_CUSTOMERS = Array.from({ length: 12 }).map((_, i) => ({
  id: `CUST-${300 + i}`,
  name: ['Global Exports', 'Oceanic Traders', 'RapidShip'][i % 3],
  email: `contact${i + 1}@example.com`,
  phone: `+91-9${Math.floor(100000000 + Math.random() * 900000000)}`,
  status: i % 4 === 0 ? 'On hold' : 'Active',
}));

export default function ShipperAdminDashboard() {
  const [active, setActive] = useState('shipments');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 8;
  const navigate = useNavigate();

  const shipmentsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_SHIPMENTS;
    return SAMPLE_SHIPMENTS.filter(
      s =>
        s.id.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q)
    );
  }, [query]);

  const customersFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_CUSTOMERS;
    return SAMPLE_CUSTOMERS.filter(
      c =>
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      (active === 'customers' ? customersFiltered.length : shipmentsFiltered.length) / perPage
    )
  );
  const pagedItems = (active === 'customers' ? customersFiltered : shipmentsFiltered).slice(
    (page - 1) * perPage,
    page * perPage
  );

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

  function downloadSpec() {
    const content = Object.values(FEATURES)
      .map(f => `- ${f.title}: ${f.short}`)
      .join('\n');
    const blob = new Blob([`Shipper Admin Specification\n\n${content}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipper_admin_spec.txt`;
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">Shipper Admin</h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Manage shipments, bookings, customers and rates.
            </p> */}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search shipments, customers, id..."
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none"
            />
            <button
              onClick={() => {
                if (active === 'customers')
                  exportCSV(
                    customersFiltered,
                    ['id', 'name', 'email', 'phone', 'status'],
                    'customers.csv'
                  );
                else
                  exportCSV(
                    shipmentsFiltered,
                    ['id', 'origin', 'destination', 'status', 'weight', 'eta'],
                    'shipments.csv'
                  );
              }}
              className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm ml-2"
            >
              Export CSV
            </button>
            <button
              onClick={downloadSpec}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm ml-2"
            >
              Specification
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm ml-2"
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
          {active === 'shipments' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-800">Shipments</h2>
                <div className="text-sm text-slate-500">Total {shipmentsFiltered.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase">
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Origin</th>
                      <th className="px-3 py-2">Destination</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Weight</th>
                      <th className="px-3 py-2">ETA</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedItems.map(s => (
                      <tr key={s.id} className="border-t">
                        <td className="px-3 py-3 text-sm text-slate-700">{s.id}</td>
                        <td className="px-3 py-3 text-sm text-slate-700">{s.origin}</td>
                        <td className="px-3 py-3 text-sm text-slate-700">{s.destination}</td>
                        <td className="px-3 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              s.status === 'Delivered'
                                ? 'bg-green-100 text-green-800'
                                : s.status === 'In Transit'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-700">{s.weight}</td>
                        <td className="px-3 py-3 text-sm text-slate-500">{s.eta}</td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setSelected(s)}
                              className="text-sm px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700"
                            >
                              View
                            </button>
                            <button
                              onClick={() => alert('Open tracking - implement API')}
                              className="text-sm px-2 py-1 rounded-lg bg-slate-100 text-slate-700"
                            >
                              Track
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

          {active === 'bookings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Bookings</h2>
              <p className="text-sm text-slate-500 mb-4">
                Create a new booking or view recent bookings.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Quick Booking</div>
                  <div className="mt-2">
                    <button
                      onClick={() => alert('Open booking form')}
                      className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                    >
                      New Booking
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Recent Bookings</div>
                  <div className="text-xs text-slate-600 mt-2">No recent bookings</div>
                </div>
              </div>
            </div>
          )}

          {active === 'customers' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-800">Customers</h2>
                <div className="text-sm text-slate-500">Total {customersFiltered.length}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pagedItems.map(c => (
                  <div
                    key={c.id}
                    className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 flex items-start justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-slate-500">
                        {c.email} • {c.phone}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Status: <span className="font-medium">{c.status}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => alert('Open account')}
                        className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => alert('Send statement')}
                        className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs"
                      >
                        Statement
                      </button>
                    </div>
                  </div>
                ))}
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

          {active === 'rates' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Rate Cards</h2>
              <p className="text-sm text-slate-500 mb-4">Manage contracted rates and spot rates.</p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm font-medium">Export: Chennai → London</div>
                  <div className="text-xs text-slate-500 mt-1">Rate: ₹ 45,000 / container</div>
                </div>
              </div>
            </div>
          )}

          {active === 'billing' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Billing</h2>
              <p className="text-sm text-slate-500 mb-4">Create invoices and view payments.</p>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                  Create Invoice
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">
                  Pending Payments
                </button>
              </div>
            </div>
          )}

          {active === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Reports</h2>
              <p className="text-sm text-slate-500 mb-4">Operational and financial exports.</p>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                  Shipment Report
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">
                  Profitability
                </button>
              </div>
            </div>
          )}

          {active === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Settings</h2>
              <p className="text-sm text-slate-500 mb-4">
                Integrations, webhooks and system config.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <input type="checkbox" defaultChecked />
                  <div>
                    <div className="text-sm font-medium">Enable Tracking Integration</div>
                    <div className="text-xs text-slate-500">
                      Push shipment updates to partner API
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <input type="checkbox" />
                  <div>
                    <div className="text-sm font-medium">Enable Auto Invoicing</div>
                    <div className="text-xs text-slate-500">
                      Generate invoices when shipment delivered
                    </div>
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
          <div className="relative w-full sm:max-w-lg mx-4 sm:mx-0 bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selected.id}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {selected.origin} → {selected.destination}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 text-sm text-slate-600">
                <div className="mb-2">
                  Status: <span className="font-medium">{selected.status}</span>
                </div>
                <div className="mb-2">
                  Weight: <span className="font-medium">{selected.weight}</span>
                </div>
                <div className="mb-2">
                  ETA: <span className="font-medium">{selected.eta}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => alert('Open docs')}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                >
                  Documents
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
