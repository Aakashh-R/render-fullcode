// src/components/DocumentationDashboard.jsx
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, DEFAULT_SENDGRID_FROM } from '../../../context/AuthContext';
import { apiGet } from '../../../api.js';

/* ---------- local fallback templates ---------- */
const TEMPLATES = [
  {
    id: "quotation",
    title: "QUOTATION",
    description: "Standard quotation for goods/services.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "to", label: "Recipient Name", type: "text" },
      { name: "company", label: "Recipient Company", type: "text" },
      { name: "items", label: "Items (comma separated)", type: "textarea" },
      { name: "total", label: "Total Amount", type: "text" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
    templateBody: `<h2>Quotation</h2>
       <p>Date: {{date}}</p>
       <p>To: <strong>{{to}}</strong> — {{company}}</p>
       <p>Items: {{items}}</p>
       <p>Total: {{total}}</p>
       <p>Notes: {{notes}}</p>`,
  },
  {
    id: "confirmation",
    title: "CONFIRMATION LETTER",
    description: "Confirmation of booking / order / shipment.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "ref", label: "Reference No.", type: "text" },
      { name: "party", label: "Party Name", type: "text" },
      { name: "details", label: "Confirmation Details", type: "textarea" },
      { name: "signoff", label: "Sign-off (Name & Title)", type: "text" },
    ],
    templateBody: `<h2>Confirmation Letter</h2>
       <p>Date: {{date}}</p>
       <p>Ref: {{ref}}</p>
       <p>To: {{party}}</p>
       <p>{{details}}</p>
       <p>Sincerely, <br/>{{signoff}}</p>`,
  },
  {
    id: "triparty",
    title: "TRI PARTY AGREEMENT",
    description: "Agreement document between three parties.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "partyA", label: "Party A", type: "text" },
      { name: "partyB", label: "Party B", type: "text" },
      { name: "partyC", label: "Party C", type: "text" },
      { name: "subject", label: "Subject / Scope", type: "textarea" },
      { name: "term", label: "Term / Duration", type: "text" },
    ],
    templateBody: `<h2>Tri-Party Agreement</h2>
       <p>Date: {{date}}</p>
       <p>Between: {{partyA}}, {{partyB}} and {{partyC}}</p>
       <p>Subject: {{subject}}</p>
       <p>Term: {{term}}</p>`,
  },
  {
    id: "label",
    title: "LABEL FOR PRODUCT",
    description: "Product label template for printing and trade compliance.",
    fields: [
      { name: "productName", label: "Product Name", type: "text" },
      { name: "sku", label: "SKU / HS Code", type: "text" },
      { name: "weight", label: "Weight / Volume", type: "text" },
      { name: "origin", label: "Country of Origin", type: "text" },
      { name: "batch", label: "Batch / Lot No.", type: "text" },
    ],
    templateBody: `<div style="border:1px solid #222; padding:12px; width:320px;">
         <h3>{{productName}}</h3>
         <p>SKU/HS: {{sku}}</p>
         <p>Weight: {{weight}}</p>
         <p>Origin: {{origin}}</p>
         <p>Batch: {{batch}}</p>
       </div>`,
  },
  {
    id: "invoice",
    title: "INVOICE",
    description: "Commercial invoice for customs / billing.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "invoiceNo", label: "Invoice No.", type: "text" },
      { name: "billTo", label: "Bill To", type: "text" },
      { name: "items", label: "Items (json or newline)", type: "textarea" },
      { name: "subtotal", label: "Subtotal", type: "text" },
      { name: "tax", label: "Tax", type: "text" },
      { name: "total", label: "Total", type: "text" },
    ],
    templateBody: `<h2>Invoice</h2>
       <p>Date: {{date}}</p>
       <p>Invoice No: {{invoiceNo}}</p>
       <p>Bill To: {{billTo}}</p>
       <pre style="white-space:pre-wrap;">{{items}}</pre>
       <p>Subtotal: {{subtotal}}</p>
       <p>Tax: {{tax}}</p>
       <p><strong>Total: {{total}}</strong></p>`,
  },
  {
    id: "packing",
    title: "PACKING LIST",
    description: "Packing list for shipment and customs.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "shipmentRef", label: "Shipment Ref.", type: "text" },
      {
        name: "packages",
        label: "Packages (count / details)",
        type: "textarea",
      },
      { name: "grossWeight", label: "Gross Weight", type: "text" },
      { name: "dimensions", label: "Dimensions", type: "text" },
    ],
    templateBody: `<h2>Packing List</h2>
       <p>Date: {{date}}</p>
       <p>Shipment Ref: {{shipmentRef}}</p>
       <pre style="white-space:pre-wrap;">{{packages}}</pre>
       <p>Gross Weight: {{grossWeight}}</p>
       <p>Dimensions: {{dimensions}}</p>`,
  },
];


// helper utilities (unchanged)
function safeEscapeValue(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderTemplate(body, values) {
  if (!body) return '';
  return body.replace(/{{\s*([^}]+)\s*}}/g, (m, key) => {
    const v = values?.[key] ?? '';
    return safeEscapeValue(v);
  });
}

const DocumentationDashboard = () => {
  const { user, sendTemplate, hasPermission } = useContext(AuthContext);
  const [templates, setTemplates] = useState(TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates?.[0]?.id || '');
  const selectedTemplate = useMemo(
    () => templates.find(t => t.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );
  const [formValues, setFormValues] = useState({});
  const [previewHtml, setPreviewHtml] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadTemplates() {
      try {
        const token = user?.token || localStorage.getItem('token');
        const { status, body } = await apiGet('/api/templates', token);
        if (!mounted) return;
        if (status >= 200 && status < 300 && Array.isArray(body) && body.length > 0) {
          setTemplates(body);
          setSelectedTemplateId(body[0]?.id || '');
        } else {
          console.warn('Using local fallback templates', status, body);
          if (!templates || templates.length === 0) {
            setTemplates(TEMPLATES);
            setSelectedTemplateId(TEMPLATES[0]?.id || '');
          }
        }
      } catch (err) {
        console.error('Failed to fetch templates, using fallback', err);
        if (!templates || templates.length === 0) {
          setTemplates(TEMPLATES);
          setSelectedTemplateId(TEMPLATES[0]?.id || '');
        }
      }
    }
    loadTemplates();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!selectedTemplate) return;
    const defaults = {};
    selectedTemplate.fields.forEach(f => {
      defaults[f.name] = f.type === 'date' ? new Date().toISOString().slice(0, 10) : '';
    });
    setFormValues(defaults);
    setPreviewHtml(renderTemplate(selectedTemplate.templateBody, defaults));
    setMessage(null);
  }, [selectedTemplate]);

  function handleChange(name, value) {
    const next = { ...formValues, [name]: value };
    setFormValues(next);
    try {
      setPreviewHtml(renderTemplate(selectedTemplate.templateBody, next));
    } catch (err) {
      console.error('renderTemplate failed', err);
    }
  }

  function stripHtml(html) {
    if (!html) return '';
    try {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    } catch (err) {
      console.error('stripHtml failed', err);
      return html.replace(/<[^>]*>/g, '');
    }
  }

  const copyToClipboard = async () => {
    try {
      const text = stripHtml(previewHtml);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('execCommand copy failed');
      }
      setMessage({ type: 'success', text: 'Copied to clipboard' });
    } catch (err) {
      console.error('Copy failed', err);
      setMessage({
        type: 'error',
        text: 'Copy failed. Check browser permissions.',
      });
    }
    setTimeout(() => setMessage(null), 2500);
  };

  const downloadFile = (type = 'html') => {
    try {
      const content = type === 'html' ? previewHtml : stripHtml(previewHtml);
      const blob = new Blob([content], {
        type: type === 'html' ? 'text/html' : 'text/plain',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate?.id || 'document'}_${Date.now()}.${
        type === 'html' ? 'html' : 'txt'
      }`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      setMessage({ type: 'error', text: 'Download failed' });
      setTimeout(() => setMessage(null), 2500);
    }
  };

  // sendByEmail (keeps your mailto fallback and server response handling)
  const sendByEmail = async ({ to, subject }) => {
    setSending(true);
    try {
      if (!to || !String(to).includes('@')) {
        setMessage({ type: 'error', text: 'Please enter a valid recipient email.' });
        setSending(false);
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      const html = renderTemplate(selectedTemplate?.templateBody || '', formValues);
      const finalSubject =
        subject && subject.trim() ? subject : selectedTemplate?.title || 'Document';

      const res = await sendTemplate({
        to,
        subject: finalSubject,
        templateId: selectedTemplate?.id,
        templateHtml: html,
        values: formValues,
      });

      console.log('sendTemplate response:', res);

      if (res.ok) {
        setMessage({ type: 'success', text: 'Email queued / sent (server).' });
      } else if (res.status === 403) {
        // server denied -> open mailto fallback so user can send manually
        const bodyText = stripHtml(html);
        const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
          finalSubject
        )}&body=${encodeURIComponent(bodyText)}`;
        window.open(mailto, '_blank');
        setMessage({
          type: 'warning',
          text: 'Permission denied on server — opened mail client (fallback).',
        });
      } else {
        setMessage({
          type: 'error',
          text: res.error || 'Server rejected email. Not sent from client.',
        });
      }
    } catch (err) {
      console.error('sendByEmail unexpected error', err);
      try {
        const html = renderTemplate(selectedTemplate?.templateBody || '', formValues);
        const bodyText = stripHtml(html);
        const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
          subject || selectedTemplate?.title || ''
        )}&body=${encodeURIComponent(bodyText)}`;
        window.open(mailto, '_blank');
        setMessage({ type: 'warning', text: 'Network error — opened mail client as fallback.' });
      } catch (err2) {
        console.error('mailto fallback failed', err2);
        setMessage({ type: 'error', text: 'Unable to send email (network/server).' });
      }
    } finally {
      setSending(false);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  // renderFieldInput must be inside the component so it can access formValues & handleChange
  function renderFieldInput(field) {
    const val = formValues[field.name] ?? '';
    if (field.type === 'textarea') {
      return (
        <textarea
          value={val}
          onChange={e => handleChange(field.name, e.target.value)}
          className="w-full border rounded p-2 text-sm"
          rows={4}
        />
      );
    }
    return (
      <input
        type={field.type === 'date' ? 'date' : 'text'}
        value={val}
        onChange={e => handleChange(field.name, e.target.value)}
        className="w-full border rounded p-2 text-sm"
      />
    );
  }

  // UI: empty templates guard
  if (!templates || templates.length === 0) {
    return (
      <div className="min-h-screen p-8 bg-indigo-50">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow">
          <p>No templates found.</p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen p-8 bg-indigo-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Shipper — Documentation Dashboard</h1>
          <div>
           
            <Link to="/" className="text-sm text-gray-600">
              Home
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded">
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-lg">{user?.name}</p>
          </div>
          <div className="p-4 border rounded">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-lg">{user?.email}</p>
          </div>
          <div className="p-4 border rounded">
            <p className="text-sm text-gray-500">Company</p>
            <p className="font-medium text-lg">{user?.companyName}</p>
          </div>
          <div className="p-4 border rounded">
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium text-lg">{user?.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-1 space-y-4">
            <div className="p-4 border rounded bg-white">
              <p className="font-semibold mb-2">Templates</p>
              <ul className="space-y-2 max-h-64 overflow-auto">
                {templates.map(t => (
                  <li key={t.id}>
                    <button
                      onClick={() => setSelectedTemplateId(t.id)}
                      className={`w-full text-left p-3 rounded ${
                        t.id === selectedTemplateId
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{t.title}</div>
                          <div className="text-xs text-gray-500">{t.description}</div>
                        </div>
                        <div className="text-xs text-gray-400">{t.fields.length} fields</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {hasPermission('manage_templates') && (
              <div className="p-4 border rounded bg-white">
                <p className="font-semibold mb-2">Template Management</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => alert('Create template - placeholder')}
                    className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => alert('Edit template - placeholder')}
                    className="px-3 py-2 bg-gray-200 rounded text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 border rounded bg-white">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold">Fill: {selectedTemplate?.title}</p>
                <div className="text-sm text-gray-500">{selectedTemplate?.description}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedTemplate?.fields.map(f => (
                  <div key={f.name}>
                    <label className="text-xs text-gray-600 mb-1 block">{f.label}</label>
                    {renderFieldInput(f)}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2 items-center">
                <button
                  onClick={() => {
                    const reset = {};
                    selectedTemplate.fields.forEach(
                      f =>
                        (reset[f.name] =
                          f.type === 'date' ? new Date().toISOString().slice(0, 10) : '')
                    );
                    setFormValues(reset);
                    setPreviewHtml(renderTemplate(selectedTemplate.templateBody, reset));
                  }}
                  className="px-3 py-2 bg-gray-200 rounded text-sm"
                >
                  Reset
                </button>

                <button
                  onClick={() => downloadFile('html')}
                  className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
                >
                  Download HTML
                </button>
                <button
                  onClick={() => downloadFile('txt')}
                  className="px-3 py-2 bg-gray-200 rounded text-sm"
                >
                  Download TXT
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-green-600 text-white rounded text-sm"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>

            <div className="p-4 border rounded bg-white">
              <p className="font-semibold mb-2">Share / Email</p>
              <EmailForm
                defaultTo={user?.email || ''}
                onSend={({ to, subject }) => sendByEmail({ to, subject })}
                disabled={sending}
              />
            
            </div>
          </div>

          <div className="col-span-1">
            <div className="p-4 border rounded bg-white">
              <p className="font-semibold mb-2">Preview</p>
              <div className="border p-3 rounded bg-white max-h-[60vh] overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>

              {message && (
                <div
                  className={`mt-3 p-2 rounded text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700'
                      : message.type === 'error'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; // <-- close DocumentationDashboard component

// EmailForm is a child component declared outside the main component
function EmailForm({ defaultTo = '', onSend, disabled = false }) {
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
        placeholder="Subject (optional)"
        className="w-full border rounded p-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSend({ to, subject })}
          disabled={disabled}
          className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
        >
          {disabled ? 'Sending…' : 'Send Email'}
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

export default DocumentationDashboard;
