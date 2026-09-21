import React from 'react';
import { Search } from 'lucide-react';

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  style = {},
  className = '',
}) => {
  return (
    <div className={`search-wrapper ${className}`} style={style}>
      <Search className="search-icon" size={16} />
      <input
        type="text"
        className="form-input search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: 8,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 12,
            padding: '4px',
          }}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};
