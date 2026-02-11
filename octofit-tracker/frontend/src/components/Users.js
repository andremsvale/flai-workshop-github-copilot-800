import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    console.log('Fetching users from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users data received:', data);
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="content-wrapper text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="content-wrapper">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>Failed to load users: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="content-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-header mb-0">Users</h1>
          <button className="btn btn-primary">
            <i className="bi bi-person-plus me-2"></i>
            Add User
          </button>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Team</th>
                <th scope="col">Role</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="text-muted">
                      <p className="mb-2">No users found</p>
                      <small>Add your first user to get started!</small>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td><span className="badge bg-secondary">{user.id}</span></td>
                    <td>
                      <strong>{user.name}</strong>
                    </td>
                    <td>
                      <a href={`mailto:${user.email}`} className="text-decoration-none">
                        {user.email}
                      </a>
                    </td>
                    <td>
                      <span className="badge bg-info">{user.team || <span className="text-muted">-</span>}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary">{user.role || <span className="text-muted">-</span>}</span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-1" title="View Profile">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-info" title="Edit">
                        <i className="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {users.length > 0 && (
          <div className="mt-3 text-muted">
            <small>Total Users: {users.length}</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
