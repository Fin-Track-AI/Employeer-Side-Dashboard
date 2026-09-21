import React, { useState } from 'react';
import { Eye, Plus, Building2 } from 'lucide-react';
import { SearchInput } from '../common/SearchInput';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

export const EmployeeTable = ({
  employees,
  onOpenEmployee,
  onOpenAddModal,
}) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div>
      {/* Search & Filter Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: 'var(--bg-surface)',
          padding: 14,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, flex: 1 }}>
          <div style={{ flex: '1 1 220px', maxWidth: 320 }}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search employee by name, email, or role..."
            />
          </div>

          <div style={{ minWidth: 160 }}>
            <select
              className="form-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: 140 }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <Button icon={Plus} onClick={onOpenAddModal}>
          Add Employee
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No employees found"
          description="No employees match your search filter criteria."
          actionLabel="Add New Employee"
          onAction={onOpenAddModal}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="card desktop-table-view">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Corporate Email</th>
                    <th>Department & Role</th>
                    <th>Claims Filed</th>
                    <th>Total Reimbursed</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => onOpenEmployee(emp)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="user-cell">
                          <div className="avatar-initials">{emp.avatar}</div>
                          <div className="user-cell-meta">
                            <span className="user-cell-name">{emp.name}</span>
                            <span className="user-cell-sub" style={{ fontFamily: 'var(--font-mono)' }}>
                              {emp.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          {emp.email}
                        </span>
                      </td>

                      <td>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                            {emp.role}
                          </div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                            {emp.department}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                          {emp.claimsCount} claims
                        </span>
                      </td>

                      <td>
                        <span className="amount-cell">
                          ₹{emp.totalReimbursed.toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${emp.status === 'Active' ? 'badge-approved' : 'badge-neutral'}`}
                        >
                          <span className="badge-dot" />
                          {emp.status}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            className="icon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenEmployee(emp);
                            }}
                            title="View Employee Profile"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="mobile-card-list">
            {filtered.map((emp) => (
              <div
                key={emp.id}
                className="mobile-data-card"
                onClick={() => onOpenEmployee(emp)}
                style={{ cursor: 'pointer' }}
              >
                <div className="mobile-card-header">
                  <div className="user-cell">
                    <div className="avatar-initials">{emp.avatar}</div>
                    <div className="user-cell-meta">
                      <span className="user-cell-name">{emp.name}</span>
                      <span className="user-cell-sub">{emp.role}</span>
                    </div>
                  </div>
                  <span
                    className={`badge ${emp.status === 'Active' ? 'badge-approved' : 'badge-neutral'}`}
                  >
                    <span className="badge-dot" />
                    {emp.status}
                  </span>
                </div>

                <div className="mobile-card-row">
                  <span>Department</span>
                  <strong>{emp.department}</strong>
                </div>

                <div className="mobile-card-row">
                  <span>Claims Filed</span>
                  <strong>{emp.claimsCount}</strong>
                </div>

                <div className="mobile-card-row">
                  <span>Total Reimbursed</span>
                  <strong className="amount-cell">₹{emp.totalReimbursed.toLocaleString('en-IN')}</strong>
                </div>

                <div className="mobile-card-actions">
                  <Button size="sm" variant="secondary" style={{ width: '100%' }}>
                    View Full History & Limits
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
