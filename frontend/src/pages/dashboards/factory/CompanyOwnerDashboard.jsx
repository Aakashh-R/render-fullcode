// FactoryOwnerDashboard.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = {
  strategy: {
    id: 'strategy',
    title: 'Plant Strategy',
    short: 'Capacity planning, expansion and lane strategy',
  },
  production: {
    id: 'production',
    title: 'Production Oversight',
    short: 'High-level production KPIs and bottlenecks',
  },
  capex: {
    id: 'capex',
    title: 'CapEx & Assets',
    short: 'Approve capital spend and asset lifecycle',
  },
  finance: {
    id: 'finance',
    title: 'Finance & P&L',
    short: 'Margins, budgeting and cash approvals',
  },
  procurement: {
    id: 'procurement',
    title: 'Procurement',
    short: 'Raw material contracts and vendor strategy',
  },
  quality: {
    id: 'quality',
    title: 'Quality & Compliance',
    short: 'Quality targets, audits and compliance',
  },
  people: { id: 'people', title: 'People & HR', short: 'Senior hires, policies and retention' },
  safety: {
    id: 'safety',
    title: 'Safety & Environment',
    short: 'EHS programs and incident oversight',
  },
  reports: {
    id: 'reports',
    title: 'Reports & Governance',
    short: 'Board reports, audits and KPI exports',
  },
};

const SAMPLE_METRICS = {
  oee: 72,
  yieldPct: 98.2,
  downtimeHrs: 12,
  monthRevenue: 5200000,
};

export default function FactoryOwnerDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('strategy');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const featuresList = useMemo(() => Object.values(FEATURES), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return featuresList;
    return featuresList.filter(
      f => f.title.toLowerCase().includes(q) || f.short.toLowerCase().includes(q)
    );
  }, [query, featuresList]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  function exportSpec() {
    const spec = Object.values(FEATURES)
      .map(f => `- ${f.title}: ${f.short}`)
      .join('\n');
    const blob = new Blob([`Factory Owner Dashboard Specification\n\n${spec}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factory_owner_spec.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
              Factory — Company Owner
            </h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Executive view for plant owners and leadership.
            </p> */}
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">OEE</div>
                  <div className="text-2xl font-semibold mt-1">{SAMPLE_METRICS.oee}%</div>
                </div>
                <div className="text-sm text-slate-500">
                  <div>Yield</div>
                  <div className="font-medium mt-1">{SAMPLE_METRICS.yieldPct}%</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-500">
                Downtime: <span className="font-medium">{SAMPLE_METRICS.downtimeHrs} hrs</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Revenue:{' '}
                <span className="font-medium">
                  ₹ {SAMPLE_METRICS.monthRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <h3 className="text-sm font-medium text-slate-800">Owner Actions</h3>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() => setActive('capex')}
                  className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm text-left"
                >
                  Review CapEx
                </button>
                <button
                  onClick={() => setActive('finance')}
                  className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm text-left"
                >
                  Open P&L
                </button>
                <button
                  onClick={() => setActive('strategy')}
                  className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm text-left"
                >
                  Strategy
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <input
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search features..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none"
                />
              </div>
              <div className="ml-4 hidden sm:block text-sm text-slate-500">
                Showing {filtered.length} items
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paged.map(f => (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col"
                >
                  <div>
                    <h4 className="text-lg font-medium text-slate-800">{f.title}</h4>
                    <p className="text-sm text-slate-500 mt-2">{f.short}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setSelected(f)}
                      className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([`${f.title}\n\n${f.short}`], {
                          type: 'text/plain;charset=utf-8',
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${f.id}_spec.txt`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm"
                    >
                      Download
                    </button>
                    <span className="ml-auto text-xs text-slate-400">#{f.id}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-2">
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
          </main>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div onClick={() => setSelected(null)} className="absolute inset-0 bg-black/40"></div>
          <div
            className="relative w-full sm:max-w-2xl mx-4 sm:mx-0 bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-auto"
            style={{ maxHeight: '90vh' }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{selected.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selected.short}</p>
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
                <p>{selected.short}</p>
                <div className="mt-3 text-xs text-slate-500">
                  Owner-level actions include approvals, KPI review and governance tasks.
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={exportSpec}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                >
                  Export Spec
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
