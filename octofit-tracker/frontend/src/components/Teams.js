import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Fetching teams from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams data received:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
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
          <p className="mt-3 text-muted">Loading teams...</p>
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
            <p>Failed to load teams: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="content-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-header mb-0">Teams</h1>
          <button className="btn btn-primary">
            <i className="bi bi-people me-2"></i>
            Create Team
          </button>
        </div>
        
        <div className="row">
          {teams.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center" role="alert">
                <h4 className="alert-heading">No teams found</h4>
                <p className="mb-0">Create your first team to start competing!</p>
              </div>
            </div>
          ) : (
            teams.map(team => (
              <div className="col-lg-4 col-md-6 mb-4" key={team.id}>
                <div className="card h-100">
                  <div className="card-header">
                    <h5 className="mb-0">{team.name}</h5>
                  </div>
                  <div className="card-body">
                    <p className="card-text">{team.description}</p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="badge bg-primary me-2">
                          <i className="bi bi-people-fill me-1"></i>
                          {team.member_count || 0} Members
                        </span>
                      </div>
                      <small className="text-muted">
                        {new Date(team.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent">
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-eye me-1"></i> View
                      </button>
                      <button className="btn btn-sm btn-outline-success">
                        <i className="bi bi-person-plus me-1"></i> Join
                      </button>
                      <button className="btn btn-sm btn-outline-info">
                        <i className="bi bi-pencil me-1"></i> Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {teams.length > 0 && (
          <div className="mt-3 text-muted">
            <small>Total Teams: {teams.length}</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
