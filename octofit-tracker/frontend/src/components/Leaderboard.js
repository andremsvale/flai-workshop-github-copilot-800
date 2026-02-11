import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Fetching leaderboard from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard data received:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'rank-badge rank-1';
    if (rank === 2) return 'rank-badge rank-2';
    if (rank === 3) return 'rank-badge rank-3';
    return 'rank-badge bg-light text-dark';
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="content-wrapper text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading leaderboard...</p>
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
            <p>Failed to load leaderboard: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="content-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-header mb-0">Leaderboard</h1>
          <button className="btn btn-success">
            <i className="bi bi-trophy me-2"></i>
            View My Rank
          </button>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col" className="text-center" style={{width: '100px'}}>Rank</th>
                <th scope="col">User</th>
                <th scope="col">Team</th>
                <th scope="col" className="text-center">Total Calories</th>
                <th scope="col" className="text-center">Activities</th>
                <th scope="col" className="text-center">Distance (km)</th>
                <th scope="col" className="text-center">Duration (min)</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="text-muted">
                      <p className="mb-2">No leaderboard data found</p>
                      <small>Complete activities to join the leaderboard!</small>
                    </div>
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry) => {
                  return (
                    <tr key={entry.id}>
                      <td className="text-center">
                        <span className={getRankBadgeClass(entry.rank)}>
                          {entry.rank}
                        </span>
                      </td>
                      <td>
                        <div>
                          <strong>{entry.user_name}</strong>
                          {entry.rank <= 3 && <i className="bi bi-star-fill text-warning ms-2"></i>}
                          <br />
                          <small className="text-muted">{entry.user_email}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary">{entry.team || 'N/A'}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-success fs-6">{entry.total_calories?.toLocaleString() || 0}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-info">{entry.total_activities || 0}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-warning">{entry.total_distance_km?.toFixed(2) || 0}</span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary">{entry.total_duration_minutes?.toLocaleString() || 0}</span>
                      </td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary" title="View Profile">
                          <i className="bi bi-person"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {leaderboard.length > 0 && (
          <div className="mt-3 text-muted">
            <small>Total Players: {leaderboard.length}</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
