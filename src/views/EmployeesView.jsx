import React from 'react';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { useApp } from '../context/AppContext';

export const EmployeesView = ({ onOpenEmployee, onOpenAddEmployee }) => {
  const { employees } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <EmployeeTable
        employees={employees}
        onOpenEmployee={onOpenEmployee}
        onOpenAddModal={onOpenAddEmployee}
      />
    </div>
  );
};
