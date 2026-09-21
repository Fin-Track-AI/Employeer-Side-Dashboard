import React from 'react';
import { Users, Shield, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const AdminTeamSettings = () => {
  const { adminTeam, admin } = useApp();

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Users size={18} color="var(--color-primary)" />
          Admin & Finance Reviewer Team
        </div>
        <Button size="sm" variant="secondary" icon={Plus}>
          Invite Admin
        </Button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Admin User</th>
              <th>Corporate Email</th>
              <th>Assigned Role</th>
              <th>Status</th>
              <th>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {adminTeam.map((member) => {
              const isCurrent = member.id === admin.id;

              return (
                <tr key={member.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-initials" style={{ background: '#FED7AA', color: '#9A3412' }}>
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className="user-cell-meta">
                        <span className="user-cell-name">
                          {member.name} {isCurrent && '(You)'}
                        </span>
                        <span className="user-cell-sub">{member.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>{member.email}</span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Shield size={14} color="var(--color-primary)" />
                      <span style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text-primary)' }}>
                        {member.role}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-approved">
                      <span className="badge-dot" />
                      {member.status}
                    </span>
                  </td>

                  <td>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {member.lastActive}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
