import { useState, useMemo } from 'react';
import { USERS } from './adminData';

const PAGE_SIZE = 3;

function RoleBarChart({ users }) {
  const counts = useMemo(() => {
    return users.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] ?? 0) + 1;
      return acc;
    }, {});
  }, [users]);

  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <div data-testid="role-chart">
      <h3>Users by Role</h3>
      {Object.entries(counts).map(([role, count]) => (
        <div key={role} data-testid={`bar-${role}`}>
          <span>{role} ({count})</span>
          <div style={{ background: '#ccc', width: '200px' }}>
            <div
              style={{ background: '#3366cc', width: `${(count / maxCount) * 100}%`, height: '12px' }}
              role="img"
              aria-label={`${role}: ${count} users`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(1);

  function handleSort(key) {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setPage(1); // reset pagination on any sort change (Project 9's exact lesson, applied again)
  }

  const filteredAndSorted = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let result = USERS.filter((u) => u.name.toLowerCase().includes(query));

    result = [...result].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const comparison = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageItems = filteredAndSorted.slice(pageStart, pageStart + PAGE_SIZE);

  function handleSearchChange(value) {
    setSearchQuery(value);
    setPage(1); // reset pagination when the filter itself changes
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <RoleBarChart users={USERS} />

      <label htmlFor="user-search">Search users</label>
      <input id="user-search" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} />

      <table>
        <thead>
          <tr>
            {['name', 'role', 'status', 'signupDate'].map((key) => (
              <th key={key}>
                <button onClick={() => handleSort(key)}>
                  {key} {sortKey === key ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageItems.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>{user.signupDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {pageItems.length === 0 && <p>No users match your search.</p>}

      <div>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
        <span data-testid="page-indicator"> Page {page} of {totalPages} </span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
