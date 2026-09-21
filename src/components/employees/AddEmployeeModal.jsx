import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const AddEmployeeModal = ({
  isOpen,
  onClose,
  onAddEmployee,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    role: '',
    monthlyAllowance: '25000',
  });

  const [errors, setErrors] = useState({});

  const departments = [
    'Engineering',
    'Product',
    'Sales',
    'Marketing',
    'Finance',
    'HR & People',
    'Operations',
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Corporate email is required';
    } else if (!formData.email.includes('@')) {
      errs.email = 'Valid corporate email is required';
    }
    if (!formData.role.trim()) errs.role = 'Role / designation is required';
    if (!formData.monthlyAllowance || Number(formData.monthlyAllowance) <= 0) {
      errs.monthlyAllowance = 'Valid monthly allowance is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddEmployee(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'Engineering',
      role: '',
      monthlyAllowance: '25000',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Employee"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={UserPlus} onClick={handleSubmit}>
            Enroll Employee
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="form-group">
          <label className="form-label">
            Full Name <span style={{ color: 'var(--status-rejected-text)' }}>*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Aniket Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Corporate Email <span style={{ color: 'var(--status-rejected-text)' }}>*</span>
          </label>
          <input
            type="email"
            className="form-input"
            placeholder="e.g. aniket.s@techcorp.in"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Role / Designation <span style={{ color: 'var(--status-rejected-text)' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Software Engineer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            {errors.role && <span className="form-error">{errors.role}</span>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              placeholder="e.g. +91 98200 12345"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Monthly Reimbursement Allowance (₹)
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="25000"
              value={formData.monthlyAllowance}
              onChange={(e) => setFormData({ ...formData, monthlyAllowance: e.target.value })}
            />
            {errors.monthlyAllowance && (
              <span className="form-error">{errors.monthlyAllowance}</span>
            )}
          </div>
        </div>

        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-subtle)',
            fontSize: 11.5,
            color: 'var(--text-secondary)',
          }}
        >
          ℹ️ The employee will be able to join via the Flutter mobile app using company code{' '}
          <strong>TECHCORP-IND-2026</strong> and their corporate email.
        </div>
      </form>
    </Modal>
  );
};
