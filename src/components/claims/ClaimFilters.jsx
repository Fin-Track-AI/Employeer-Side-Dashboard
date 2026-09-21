import React from 'react';
import { Filter, RotateCcw, Download, FileText } from 'lucide-react';
import { SearchInput } from '../common/SearchInput';

export const ClaimFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  departments = [],
  categories = [],
  onReset,
  onExportCSV,
  onExportPDF,
  counts = {},
}) => {
  const statusTabs = [
    { id: 'ALL', label: 'All Claims', count: counts.all || 0 },
    { id: 'Pending', label: 'Pending', count: counts.pending || 0 },
    { id: 'Approved', label: 'Approved', count: counts.approved || 0 },
    { id: 'Paid', label: 'Paid', count: counts.paid || 0 },
    { id: 'Rejected', label: 'Rejected', count: counts.rejected || 0 },
  ];

  const hasActiveFilters =
    search ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    departmentFilter !== 'ALL';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
      {/* Top Status Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusFilterChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: isActive ? 'var(--color-primary)' : 'var(--border-color)',
                background: isActive ? 'var(--color-primary-50)' : 'var(--bg-surface)',
                color: isActive ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 600,
                fontSize: 13,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.12s ease',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 11,
                  background: isActive ? 'var(--color-primary-100)' : 'var(--bg-surface-subtle)',
                  color: isActive ? 'var(--color-primary-600)' : 'var(--text-muted)',
                  fontWeight: 700,
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          background: 'var(--bg-surface)',
          padding: 12,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ flex: '1 1 240px' }}>
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search by employee, claim ID, or keyword..."
          />
        </div>

        {/* Category Dropdown */}
        <div style={{ minWidth: 160 }}>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Department Dropdown */}
        <div style={{ minWidth: 160 }}>
          <select
            className="form-select"
            value={departmentFilter}
            onChange={(e) => onDepartmentFilterChange(e.target.value)}
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 10px',
            }}
          >
            <RotateCcw size={14} />
            Reset filters
          </button>
        )}

        {/* BR-15 Payroll Export Buttons */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={onExportCSV}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}
            title="Export Approved Claims to CSV (BR-15)"
          >
            <Download size={14} />
            Export CSV
          </button>
          <button
            type="button"
            onClick={onExportPDF}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}
            title="Export Approved Claims Payroll PDF Report (BR-15)"
          >
            <FileText size={14} />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};
