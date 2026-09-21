import React, { useState } from 'react';
import { ClaimFilters } from '../components/claims/ClaimFilters';
import { ClaimTable } from '../components/claims/ClaimTable';
import { ClaimCards } from '../components/claims/ClaimCards';
import { EmptyState } from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';

export const ClaimsView = ({ onOpenClaim, onRejectClaim }) => {
  const { claims, employees } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const categories = Array.from(new Set(claims.map((c) => c.category).filter(Boolean)));
  const departments = Array.from(new Set(employees.map((e) => e.department).filter(Boolean)));

  const handleReset = () => {
    setSearch('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setDepartmentFilter('ALL');
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      !search ||
      (claim.employeeName || '').toLowerCase().includes(search.toLowerCase()) ||
      (claim.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (claim.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (claim.receipt?.merchant || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || claim.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'ALL' || claim.category === categoryFilter;

    const matchesDept =
      departmentFilter === 'ALL' || claim.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesDept;
  });

  const counts = {
    all: claims.length,
    pending: claims.filter((c) => c.status === 'Pending').length,
    approved: claims.filter((c) => c.status === 'Approved').length,
    paid: claims.filter((c) => c.status === 'Paid').length,
    rejected: claims.filter((c) => c.status === 'Rejected').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filter workbench */}
      <ClaimFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        departments={departments}
        categories={categories}
        onReset={handleReset}
        counts={counts}
      />

      {/* Claims List or Empty State */}
      {filteredClaims.length === 0 ? (
        <EmptyState
          title="No claims match your filters"
          description="Try broadening your status, department, or search query to view reimbursement records."
          actionLabel="Clear Filters"
          onAction={handleReset}
        />
      ) : (
        <>
          <ClaimTable
            claims={filteredClaims}
            onOpenClaim={onOpenClaim}
            onOpenRejectModal={onRejectClaim}
          />
          <ClaimCards
            claims={filteredClaims}
            onOpenClaim={onOpenClaim}
            onOpenRejectModal={onRejectClaim}
          />
        </>
      )}
    </div>
  );
};
