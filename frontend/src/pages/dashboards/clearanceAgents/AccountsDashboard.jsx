// ClearanceAgentAccountsDashboard.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = {
  invoices: {
    id: 'invoices',
    title: 'Clearance Invoices',
    short: 'Create and manage client/voucher invoices',
  },
  duties: {
    id: 'duties',
    title: 'Duties & Taxes',
    short: 'Calculate customs duties, GST and taxes',
  },
  payables: {
    id: 'payables',
    title: 'Vendor Payments',
    short: 'Manage payments to C&F, port and vendors',
  },
  receivables: {
    id: 'receivables',
    title: 'Collections',
    short: 'Track client receivables and aging',
  },
  bonds: {
    id: 'bonds',
    title: 'Bonds & Guarantees',
    short: 'Track BGs, bond expiries and renewals',
  },
  reconciliation: {
    id: 'reconciliation',
    title: 'Reconciliation',
    short: 'Bank & customs filing reconciliation',
  },
  reports: { id: 'reports', title: 'Reports', short: 'Aging, cash flow and customs reports' },
  expenses: {
    id: 'expenses',
    title: 'Expenses',
    short: 'Demurrage, detention and incidental costs',
  },
};

const SAMPLE_RECORDS = Array.from({ length: 20 }).map((_, i) => ({
  id: `CAI-${3000 + i}`,
  client: ['A1 Traders', 'Oceanex', 'TransGlobal'][i % 3],
  type: i % 4 === 0 ? 'Invoice' : i % 4 === 1 ? 'Duty' : i % 4 === 2 ? 'Vendor' : 'Expense',
  amount: (Math.floor(Math.random() * 200) + 50) * 100,
  status: i % 5 === 0 ? 'Overdue' : i % 3 === 0 ? 'Part Paid' : 'Pending',
  date: `2025-11-${(i % 28) + 1}`,
}));

export default function ClearanceAgentAccountsDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('invoices');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const recordsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_RECORDS;
    return SAMPLE_RECORDS.filter(
      r =>
        r.id.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        String(r.amount).includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(recordsFiltered.length / perPage));
  const paged = recordsFiltered.slice((page - 1) * perPage, page * perPage);

  function exportCSV(rows = recordsFiltered, filename = 'clearance_records.csv') {
    const hdr = 'id,client,type,amount,status,date';
    const body = rows.map(r => `${r.id},${r.client},${r.type},${r.amount},${r.status},${r.date}`);
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
    const content = Object.values(FEATURES)
      .map(f => `- ${f.title}: ${f.short}`)
      .join('\n');
    const blob = new Blob([`Clearance Agent Accounts Specification\n\n${content}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clearance_agent_accounts_spec.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
              Clearance Agent — Accounts
            </h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Customs billing, duty payments and reconciliation.
            </p> */}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search id, client, amount, status..."
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

        <nav className="mb-5">
          <div className="flex flex-wrap gap-2">
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
          {active === 'invoices' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-800">Invoices & Notes</h2>
                <div className="text-sm text-slate-500">Total {recordsFiltered.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase">
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Client</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map(r => (
                      <tr key={r.id} className="border-t">
                        <td className="px-3 py-3 text-sm text-slate-700">{r.id}</td>
                        <td className="px-3 py-3 text-sm text-slate-700">{r.client}</td>
                        <td className="px-3 py-3 text-sm text-slate-600">{r.type}</td>
                        <td className="px-3 py-3 text-sm text-slate-700">
                          ₹ {r.amount.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              r.status === 'Overdue'
                                ? 'bg-rose-100 text-rose-700'
                                : r.status === 'Part Paid'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-slate-500">{r.date}</td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setSelected(r)}
                              className="text-sm px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700"
                            >
                              View
                            </button>
                            <button
                              onClick={() => alert('Open payment flow - implement API')}
                              className="text-sm px-2 py-1 rounded-lg bg-slate-100 text-slate-700"
                            >
                              Pay
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

          {active === 'duties' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Duties & Taxes</h2>
              <p className="text-sm text-slate-600 mb-4">
                Pending duty payments and recent filings.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Pending Duty</div>
                  <div className="text-2xl font-semibold mt-2">₹ 420,000</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Recent Filings</div>
                  <div className="text-xs text-slate-600 mt-2">
                    10 declarations filed in last 7 days
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === 'payables' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Vendor Payments</h2>
              <p className="text-sm text-slate-600 mb-4">
                Payments due to port, C&F and service vendors.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Port Charges - JNPT</div>
                    <div className="text-xs text-slate-500">Due: 2025-11-21 • ₹ 88,000</div>
                  </div>
                  <div>
                    <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm">
                      Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === 'receivables' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Collections</h2>
              <p className="text-sm text-slate-600 mb-4">Outstanding client invoices and aging.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Total Outstanding</div>
                  <div className="text-2xl font-semibold mt-2">₹ 1,020,000</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">60 Days</div>
                  <div className="text-2xl font-semibold mt-2">₹ 210,000</div>
                </div>
              </div>
            </div>
          )}

          {active === 'bonds' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Bonds & Guarantees</h2>
              <p className="text-sm text-slate-600 mb-4">
                Track bank guarantees and bond expiries.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm font-medium">BG - 2024/12345</div>
                  <div className="text-xs text-slate-500 mt-1">Expiry: 2026-01-12</div>
                </div>
              </div>
            </div>
          )}

          {active === 'reconciliation' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Reconciliation</h2>
              <p className="text-sm text-slate-600 mb-4">
                Bank & customs filing reconciliation status.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-sm text-slate-700">Unmatched transactions: 9</div>
                <div className="mt-2 text-xs text-slate-500">Last reconciled: 2025-11-12</div>
              </div>
            </div>
          )}

          {active === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Reports</h2>
              <p className="text-sm text-slate-600 mb-4">Aging, customs and cash flow exports.</p>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                  Aging Report
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">
                  Customs Report
                </button>
              </div>
            </div>
          )}

          {active === 'expenses' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Expenses</h2>
              <p className="text-sm text-slate-600 mb-4">
                Demurrage, detention and incidental costs.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm font-medium">Demurrage - Container ABC</div>
                  <div className="text-xs text-slate-500 mt-1">₹ 12,800 • 2025-11-10</div>
                </div>
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
                  <p className="text-sm text-slate-500 mt-1">{selected.client}</p>
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
                  Type: <span className="font-medium">{selected.type}</span>
                </div>
                <div className="mb-2">
                  Amount: <span className="font-medium">₹ {selected.amount.toLocaleString()}</span>
                </div>
                <div className="mb-2">
                  Status: <span className="font-medium">{selected.status}</span>
                </div>
                <div className="mb-2">
                  Date: <span className="font-medium">{selected.date}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => exportCSV([selected], `record_${selected.id}.csv`)}
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
