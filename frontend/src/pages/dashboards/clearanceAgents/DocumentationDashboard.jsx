// DocumentationPage.jsx
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { apiGet, apiPost } from '../../../api';

// const LOCAL_TEMPLATES = [
//   {
//     id: 'quotation',
//     title: 'QUOTATION',
//     description: 'Standard quotation for goods/services.',
//     fields: [
//       { name: 'date', label: 'Date', type: 'date' },
//       { name: 'to', label: 'Recipient Name', type: 'text' },
//       { name: 'company', label: 'Recipient Company', type: 'text' },
//       { name: 'items', label: 'Items (comma separated)', type: 'textarea' },
//       { name: 'total', label: 'Total Amount', type: 'text' },
//       { name: 'notes', label: 'Notes', type: 'textarea' },
//     ],
//     templateBody: `<h2>Quotation</h2>
// <p>Date: {{date}}</p>
// <p>To: <strong>{{to}}</strong> — {{company}}</p>
// <p>Items: {{items}}</p>
// <p>Total: {{total}}</p>
// <p>Notes: {{notes}}</p>`,
//   },
//   {
//     id: 'invoice',
//     title: 'INVOICE',
//     description: 'Commercial invoice for customs / billing.',
//     fields: [
//       { name: 'date', label: 'Date', type: 'date' },
//       { name: 'invoiceNo', label: 'Invoice No.', type: 'text' },
//       { name: 'billTo', label: 'Bill To', type: 'text' },
//       { name: 'items', label: 'Items (json or newline)', type: 'textarea' },
//       { name: 'subtotal', label: 'Subtotal', type: 'text' },
//       { name: 'tax', label: 'Tax', type: 'text' },
//       { name: 'total', label: 'Total', type: 'text' },
//     ],
//     templateBody: `<h2>Invoice</h2>
// <p>Date: {{date}}</p>
// <p>Invoice No: {{invoiceNo}}</p>
// <p>Bill To: {{billTo}}</p>
// <pre style="white-space:pre-wrap;">{{items}}</pre>
// <p>Subtotal: {{subtotal}}</p>
// <p>Tax: {{tax}}</p>
// <p><strong>Total: {{total}}</strong></p>`,
//   },
// ];

// templates-export.js
export const  LOCAL_TEMPLATES= [
  {
    id: "fumigation",
    title: "FUMIGATION CERTIFICATE",
    description: "Certificate confirming fumigation treatment for export goods.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "consignor", label: "Consignor / Exporter", type: "text" },
      { name: "consignee", label: "Consignee / Importer", type: "text" },
      { name: "vessel", label: "Vessel / Flight", type: "text" },
      { name: "voyage", label: "Voyage / Flight No.", type: "text" },
      { name: "packages", label: "Packages (count / description)", type: "textarea" },
      { name: "grossWeight", label: "Gross Weight", type: "text" },
      { name: "fumigant", label: "Fumigant Used", type: "text" },
      { name: "treatmentDate", label: "Treatment Date", type: "date" },
      { name: "certificateNo", label: "Certificate No.", type: "text" },
      { name: "issuer", label: "Issued By (Company / Officer)", type: "text" }
    ],
    templateBody: `<h2>Fumigation Certificate</h2>
<p>Date: {{date}}</p>
<p>Certificate No: <strong>{{certificateNo}}</strong></p>
<p>Consignor: {{consignor}}</p>
<p>Consignee: {{consignee}}</p>
<p>Vessel / Flight: {{vessel}} • Voyage/Flight: {{voyage}}</p>
<p>Packages / Description: <pre style="white-space:pre-wrap;">{{packages}}</pre></p>
<p>Gross Weight: {{grossWeight}}</p>
<p>Fumigant: {{fumigant}} — Treatment Date: {{treatmentDate}}</p>
<p>Issued By: {{issuer}}</p>
<p>Declaration: This is to certify that the above consignment has been fumigated in accordance with the relevant phytosanitary requirements.</p>`
  },

  {
    id: "apeda_spice_board",
    title: "APEDA / SPICE BOARD CERTIFICATE",
    description: "APEDA / Spice Board / Industry-specific certificate template.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "exporter", label: "Exporter", type: "text" },
      { name: "consignee", label: "Consignee", type: "text" },
      { name: "product", label: "Product Description", type: "text" },
      { name: "hsCode", label: "HS Code", type: "text" },
      { name: "quantity", label: "Quantity", type: "text" },
      { name: "netWeight", label: "Net Weight", type: "text" },
      { name: "lot", label: "Lot / Batch No.", type: "text" },
      { name: "certificateNo", label: "Certificate No.", type: "text" },
      { name: "authority", label: "Issuing Authority", type: "text" }
    ],
    templateBody: `<h2>APEDA / Spice Board Certificate</h2>
<p>Date: {{date}}</p>
<p>Certificate No: <strong>{{certificateNo}}</strong></p>
<p>Exporter: {{exporter}}</p>
<p>Consignee: {{consignee}}</p>
<p>Product: {{product}} (HS: {{hsCode}})</p>
<p>Quantity: {{quantity}} • Net Weight: {{netWeight}}</p>
<p>Lot / Batch: {{lot}}</p>
<p>Authority: {{authority}}</p>
<p>Declaration: This certificate is issued under the authority of the relevant board and confirms that the consignment complies with applicable standards.</p>`
  },

  {
    id: "draft_bill_of_lading",
    title: "DRAFT BILL OF LADING",
    description: "Draft bill of lading for review before original issuance.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "shipper", label: "Shipper", type: "text" },
      { name: "consignee", label: "Consignee", type: "text" },
      { name: "notifyParty", label: "Notify Party", type: "text" },
      { name: "vessel", label: "Vessel", type: "text" },
      { name: "voyage", label: "Voyage", type: "text" },
      { name: "portLoading", label: "Port of Loading", type: "text" },
      { name: "portDischarge", label: "Port of Discharge", type: "text" },
      { name: "marks", label: "Marks & Nos", type: "textarea" },
      { name: "descriptionGoods", label: "Description of Goods", type: "textarea" },
      { name: "containers", label: "Container Nos", type: "text" },
      { name: "grossWeight", label: "Gross Weight", type: "text" },
      { name: "shipperRef", label: "Shipper's Reference", type: "text" }
    ],
    templateBody: `<h2>Draft Bill of Lading</h2>
<p>Date: {{date}}</p>
<p>Shipper: {{shipper}}</p>
<p>Consignee: {{consignee}}</p>
<p>Notify Party: {{notifyParty}}</p>
<p>Vessel / Voyage: {{vessel}} / {{voyage}}</p>
<p>Port of Loading: {{portLoading}} • Port of Discharge: {{portDischarge}}</p>
<p>Marks & Nos: <pre style="white-space:pre-wrap;">{{marks}}</pre></p>
<p>Description of Goods: <pre style="white-space:pre-wrap;">{{descriptionGoods}}</pre></p>
<p>Container Nos: {{containers}}</p>
<p>Gross Weight: {{grossWeight}}</p>
<p>Shipper Ref: {{shipperRef}}</p>`
  },

  {
    id: "draft_certificate_of_origin",
    title: "DRAFT CERTIFICATE OF ORIGIN",
    description: "Draft certificate of origin for review (exporter's declaration).",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "exporter", label: "Exporter", type: "text" },
      { name: "consignee", label: "Consignee", type: "text" },
      { name: "countryOrigin", label: "Country of Origin", type: "text" },
      { name: "product", label: "Product Description", type: "text" },
      { name: "hsCode", label: "HS Code", type: "text" },
      { name: "quantity", label: "Quantity", type: "text" },
      { name: "invoiceNo", label: "Invoice No.", type: "text" },
      { name: "declarationBy", label: "Declared By (Name/Title)", type: "text" }
    ],
    templateBody: `<h2>Draft Certificate of Origin</h2>
<p>Date: {{date}}</p>
<p>Exporter: {{exporter}}</p>
<p>Consignee: {{consignee}}</p>
<p>Product: {{product}} (HS: {{hsCode}})</p>
<p>Quantity: {{quantity}} • Invoice: {{invoiceNo}}</p>
<p>Country of Origin: {{countryOrigin}}</p>
<p>Declaration: I hereby certify that the goods described above originate in {{countryOrigin}}.</p>
<p>Declared By: {{declarationBy}}</p>`
  },

  {
    id: "draft_shipping_bill",
    title: "DRAFT SHIPPING BILL",
    description: "Draft shipping bill used for export customs filing (draft).",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "exporter", label: "Exporter", type: "text" },
      { name: "beneficiary", label: "Beneficiary", type: "text" },
      { name: "invoiceNo", label: "Invoice No.", type: "text" },
      { name: "shipperRef", label: "Shipper Ref", type: "text" },
      { name: "portOfLoading", label: "Port of Loading", type: "text" },
      { name: "portOfDestination", label: "Port of Destination", type: "text" },
      { name: "itemDetails", label: "Items / HS / Qty", type: "textarea" },
      { name: "grossWeight", label: "Gross Weight", type: "text" },
      { name: "freight", label: "Freight Terms", type: "text" }
    ],
    templateBody: `<h2>Draft Shipping Bill</h2>
<p>Date: {{date}}</p>
<p>Exporter: {{exporter}}</p>
<p>Beneficiary: {{beneficiary}}</p>
<p>Invoice No: {{invoiceNo}} • Shipper Ref: {{shipperRef}}</p>
<p>Port of Loading: {{portOfLoading}} • Destination: {{portOfDestination}}</p>
<p>Items / HS / Qty: <pre style="white-space:pre-wrap;">{{itemDetails}}</pre></p>
<p>Gross Weight: {{grossWeight}}</p>
<p>Freight: {{freight}}</p>`
  },

  {
    id: "original_shipping_bill",
    title: "ORIGINAL SHIPPING BILL",
    description: "Finalized shipping bill for customs export (original).",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "exporter", label: "Exporter", type: "text" },
      { name: "consignee", label: "Consignee", type: "text" },
      { name: "shippingBillNo", label: "Shipping Bill No.", type: "text" },
      { name: "invoiceNo", label: "Invoice No.", type: "text" },
      { name: "hsDetails", label: "HS / Item Details", type: "textarea" },
      { name: "packages", label: "Packages", type: "text" },
      { name: "netWeight", label: "Net Weight", type: "text" },
      { name: "declaration", label: "Declaration / Remarks", type: "textarea" }
    ],
    templateBody: `<h2>Original Shipping Bill</h2>
<p>Date: {{date}}</p>
<p>Shipping Bill No: {{shippingBillNo}}</p>
<p>Exporter: {{exporter}}</p>
<p>Consignee: {{consignee}}</p>
<p>Invoice: {{invoiceNo}}</p>
<p>HS & Item Details: <pre style="white-space:pre-wrap;">{{hsDetails}}</pre></p>
<p>Packages: {{packages}} • Net Weight: {{netWeight}}</p>
<p>Declaration / Remarks: <pre style="white-space:pre-wrap;">{{declaration}}</pre></p>`
  },

  {
    id: "original_bill_of_lading",
    title: "ORIGINAL BILL OF LADING",
    description: "Final original bill of lading issued by carrier/agent.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "shipper", label: "Shipper", type: "text" },
      { name: "consignee", label: "Consignee", type: "text" },
      { name: "notifyParty", label: "Notify Party", type: "text" },
      { name: "blNumber", label: "B/L Number", type: "text" },
      { name: "vessel", label: "Vessel", type: "text" },
      { name: "voyage", label: "Voyage", type: "text" },
      { name: "containerNos", label: "Container Nos", type: "text" },
      { name: "descriptionGoods", label: "Description of Goods", type: "textarea" },
      { name: "grossWeight", label: "Gross Weight", type: "text" },
      { name: "placeOfIssue", label: "Place of Issue", type: "text" },
      { name: "carrierSign", label: "Carrier / Agent Signatory", type: "text" }
    ],
    templateBody: `<h2>Original Bill of Lading</h2>
<p>Date: {{date}}</p>
<p>B/L Number: {{blNumber}}</p>
<p>Shipper: {{shipper}}</p>
<p>Consignee: {{consignee}}</p>
<p>Notify Party: {{notifyParty}}</p>
<p>Vessel / Voyage: {{vessel}} / {{voyage}}</p>
<p>Container Nos: {{containerNos}}</p>
<p>Description of Goods: <pre style="white-space:pre-wrap;">{{descriptionGoods}}</pre></p>
<p>Gross Weight: {{grossWeight}}</p>
<p>Place of Issue: {{placeOfIssue}}</p>
<p>Carrier / Agent: {{carrierSign}}</p>`
  },

  {
    id: "original_certificate_of_origin",
    title: "ORIGINAL CERTIFICATE OF ORIGIN",
    description: "Final certificate of origin for customs and trade preference.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "exporter", label: "Exporter", type: "text" },
      { name: "consignee", label: "Consignee", type: "text" },
      { name: "product", label: "Product", type: "text" },
      { name: "hsCode", label: "HS Code", type: "text" },
      { name: "quantity", label: "Quantity", type: "text" },
      { name: "countryOrigin", label: "Country of Origin", type: "text" },
      { name: "certificateNo", label: "Certificate No.", type: "text" },
      { name: "authorizedSign", label: "Authorized Signatory", type: "text" }
    ],
    templateBody: `<h2>Original Certificate of Origin</h2>
<p>Date: {{date}}</p>
<p>Certificate No: {{certificateNo}}</p>
<p>Exporter: {{exporter}}</p>
<p>Consignee: {{consignee}}</p>
<p>Product: {{product}} (HS: {{hsCode}})</p>
<p>Quantity: {{quantity}}</p>
<p>Country of Origin: {{countryOrigin}}</p>
<p>Authorized Signatory: {{authorizedSign}}</p>
<p>Declaration: This certificate attests to the origin of the goods for customs purposes.</p>`
  }
];

function safeEscape(v) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderTemplate(body, values = {}) {
  if (!body) return '';
  return body.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
    const k = key.trim();
    return safeEscape(values[k] ?? '');
  });
}

function stripHtml(html = '') {
  try {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  } catch {
    return String(html).replace(/<[^>]*>/g, '');
  }
}

export default function DocumentationPage() {
  const navigate = useNavigate();
  const { user, token: ctxToken } = useContext(AuthContext);
  const [templates, setTemplates] = useState(LOCAL_TEMPLATES);
  const [selectedId, setSelectedId] = useState(LOCAL_TEMPLATES[0].id);
  const selected = useMemo(
    () => templates.find(t => t.id === selectedId) || templates[0],
    [templates, selectedId]
  );

  const [values, setValues] = useState({});
  const [preview, setPreview] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);
  const [attachHtml, setAttachHtml] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const token = user?.token || ctxToken || localStorage.getItem('token');
        const { status, body } = await apiGet('/api/templates', token);
        if (!mounted) return;
        if (status >= 200 && status < 300 && Array.isArray(body) && body.length > 0) {
          setTemplates(body);
          setSelectedId(body[0].id);
        } else {
          // keep fallback templates
        }
      } catch (e) {
        // fallback used
      }
    }
    load();
    return () => (mounted = false);
  }, [user, ctxToken]);

  useEffect(() => {
    if (!selected) return;
    const initial = {};
    (selected.fields || []).forEach(f => {
      initial[f.name] = f.type === 'date' ? new Date().toISOString().slice(0, 10) : '';
    });
    setValues(initial);
    setPreview(renderTemplate(selected.templateBody || '', initial));
    setMsg(null);
  }, [selected]);

  function changeField(name, val) {
    const next = { ...values, [name]: val };
    setValues(next);
    try {
      setPreview(renderTemplate(selected.templateBody, next));
    } catch {
      setPreview('');
    }
  }

  function downloadSpec() {
    const spec = [
      `Template: ${selected.title}`,
      selected.description || '',
      '',
      'Fields:',
      ...(selected.fields || []).map(f => `- ${f.name} (${f.type})`),
    ].join('\n');
    const blob = new Blob([spec], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected.id}_spec.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function send({ to, subject }) {
    if (!to || !to.includes('@')) {
      setMsg({ type: 'error', text: 'Enter valid recipient email.' });
      setTimeout(() => setMsg(null), 3000);
      return;
    }
    setSending(true);
    setMsg(null);
    try {
      const token = user?.token || ctxToken || localStorage.getItem('token');
      if (attachHtml) {
        const html = renderTemplate(selected.templateBody || '', values);
        const fd = new FormData();
        fd.append('to', to);
        fd.append('subject', subject || selected.title || 'Document');
        fd.append('templateId', selected.id);
        fd.append('values', JSON.stringify(values));
        fd.append('file', new Blob([html], { type: 'text/html' }), `${selected.id}.html`);

        const opts = { method: 'POST', body: fd, headers: {} };
        if (token) opts.headers.Authorization = `Bearer ${token}`;

        const res = await fetch('/api/templates/send', opts);
        const json = await res.json().catch(() => null);
        if (res.ok) {
          setMsg({ type: 'success', text: json?.message || 'Email sent (server).' });
        } else {
          const bodyText = stripHtml(html);
          window.open(
            `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
              subject || selected.title
            )}&body=${encodeURIComponent(bodyText)}`,
            '_blank'
          );
          setMsg({ type: 'warning', text: 'Server failed — mail client opened.' });
        }
      } else {
        const payload = { to, subject: subject || selected.title, templateId: selected.id, values };
        const { status, body } = await apiPost('/api/templates/send', payload, token);
        if (status >= 200 && status < 300 && body?.ok !== false) {
          setMsg({ type: 'success', text: body?.message || 'Email queued / sent.' });
        } else {
          const html = renderTemplate(selected.templateBody || '', values);
          const bodyText = stripHtml(html);
          window.open(
            `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
              subject || selected.title
            )}&body=${encodeURIComponent(bodyText)}`,
            '_blank'
          );
          setMsg({ type: 'warning', text: 'Server failed — mail client opened.' });
        }
      }
    } catch (err) {
      try {
        const html = renderTemplate(selected.templateBody || '', values);
        const bodyText = stripHtml(html);
        window.open(
          `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
            subject || selected.title
          )}&body=${encodeURIComponent(bodyText)}`,
          '_blank'
        );
        setMsg({ type: 'warning', text: 'Network error — mail client opened.' });
      } catch {
        setMsg({ type: 'error', text: 'Unable to send email.' });
      }
    } finally {
      setSending(false);
      setTimeout(() => setMsg(null), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 shadow">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800"> Clearance Agent Documentation</h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Create, preview and share documentation templates.
            </p> */}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadSpec}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="col-span-1 space-y-4">
            <div className="p-4 border rounded bg-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-slate-500">Account</div>
                  <div className="font-medium">{user?.name || user?.email || '—'}</div>
                </div>
                <div className="text-xs text-slate-400">{user?.role || '—'}</div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Templates</p>
                <ul className="space-y-2 max-h-64 overflow-auto">
                  {templates.map(t => (
                    <li key={t.id}>
                      <button
                        onClick={() => setSelectedId(t.id)}
                        className={`w-full text-left p-3 rounded ${
                          t.id === selectedId
                            ? 'bg-indigo-50 border border-indigo-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{t.title}</div>
                            <div className="text-xs text-slate-500">{t.description}</div>
                          </div>
                          <div className="text-xs text-slate-400">{(t.fields || []).length}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-2 space-y-4">
            <div className="p-4 border rounded bg-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-slate-500">Fill</div>
                  <div className="font-semibold">{selected?.title}</div>
                </div>
                <div className="text-xs text-slate-400">{selected?.description}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(selected?.fields || []).map(f => (
                  <div key={f.name}>
                    <label className="text-xs text-slate-600 mb-1 block">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea
                        value={values[f.name] || ''}
                        onChange={e => changeField(f.name, e.target.value)}
                        rows={4}
                        className="w-full border rounded p-2 text-sm"
                      />
                    ) : (
                      <input
                        value={values[f.name] || ''}
                        onChange={e => changeField(f.name, e.target.value)}
                        type={f.type === 'date' ? 'date' : 'text'}
                        className="w-full border rounded p-2 text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => {
                    const reset = {};
                    (selected.fields || []).forEach(
                      f =>
                        (reset[f.name] =
                          f.type === 'date' ? new Date().toISOString().slice(0, 10) : '')
                    );
                    setValues(reset);
                    setPreview(renderTemplate(selected.templateBody, reset));
                  }}
                  className="px-3 py-2 bg-gray-200 rounded text-sm"
                >
                  Reset
                </button>

                <button
                  onClick={() => {
                    const content = preview;
                    const blob = new Blob([content], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selected.id || 'doc'}_${Date.now()}.html`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
                >
                  Download HTML
                </button>

                <button
                  onClick={() => {
                    const content = stripHtml(preview);
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selected.id || 'doc'}_${Date.now()}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-2 bg-gray-200 rounded text-sm"
                >
                  Download TXT
                </button>

                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(stripHtml(preview));
                      setMsg({ type: 'success', text: 'Copied to clipboard' });
                    } catch {
                      setMsg({ type: 'error', text: 'Copy failed' });
                    }
                    setTimeout(() => setMsg(null), 2000);
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded text-sm"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>

            <div className="p-4 border rounded bg-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold">Share / Email</div>
                  <div className="text-xs text-slate-500">
                    Send the selected document to recipients
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  Attach HTML:{' '}
                  <input
                    type="checkbox"
                    checked={attachHtml}
                    onChange={e => setAttachHtml(e.target.checked)}
                    className="ml-2"
                  />
                </div>
              </div>

              <EmailBlock onSend={send} disabled={sending} defaultTo={user?.email || ''} />
            </div>
          </main>

          <aside className="col-span-1">
            <div className="p-4 border rounded bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Preview</div>
                <div className="text-xs text-slate-400">Live</div>
              </div>
              <div
                className="border p-3 rounded bg-white max-h-[60vh] overflow-auto"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
              {msg && (
                <div
                  className={`mt-3 p-2 rounded text-sm ${
                    msg.type === 'success'
                      ? 'bg-green-50 text-green-700'
                      : msg.type === 'error'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function EmailBlock({ onSend, disabled = false, defaultTo = '' }) {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState('');
  useEffect(() => setTo(defaultTo), [defaultTo]);

  return (
    <div className="grid grid-cols-1 gap-2">
      <input
        value={to}
        onChange={e => setTo(e.target.value)}
        placeholder="to@example.com"
        className="w-full border rounded p-2 text-sm"
      />
      <input
        value={subject}
        onChange={e => setSubject(e.target.value)}
        placeholder="Email subject"
        className="w-full border rounded p-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSend({ to, subject })}
          disabled={disabled}
          className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
        >
          {disabled ? 'Sending...' : 'Send Email'}
        </button>
        <button
          onClick={() => {
            setTo(defaultTo);
            setSubject('');
          }}
          className="px-3 py-2 bg-gray-200 rounded text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
