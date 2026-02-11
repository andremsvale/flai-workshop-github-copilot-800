import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Fetching workouts from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts data received:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getDifficultyBadge = (difficulty) => {
    const difficultyLower = (difficulty || '').toLowerCase();
    if (difficultyLower === 'easy' || difficultyLower === 'beginner') {
      return <span className="badge bg-success">{difficulty}</span>;
    } else if (difficultyLower === 'medium' || difficultyLower === 'intermediate') {
      return <span className="badge bg-warning text-dark">{difficulty}</span>;
    } else if (difficultyLower === 'hard' || difficultyLower === 'advanced') {
      return <span className="badge bg-danger">{difficulty}</span>;
    }
    return <span className="badge bg-secondary">{difficulty}</span>;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="content-wrapper text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading workout suggestions...</p>
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
            <p>Failed to load workouts: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="content-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-header mb-0">Workout Suggestions</h1>
          <button className="btn btn-primary">
            <i className="bi bi-lightning me-2"></i>
            Get Personalized Plan
          </button>
        </div>
        
        <div className="row">
          {workouts.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center" role="alert">
                <h4 className="alert-heading">No workouts found</h4>
                <p className="mb-0">Check back later for personalized workout suggestions!</p>
              </div>
            </div>
          ) : (
            workouts.map(workout => (
              <div className="col-lg-6 col-md-12 mb-4" key={workout.id}>
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{workout.name}</h5>
                    {getDifficultyBadge(workout.difficulty)}
                  </div>
                  <div className="card-body">
                    <p className="card-text">{workout.description}</p>
                    
                    <div className="row g-3 mt-2">
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-tag text-primary me-2"></i>
                          <div>
                            <small className="text-muted d-block">Category</small>
                            <span className="badge bg-primary">{workout.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-clock text-info me-2"></i>
                          <div>
                            <small className="text-muted d-block">Duration</small>
                            <strong>{workout.duration} min</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-fire text-danger me-2"></i>
                          <div>
                            <small className="text-muted d-block">Calories</small>
                            <strong>{workout.calories_burned}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-graph-up text-success me-2"></i>
                          <div>
                            <small className="text-muted d-block">Difficulty</small>
                            {getDifficultyBadge(workout.difficulty)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent">
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-eye me-1"></i> View Details
                      </button>
                      <button className="btn btn-sm btn-success">
                        <i className="bi bi-play-circle me-1"></i> Start Workout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {workouts.length > 0 && (
          <div className="mt-3 text-muted">
            <small>Total Workouts: {workouts.length}</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
