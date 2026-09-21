/**
 * BR-15 Export Utility for Approved Claims (CSV & PDF)
 */

export const exportApprovedClaimsCSV = (claims = [], filename = 'Approved_Claims_Export.csv') => {
  const approvedClaims = claims.filter(
    (c) => c.status === 'Approved' || c.status === 'Paid' || c.status === 'Reimbursed'
  );

  if (approvedClaims.length === 0) {
    alert('No approved claims found to export.');
    return;
  }

  const headers = [
    'Claim ID',
    'Employee Name',
    'Employee Email',
    'Department',
    'Expense Title',
    'Category',
    'Amount (INR)',
    'Expense Date',
    'Submission Date',
    'Status',
    'Project',
    'Cost Center',
    'Admin Notes',
  ];

  const rows = approvedClaims.map((claim) => [
    `"${claim.id || ''}"`,
    `"${claim.employeeName || ''}"`,
    `"${claim.employeeEmail || ''}"`,
    `"${claim.department || ''}"`,
    `"${(claim.title || '').replace(/"/g, '""')}"`,
    `"${claim.category || ''}"`,
    claim.amount || 0,
    `"${claim.expenseDate || ''}"`,
    `"${claim.submissionDate || ''}"`,
    `"${claim.status || ''}"`,
    `"${claim.project || ''}"`,
    `"${claim.costCenter || ''}"`,
    `"${(claim.adminNotes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    filename || `Approved_Claims_Export_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportApprovedClaimsPDF = (claims = [], companyName = 'FinTrack Enterprise') => {
  const approvedClaims = claims.filter(
    (c) => c.status === 'Approved' || c.status === 'Paid' || c.status === 'Reimbursed'
  );

  if (approvedClaims.length === 0) {
    alert('No approved claims found to export.');
    return;
  }

  const totalAmount = approvedClaims.reduce((sum, c) => sum + (c.amount || 0), 0);
  const printDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download/print the PDF export document.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payroll Expense Export — ${companyName}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #ea580c; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; margin-bottom: 30px; }
          .meta-item { display: flex; flex-direction: column; }
          .meta-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
          .meta-val { font-size: 18px; font-weight: 800; color: #ea580c; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          th { background: #0f172a; color: #ffffff; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; }
          td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12.5px; }
          tr:nth-child(even) { background: #f8fafc; }
          .badge { background: #ecfdf5; color: #047857; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; border: 1px solid #a7f3d0; }
          .footer-signatures { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 20px; border-top: 1px dashed #cbd5e1; }
          .sig-box { width: 45%; text-align: center; }
          .sig-line { border-bottom: 1px solid #94a3b8; height: 40px; margin-bottom: 8px; }
          .sig-label { font-size: 12px; color: #64748b; font-weight: 600; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${companyName}</h1>
            <div class="subtitle">Approved Reimbursement Payroll Export Report (BR-15 Compliant)</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; font-size: 13px;">Date Generated</div>
            <div style="font-size: 12px; color: #64748b;">${printDate}</div>
          </div>
        </div>

        <div class="meta-box">
          <div class="meta-item">
            <span class="meta-label">Total Claims Approved</span>
            <span class="meta-val">${approvedClaims.length} Claims</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Total Disbursal Amount</span>
            <span class="meta-val">₹${totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Export Type</span>
            <span class="meta-val" style="color: #0f172a; font-size: 15px;">Finance Payroll Audit</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Employee</th>
              <th>Category</th>
              <th>Expense Title</th>
              <th>Date</th>
              <th>Cost Center</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${approvedClaims
              .map(
                (c) => `
              <tr>
                <td style="font-family: monospace; font-weight: 700;">${c.id}</td>
                <td><strong>${c.employeeName}</strong><br><small style="color: #64748b">${c.department}</small></td>
                <td>${c.category}</td>
                <td>${c.title}</td>
                <td>${c.submissionDate || c.expenseDate}</td>
                <td>${c.costCenter || 'CC-CORP'}</td>
                <td style="font-weight: 800; font-family: monospace;">₹${(c.amount || 0).toLocaleString('en-IN')}</td>
                <td><span class="badge">${c.status}</span></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer-signatures">
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Prepared By (Finance Controller)</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Approved By (Payroll Manager)</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
