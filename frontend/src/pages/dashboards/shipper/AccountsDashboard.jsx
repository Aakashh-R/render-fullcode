// AccountsDashboard.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = {
  invoices: { id: 'invoices', title: 'Invoices', short: 'Create and manage customer invoices' },
  receivables: {
    id: 'receivables',
    title: 'Receivables',
    short: 'Track outstanding payments and aging',
  },
  payables: { id: 'payables', title: 'Payables', short: 'Manage supplier invoices and payments' },
  reconciliation: {
    id: 'reconciliation',
    title: 'Bank Reconciliation',
    short: 'Reconcile bank statements',
  },
  payroll: {
    id: 'payroll',
    title: 'Driver Payouts',
    short: 'Calculate and process driver payouts',
  },
  gst: { id: 'gst', title: 'GST & Taxes', short: 'Prepare GST/TDS and tax filings' },
  reports: { id: 'reports', title: 'Financial Reports', short: 'P&L, cash flow and aging reports' },
  expenses: { id: 'expenses', title: 'Expenses', short: 'Record and approve operational expenses' },
};

const SAMPLE_INVOICES = Array.from({ length: 18 }).map((_, i) => ({
  id: `INV-${2000 + i}`,
  customer: ['Alpha Logistics', 'Blue Freight', 'Ceylon Cargo'][i % 3],
  amount: (Math.floor(Math.random() * 100) + 20) * 100,
  status: i % 4 === 0 ? 'Overdue' : i % 3 === 0 ? 'Part Paid' : 'Pending',
  date: `2025-11-${(i % 28) + 1}`,
}));

export default function AccountsDashboard() {
  const [active, setActive] = useState('invoices');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const perPage = 8;
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const invoicesFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_INVOICES;
    return SAMPLE_INVOICES.filter(
      r =>
        r.id.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        String(r.amount).includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(invoicesFiltered.length / perPage));
  const paged = invoicesFiltered.slice((page - 1) * perPage, page * perPage);

  function exportCSV(rows = invoicesFiltered, filename = 'invoices.csv') {
    const hdr = 'id,customer,amount,status,date';
    const body = rows.map(r => `${r.id},${r.customer},${r.amount},${r.status},${r.date}`);
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
    const blob = new Blob([`Accounts Dashboard Specification\n\n${content}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accounts_spec.txt`;
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">Accounts</h1>
            {/* <p className="text-sm text-slate-500 mt-1">Finance controls for the shipper.</p> */}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search invoices, customer, id..."
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
                <h2 className="text-lg font-medium text-slate-800">Invoices</h2>
                <div className="text-sm text-slate-500">Total {invoicesFiltered.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase">
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">Customer</th>
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
                        <td className="px-3 py-3 text-sm text-slate-700">{r.customer}</td>
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
                              onClick={() => alert('Mark as paid - implement API')}
                              className="text-sm px-2 py-1 rounded-lg bg-slate-100 text-slate-700"
                            >
                              Mark Paid
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

          {active === 'receivables' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Receivables</h2>
              <p className="text-sm text-slate-500 mb-4">Aging and collection status.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">Total Outstanding</div>
                  <div className="text-2xl font-semibold mt-2">₹ 1,240,000</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">90 Days</div>
                  <div className="text-2xl font-semibold mt-2">₹ 224,000</div>
                </div>
              </div>
            </div>
          )}

          {active === 'payables' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Payables</h2>
              <p className="text-sm text-slate-500 mb-4">
                Upcoming supplier payments and due dates.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Blue Freight</div>
                    <div className="text-xs text-slate-500">Due: 2025-11-24 • ₹ 82,000</div>
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

          {active === 'reconciliation' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Bank Reconciliation</h2>
              <p className="text-sm text-slate-500 mb-4">
                Match bank transactions to system entries.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-sm text-slate-700">Last reconciled: 2025-11-10</div>
                <div className="mt-3 text-sm text-slate-600">Unmatched: 12 transactions</div>
              </div>
            </div>
          )}

          {active === 'payroll' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Driver Payouts</h2>
              <p className="text-sm text-slate-500 mb-4">
                Advance, trip-pay and final settlements.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm font-medium">Karthik R</div>
                  <div className="text-xs text-slate-500">Pending: ₹ 12,400</div>
                </div>
              </div>
            </div>
          )}

          {active === 'gst' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">GST & Taxes</h2>
              <p className="text-sm text-slate-500 mb-4">Return status and pending filings.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">GSTR-1 Filed</div>
                  <div className="text-sm font-medium mt-1">Month: Oct 2025</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-500">GSTR-3B Pending</div>
                  <div className="text-sm font-medium mt-1">Due: 2025-11-20</div>
                </div>
              </div>
            </div>
          )}

          {active === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Reports</h2>
              <p className="text-sm text-slate-500 mb-4">
                Export financial and operational reports.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                  P&L
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">
                  Aging
                </button>
              </div>
            </div>
          )}

          {active === 'expenses' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-2">Expenses</h2>
              <p className="text-sm text-slate-500 mb-4">Fuel, repairs, tolls and permit costs.</p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm font-medium">Fuel - Blue Freight</div>
                  <div className="text-xs text-slate-500">₹ 18,200 • 2025-11-13</div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div onClick={() => setSelected(null)} className="absolute inset-0 bg-black/40"></div>
          <div className="relative w-full sm:max-w-md mx-4 sm:mx-0 bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selected.id}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selected.customer}</p>
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
                  onClick={() => alert('Download PDF - implement API')}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                >
                  Download
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
