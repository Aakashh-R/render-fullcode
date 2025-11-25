
// ClearanceAgentCompanyDashboard.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = {
  commercial: { id: "commercial", title: "Commercial / Sales", short: "Contracts, SLAs and key accounts" },
  operations: { id: "operations", title: "Operations Oversight", short: "Filing SLAs, slot bookings, cut-offs" },
  finance: { id: "finance", title: "Finance & Billing", short: "P&L, receivables and duty reconciliation" },
  compliance: { id: "compliance", title: "Compliance", short: "Customs, GST, bonds and audit readiness" },
  vendors: { id: "vendors", title: "Vendors & Partners", short: "Manage C&F, port partners and SLAs" },
  reports: { id: "reports", title: "Reports & KPIs", short: "Management reports, aging and dashboards" },
  risk: { id: "risk", title: "Risk & Guarantees", short: "Bank guarantees, insurance and claims" },
  tech: { id: "tech", title: "Technology", short: "APIs, TMS integrations and telemetry" },
};

const SAMPLE_METRICS = {
  filingsToday: 46,
  avgClearanceTimeHrs: 12,
  outstandingReceivables: 820000,
  monthRevenue: 2750000,
};

const SAMPLE_ACCOUNTS = Array.from({ length: 12 }).map((_, i) => ({
  id: `CUST-${500 + i}`,
  name: ["Alpha Importers", "Oceanex", "TransGlobal"][i % 3],
  outstanding: (Math.floor(Math.random() * 50) + 10) * 1000,
  lastActive: `2025-11-${(i % 28) + 1}`,
  status: i % 5 === 0 ? "On Hold" : "Active",
}));

export default function ClearanceAgentCompanyDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("operations");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const featuresList = useMemo(() => Object.values(FEATURES), []);
  const filteredFeatures = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return featuresList;
    return featuresList.filter(f => f.title.toLowerCase().includes(q) || f.short.toLowerCase().includes(q));
  }, [query, featuresList]);

  const accountsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_ACCOUNTS;
    return SAMPLE_ACCOUNTS.filter(a => a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
  }, [query]);

  const totalPages = Math.max(1, Math.ceil((active === "commercial" ? accountsFiltered.length : filteredFeatures.length) / perPage));
  const paged = (active === "commercial" ? accountsFiltered : filteredFeatures).slice((page - 1) * perPage, page * perPage);

  function exportSpec() {
    const spec = Object.values(FEATURES).map(f => `- ${f.title}: ${f.short}`).join("\n");
    const blob = new Blob([`Clearance Agent — Company Owner Specification\n\n${spec}`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clearance_company_owner_spec.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportCSV(rows, headers, filename) {
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => (r[h] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
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
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">Clearance Agent — Company Owner</h1>
   
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col text-right mr-2">
              
            </div>

            <button onClick={exportSpec} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm">Specification</button>
            <button onClick={() => navigate("/signup")} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm">Home</button>
            <button onClick={() => {
              if (active === "commercial") exportCSV(accountsFiltered, ["id","name","outstanding","lastActive","status"], "accounts.csv");
              else exportSpec();
            }} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm">Export</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Filings today</div>
                  <div className="text-2xl font-semibold mt-1">{SAMPLE_METRICS.filingsToday}</div>
                </div>
                <div className="text-sm text-slate-500">
                  <div>Avg clearance</div>
                  <div className="font-medium mt-1">{SAMPLE_METRICS.avgClearanceTimeHrs} hrs</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-500">Revenue: <span className="font-medium">₹ {(SAMPLE_METRICS.monthRevenue).toLocaleString()}</span></div>
              <div className="mt-1 text-xs text-slate-500">Receivables: <span className="font-medium">₹ {SAMPLE_METRICS.outstandingReceivables.toLocaleString()}</span></div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <h3 className="text-sm font-medium text-slate-800">Owner Quick Actions</h3>
              <div className="mt-3 flex flex-col gap-2">
                <button onClick={() => setActive("finance")} className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm text-left">Open Finance</button>
                <button onClick={() => setActive("compliance")} className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm text-left">Open Compliance</button>
                <button onClick={() => setActive("vendors")} className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm text-left">Vendors</button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search features or accounts..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none"
                />
              </div>
              <div className="ml-4 hidden sm:block text-sm text-slate-500">Showing {active === "commercial" ? accountsFiltered.length : filteredFeatures.length}</div>
            </div>

            <nav className="mb-2">
              <div className="flex flex-wrap gap-2">
                {Object.values(FEATURES).map(f => (
                  <button
                    key={f.id}
                    onClick={() => { setActive(f.id); setPage(1); }}
                    className={`px-3 py-2 rounded-xl text-sm ${active === f.id ? "bg-indigo-600 text-white" : "bg-white text-slate-700 border border-slate-200"}`}
                  >
                    {f.title}
                  </button>
                ))}
              </div>
            </nav>

            <section>
              {active === "operations" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-slate-800">Operations Oversight</h2>
                    <div className="text-sm text-slate-500">Filings, cut-offs and SLA health</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="text-sm text-slate-500">On-time filings</div>
                      <div className="text-2xl font-semibold mt-2">92%</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="text-sm text-slate-500">Slot availability</div>
                      <div className="text-2xl font-semibold mt-2">78%</div>
                    </div>
                  </div>
                </div>
              )}

              {active === "finance" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-slate-800">Finance & Billing</h2>
                    <div className="text-sm text-slate-500">Receivables & cashflow</div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs text-slate-500 uppercase">
                          <th className="px-3 py-2">Client</th>
                          <th className="px-3 py-2">Outstanding</th>
                          <th className="px-3 py-2">Last Active</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountsFiltered.slice((page - 1) * perPage, page * perPage).map(a => (
                          <tr key={a.id} className="border-t">
                            <td className="px-3 py-3 text-sm text-slate-700">{a.name}</td>
                            <td className="px-3 py-3 text-sm text-slate-700">₹ {a.outstanding.toLocaleString()}</td>
                            <td className="px-3 py-3 text-sm text-slate-500">{a.lastActive}</td>
                            <td className="px-3 py-3 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === "Active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{a.status}</span></td>
                            <td className="px-3 py-3 text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <button onClick={() => setSelected(a)} className="text-sm px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700">Open</button>
                                <button onClick={() => exportCSV([a], ["id","name","outstanding","lastActive","status"], `account_${a.id}.csv`)} className="text-sm px-2 py-1 rounded-lg bg-slate-100 text-slate-700">Export</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-slate-500">Page {page} of {Math.max(1, Math.ceil(accountsFiltered.length / perPage))}</div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded-xl bg-white border border-slate-200">Prev</button>
                      <button onClick={() => setPage(p => Math.min(Math.max(1, Math.ceil(accountsFiltered.length / perPage)), p + 1))} className="px-3 py-1 rounded-xl bg-white border border-slate-200">Next</button>
                    </div>
                  </div>
                </div>
              )}

              {active === "compliance" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-lg font-medium text-slate-800 mb-2">Compliance</h2>
                  <p className="text-sm text-slate-500 mb-4">Bonds, audits and customs compliance status.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="text-sm text-slate-500">Active BGs</div>
                      <div className="text-2xl font-semibold mt-2">14</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="text-sm text-slate-500">Pending Audit Items</div>
                      <div className="text-2xl font-semibold mt-2">3</div>
                    </div>
                  </div>
                </div>
              )}

              {active === "vendors" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-lg font-medium text-slate-800 mb-2">Vendors & Partners</h2>
                  <p className="text-sm text-slate-500 mb-4">C&F agents, port handlers and SLAs.</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <div className="text-sm font-medium">Oceanic CNF — SLA 98%</div>
                      <div className="text-xs text-slate-500 mt-1">Contact: +91-9876543210</div>
                    </div>
                  </div>
                </div>
              )}

              {active === "reports" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-lg font-medium text-slate-800 mb-2">Reports & KPIs</h2>
                  <p className="text-sm text-slate-500 mb-4">Export management reports and KPI packs.</p>
                  <div className="flex gap-2">
                    <button onClick={() => exportSpec()} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Export KPIs</button>
                    <button onClick={() => alert("Open detailed report UI")} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">Open Reports</button>
                  </div>
                </div>
              )}

              {active === "risk" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-lg font-medium text-slate-800 mb-2">Risk & Guarantees</h2>
                  <p className="text-sm text-slate-500 mb-4">Monitor BG expiries, insurance and claims exposure.</p>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-sm text-slate-700">BGs expiring within 90 days: 2</div>
                    <div className="mt-2 text-xs text-slate-500">Claims open: 1</div>
                  </div>
                </div>
              )}

              {active === "tech" && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-lg font-medium text-slate-800 mb-2">Technology</h2>
                  <p className="text-sm text-slate-500 mb-4">API status, integrations and telemetry.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="text-sm text-slate-500">Customs API</div>
                      <div className="text-sm font-medium mt-1">Connected</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="text-sm text-slate-500">Billing System</div>
                      <div className="text-sm font-medium mt-1">Synced</div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div onClick={() => setSelected(null)} className="absolute inset-0 bg-black/40"></div>
          <div className="relative w-full sm:max-w-2xl mx-4 sm:mx-0 bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-auto" style={{ maxHeight: "90vh" }}>
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{selected.name || selected.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selected.id || selected.short}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate("/signup")} className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm">Home</button>
                  <button onClick={() => setSelected(null)} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">Close</button>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-600">
                {selected.outstanding !== undefined ? (
                  <>
                    <div className="mb-2">Outstanding: <span className="font-medium">₹ {selected.outstanding.toLocaleString()}</span></div>
                    <div className="mb-2">Last Active: <span className="font-medium">{selected.lastActive}</span></div>
                    <div className="mb-2">Status: <span className="font-medium">{selected.status}</span></div>
                  </>
                ) : (
                  <p>{selected.short || "Details not available."}</p>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <button onClick={() => {
                  if (selected && selected.id) exportCSV([selected], ["id","name","outstanding","lastActive","status"], `account_${selected.id}.csv`);
                  else exportSpec();
                }} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">Export</button>
                <button onClick={() => setSelected(null)} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
