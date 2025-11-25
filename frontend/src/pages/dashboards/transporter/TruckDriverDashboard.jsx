// TruckDriverRolesPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES_DATA = [
  {
    id: 'transport',
    title: 'Transporting Export Goods',
    short: 'Pick up goods and deliver to port/CFS/airport on time.',
    details:
      'Drive the truck to pick up export goods from the warehouse or supplier and deliver them safely to seaports, airports, CFS (Container Freight Stations), or ICDs. Monitor timing against vessel/flight cut-offs and communicate ETA to the export team.',
  },
  {
    id: 'loading',
    title: 'Loading & Unloading Assistance',
    short: 'Assist/supervise loading; secure cargo to prevent damage.',
    details:
      'Help or supervise loading of export cargo. Ensure goods are placed properly to avoid damage, confirm load is balanced and tied properly, and check that weight limits and safety rules are followed.',
  },
  {
    id: 'documents',
    title: 'Document Handling',
    short: 'Carry and submit required export documents.',
    details:
      'Handle documents such as Delivery Challan, Invoice copies, Packing List, E-Way Bill, Gate Pass, LR/Consignment Note and submit as required.',
  },
  {
    id: 'coordination',
    title: 'Coordination With Team',
    short: 'Communicate arrival times, delays and follow logistics instructions.',
    details:
      'Communicate arrival times, delays or issues to the transport or export team. Follow route instructions and relay incidents.',
  },
  {
    id: 'maintenance',
    title: 'Vehicle Maintenance & Safety',
    short: 'Daily vehicle checks and reporting of mechanical issues.',
    details:
      'Daily routine checks (fuel, brakes, lights, tyre condition), report mechanical problems, and ensure compliance.',
  },
  {
    id: 'compliance',
    title: 'Compliance & Legal Requirements',
    short: 'Carry valid documents and permits.',
    details: 'Carry Driving License, RC, Insurance, Pollution certificate and any state permits.',
  },
  {
    id: 'timely',
    title: 'Timely Delivery',
    short: 'Deliver on-time to avoid missing vessel/flight cut-offs.',
    details: 'Ensure on-time movement to CFS/ICD, airport cargo terminal or port stuffing point.',
  },
  {
    id: 'safety',
    title: 'Cargo Safety & Security',
    short: 'Protect cargo from damage, tampering and theft.',
    details:
      'Maintain safe driving practices to protect goods, ensure container seals are intact, and report issues.',
  },
  {
    id: 'logs',
    title: 'Keeping Trip Logs',
    short: 'Record trip data: distance, fuel, gate in/out, incidents.',
    details: 'Record distance traveled, fuel usage, time in/out and incidents.',
  },
  {
    id: 'customs',
    title: 'Supporting Customs Procedures',
    short: 'Support weighing, inspections and CHA coordination.',
    details: 'At CFS/Port, get containers weighed, submit documents and coordinate with CHA.',
  },
];

export default function TruckDriverRolesPage() {
  const [query, setQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = ROLES_DATA.filter(r => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      r.short.toLowerCase().includes(q) ||
      r.details.toLowerCase().includes(q)
    );
  });

  function openRole(role) {
    setSelectedRole(role);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedRole(null);
  }

  function downloadSpec() {
    const content = ROLES_DATA.map(r => `- ${r.title}: ${r.short}`).join('\n');
    const blob = new Blob([`Truck Driver Roles Specification\n\n${content}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truck_driver_roles_spec.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-start justify-between mb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
              Truck Driver — Export Roles
            </h1>
          
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/signup')}
              className="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-sm"
            >
              Home
            </button>
            <button
              onClick={downloadSpec}
              className="px-3 py-2 rounded-2xl bg-indigo-600 text-white text-sm"
            >
              Specification
            </button>
          </div>
        </header>

        <div className="mb-4">
          <input
            id="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search roles or keywords..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none"
          />
        </div>

        <main>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No roles match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(role => (
                <article
                  key={role.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col"
                >
                  <div>
                    <h3 className="text-lg font-medium text-slate-800">{role.title}</h3>
                    <p className="text-sm text-slate-500 mt-2">{role.short}</p>
                    <details className="mt-3 text-sm text-slate-600">
                      <summary className="cursor-pointer select-none">Quick preview</summary>
                      <p className="mt-2 leading-relaxed">{role.details}</p>
                    </details>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => openRole(role)}
                      className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([`Title: ${role.title}\n\n${role.details}`], {
                          type: 'text/plain;charset=utf-8',
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${role.id}_jd.txt`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm"
                    >
                      Download JD
                    </button>
                    <span className="ml-auto text-xs text-slate-400">ID: {role.id}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {isModalOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div onClick={closeModal} className="absolute inset-0 bg-black/40"></div>
          <div
            className="relative w-full sm:max-w-2xl mx-4 sm:mx-0 bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-auto"
            style={{ maxHeight: '90vh' }}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">{selectedRole.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/isgnup')}
                    className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm"
                  >
                    Home
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {selectedRole.details}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob(
                      [`Title: ${selectedRole.title}\n\n${selectedRole.details}`],
                      { type: 'text/plain;charset=utf-8' }
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedRole.id}_jd.txt`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                >
                  Download JD
                </button>
                <button
                  onClick={closeModal}
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
