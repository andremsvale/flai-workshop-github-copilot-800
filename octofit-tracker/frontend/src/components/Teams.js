import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    const usersUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    console.log('Fetching teams from:', apiUrl);

    Promise.all([
      fetch(apiUrl).then(r => r.json()),
      fetch(usersUrl).then(r => r.json())
    ])
      .then(([teamsData, usersData]) => {
        console.log('Teams data received:', teamsData);
        console.log('Users data received:', usersData);
        
        // Handle both paginated (.results) and plain array responses
        const teamsArray = teamsData.results || teamsData;
        const usersArray = usersData.results || usersData;
        
        const parsedTeams = (Array.isArray(teamsArray) ? teamsArray : []).map(team => {
          // Parse members if it's a string
          let members = team.members;
          if (typeof members === 'string') {
            try {
              members = JSON.parse(members);
            } catch (e) {
              console.error('Error parsing members for team:', team.name, e);
              members = [];
            }
          }
          return { ...team, members: Array.isArray(members) ? members : [] };
        });
        
        console.log('Parsed teams:', parsedTeams);
        setTeams(parsedTeams);
        setUsers(Array.isArray(usersArray) ? usersArray : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getUserInfo = (email) => {
    const user = users.find(u => u.email === email);
    if (user) {
      return { name: user.name, role: user.role };
    }
    // Fallback to parsing email
    const name = email.split('@')[0].replace(/\./g, ' ').split(' ').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ');
    return { name, role: 'Hero' };
  };

  const getHeroIcon = (role) => {
    const roleLower = (role || '').toLowerCase();
    if (roleLower.includes('strength')) return '💪';
    if (roleLower.includes('cardio') || roleLower.includes('running')) return '⚡';
    if (roleLower.includes('flexibility') || roleLower.includes('yoga')) return '🧘';
    if (roleLower.includes('swimming')) return '🏊';
    return '🦸';
  };

  const getTeamTheme = (teamName) => {
    const name = teamName.toLowerCase();
    if (name.includes('marvel')) {
      return {
        gradient: 'linear-gradient(135deg, #e23636 0%, #d32f2f 50%, #b71c1c 100%)',
        borderColor: '#ffeb3b',
        icon: '⚡',
        badgeClass: 'bg-danger',
        titleColor: '#ffeb3b',
        shadowColor: 'rgba(227, 54, 54, 0.5)',
        accentGradient: 'linear-gradient(90deg, #ffeb3b, #fdd835)'
      };
    } else if (name.includes('dc')) {
      return {
        gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
        borderColor: '#ffd700',
        icon: '🦇',
        badgeClass: 'bg-primary',
        titleColor: '#ffd700',
        shadowColor: 'rgba(13, 71, 161, 0.5)',
        accentGradient: 'linear-gradient(90deg, #ffd700, #ffca28)'
      };
    }
    return {
      gradient: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ab47bc 100%)',
      borderColor: '#00e676',
      icon: '🦸',
      badgeClass: 'bg-success',
      titleColor: '#00e676',
      shadowColor: 'rgba(106, 27, 154, 0.5)',
      accentGradient: 'linear-gradient(90deg, #00e676, #00c853)'
    };
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="content-wrapper text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Assembling the heroes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="content-wrapper">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading"><i className="bi bi-exclamation-triangle me-2"></i>Error!</h4>
            <p>Failed to load teams: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="content-wrapper">
        <div className="text-center mb-5">
          <h1 className="page-header mb-3" style={{
            fontSize: '3rem',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            textShadow: '3px 3px 6px rgba(0,0,0,0.3)'
          }}>
            <i className="bi bi-shield-fill-check me-3"></i>
            Superhero Teams
            <i className="bi bi-shield-fill-check ms-3"></i>
          </h1>
          <p className="lead text-muted" style={{fontSize: '1.2rem', fontWeight: '500'}}>
            Join forces with legendary heroes and compete for glory!
          </p>
        </div>
        
        <div className="row g-4">
          {teams.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center" role="alert" style={{
                borderRadius: '15px',
                border: '3px solid #17a2b8',
                padding: '2rem'
              }}>
                <i className="bi bi-people-fill display-1 text-info mb-3"></i>
                <h4 className="alert-heading">No Teams Assembled Yet!</h4>
                <p className="mb-0">Create your first superhero team and save the world!</p>
              </div>
            </div>
          ) : (
            teams.map(team => {
              const theme = getTeamTheme(team.name);
              return (
                <div className="col-lg-6 col-md-12 mb-4" key={team.id}>
                  <div className="card h-100" style={{
                    background: theme.gradient,
                    border: `4px solid ${theme.borderColor}`,
                    borderRadius: '20px',
                    boxShadow: `0 10px 30px ${theme.shadowColor}, 0 0 20px ${theme.shadowColor}`,
                    transform: 'scale(1)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = `0 15px 40px ${theme.shadowColor}, 0 0 30px ${theme.shadowColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = `0 10px 30px ${theme.shadowColor}, 0 0 20px ${theme.shadowColor}`;
                  }}>
                    
                    {/* Comic Book Style Header */}
                    <div className="card-header text-center" style={{
                      background: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)`,
                      border: 'none',
                      borderBottom: `3px solid ${theme.borderColor}`,
                      padding: '1.5rem'
                    }}>
                      <div style={{fontSize: '3rem', marginBottom: '0.5rem'}}>
                        {theme.icon}
                      </div>
                      <h2 className="mb-2" style={{
                        color: theme.titleColor,
                        fontSize: '2.5rem',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        textShadow: `3px 3px 6px rgba(0,0,0,0.5), 0 0 10px ${theme.borderColor}`,
                        fontFamily: 'Impact, sans-serif'
                      }}>
                        {team.name}
                      </h2>
                      <p className="mb-0" style={{
                        color: '#fff',
                        fontSize: '1.2rem',
                        fontStyle: 'italic',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                      }}>
                        "{team.description}"
                      </p>
                    </div>
                    
                    {/* Team Stats */}
                    <div className="card-body" style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      padding: '2rem'
                    }}>
                      <div className="row text-center mb-4">
                        <div className="col-6">
                          <div style={{
                            background: theme.accentGradient,
                            borderRadius: '15px',
                            padding: '1rem',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                          }}>
                            <i className="bi bi-people-fill display-5 text-dark mb-2"></i>
                            <h3 className="mb-0 text-dark" style={{fontWeight: '900'}}>
                              {team.members.length}
                            </h3>
                            <small className="text-dark fw-bold">HEROES</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div style={{
                            background: theme.accentGradient,
                            borderRadius: '15px',
                            padding: '1rem',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                          }}>
                            <i className="bi bi-calendar-check display-5 text-dark mb-2"></i>
                            <h3 className="mb-0 text-dark" style={{fontWeight: '900', fontSize: '0.9rem'}}>
                              {new Date(team.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric'
                              })}
                            </h3>
                            <small className="text-dark fw-bold">ASSEMBLED</small>
                          </div>
                        </div>
                      </div>

                      {/* Team Members - Hero Roster */}
                      <div className="mb-3">
                        <h5 className="fw-bold mb-3 text-center" style={{
                          color: '#333',
                          fontSize: '1.5rem',
                          textTransform: 'uppercase',
                          letterSpacing: '2px',
                          borderBottom: `3px solid ${theme.borderColor}`,
                          paddingBottom: '0.75rem',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                        }}>
                          <i className="bi bi-stars me-2" style={{color: theme.borderColor}}></i>
                          Hero Roster
                          <i className="bi bi-stars ms-2" style={{color: theme.borderColor}}></i>
                        </h5>
                        <div className="row g-3">
                          {team.members.map((memberEmail, index) => {
                            const heroInfo = getUserInfo(memberEmail);
                            const heroIcon = getHeroIcon(heroInfo.role);
                            return (
                              <div className="col-md-6" key={index}>
                                <div style={{
                                  background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                                  border: `3px solid ${theme.borderColor}`,
                                  borderRadius: '12px',
                                  padding: '1rem',
                                  boxShadow: `0 4px 8px rgba(0,0,0,0.2), inset 0 0 15px rgba(255,255,255,0.5)`,
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer',
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-4px)';
                                  e.currentTarget.style.boxShadow = `0 8px 16px rgba(0,0,0,0.3), 0 0 20px ${theme.shadowColor}`;
                                  e.currentTarget.style.borderColor = theme.titleColor;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = `0 4px 8px rgba(0,0,0,0.2), inset 0 0 15px rgba(255,255,255,0.5)`;
                                  e.currentTarget.style.borderColor = theme.borderColor;
                                }}>
                                  {/* Comic book corner effect */}
                                  <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: 0,
                                    height: 0,
                                    borderStyle: 'solid',
                                    borderWidth: '0 40px 40px 0',
                                    borderColor: `transparent ${theme.borderColor} transparent transparent`,
                                    opacity: 0.3
                                  }}></div>
                                  
                                  <div className="d-flex align-items-center">
                                    {/* Hero Icon */}
                                    <div style={{
                                      fontSize: '3rem',
                                      marginRight: '1rem',
                                      background: theme.accentGradient,
                                      borderRadius: '50%',
                                      width: '70px',
                                      height: '70px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                      border: '3px solid #fff'
                                    }}>
                                      {heroIcon}
                                    </div>
                                    
                                    {/* Hero Info */}
                                    <div style={{flex: 1}}>
                                      <h6 style={{
                                        margin: 0,
                                        fontSize: '1.1rem',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        color: '#000',
                                        textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                                        fontFamily: 'Impact, sans-serif'
                                      }}>
                                        {heroInfo.name}
                                      </h6>
                                      <div style={{
                                        display: 'inline-block',
                                        background: theme.gradient,
                                        color: '#fff',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '15px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        marginTop: '0.25rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                      }}>
                                        {heroInfo.role}
                                      </div>
                                    </div>
                                    
                                    {/* Rank indicator */}
                                    <div style={{
                                      background: theme.accentGradient,
                                      borderRadius: '50%',
                                      width: '35px',
                                      height: '35px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: '900',
                                      fontSize: '1.1rem',
                                      color: '#000',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                      border: '2px solid #fff'
                                    }}>
                                      #{index + 1}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="card-footer" style={{
                      background: `linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)`,
                      border: 'none',
                      borderTop: `3px solid ${theme.borderColor}`,
                      padding: '1.5rem'
                    }}>
                      <div className="d-flex justify-content-around">
                        <button className="btn btn-light btn-lg fw-bold" style={{
                          borderRadius: '10px',
                          padding: '0.75rem 1.5rem',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          <i className="bi bi-eye-fill me-2"></i>View
                        </button>
                        <button className="btn btn-warning btn-lg fw-bold" style={{
                          borderRadius: '10px',
                          padding: '0.75rem 1.5rem',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          background: theme.accentGradient,
                          border: 'none',
                          color: '#000'
                        }}>
                          <i className="bi bi-person-plus-fill me-2"></i>Join
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {teams.length > 0 && (
          <div className="mt-4 text-center">
            <div className="alert alert-dark" style={{
              borderRadius: '15px',
              border: '3px solid #ffc107',
              background: 'linear-gradient(135deg, #212529 0%, #343a40 100%)',
              color: '#ffc107',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              <i className="bi bi-shield-fill-check me-2"></i>
              Total Teams Assembled: {teams.length}
              <i className="bi bi-shield-fill-check ms-2"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
