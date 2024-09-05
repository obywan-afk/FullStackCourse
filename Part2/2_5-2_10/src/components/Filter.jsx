import React from 'react';

// This should be a React component, not just a function.
const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  );
}

export default Filter;
