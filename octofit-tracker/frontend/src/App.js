import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="container mt-4">
      <div className="content-wrapper">
        <div className="jumbotron text-center">
          <h1 className="display-3 mb-4">
            <i className="bi bi-heart-pulse text-danger me-3"></i>
            Welcome to OctoFit Tracker
          </h1>
          <p className="lead mb-4">
            Track your fitness activities, compete with teams, and reach your goals!
          </p>
          <hr className="my-4" />
          <p className="mb-4">
            Join the fitness community and start your journey to a healthier lifestyle.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button className="btn btn-light btn-lg">
              <i className="bi bi-play-circle me-2"></i>
              Get Started
            </button>
            <button className="btn btn-outline-light btn-lg">
              <i className="bi bi-info-circle me-2"></i>
              Learn More
            </button>
          </div>
        </div>

        <div className="row mt-5 g-4">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <i className="bi bi-trophy display-4 text-warning mb-3"></i>
                <h5 className="card-title">Compete & Win</h5>
                <p className="card-text">
                  Join teams, climb the leaderboard, and compete with friends in fitness challenges.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <i className="bi bi-graph-up display-4 text-success mb-3"></i>
                <h5 className="card-title">Track Progress</h5>
                <p className="card-text">
                  Log your activities and monitor your fitness journey with detailed analytics.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <i className="bi bi-lightning display-4 text-primary mb-3"></i>
                <h5 className="card-title">Get Personalized</h5>
                <p className="card-text">
                  Receive customized workout suggestions tailored to your fitness level and goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 p-4 bg-light rounded">
          <h3 className="text-center mb-4">Quick Links</h3>
          <div className="row text-center">
            <div className="col-md-2 col-6 mb-3">
              <Link to="/users" className="text-decoration-none">
                <div className="p-3">
                  <i className="bi bi-people display-6 text-primary"></i>
                  <p className="mt-2 mb-0 fw-bold">Users</p>
                </div>
              </Link>
            </div>
            <div className="col-md-2 col-6 mb-3">
              <Link to="/teams" className="text-decoration-none">
                <div className="p-3">
                  <i className="bi bi-people-fill display-6 text-success"></i>
                  <p className="mt-2 mb-0 fw-bold">Teams</p>
                </div>
              </Link>
            </div>
            <div className="col-md-2 col-6 mb-3">
              <Link to="/activities" className="text-decoration-none">
                <div className="p-3">
                  <i className="bi bi-activity display-6 text-info"></i>
                  <p className="mt-2 mb-0 fw-bold">Activities</p>
                </div>
              </Link>
            </div>
            <div className="col-md-2 col-6 mb-3">
              <Link to="/workouts" className="text-decoration-none">
                <div className="p-3">
                  <i className="bi bi-lightning-fill display-6 text-warning"></i>
                  <p className="mt-2 mb-0 fw-bold">Workouts</p>
                </div>
              </Link>
            </div>
            <div className="col-md-2 col-6 mb-3">
              <Link to="/leaderboard" className="text-decoration-none">
                <div className="p-3">
                  <i className="bi bi-trophy-fill display-6 text-danger"></i>
                  <p className="mt-2 mb-0 fw-bold">Leaderboard</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">OctoFit Tracker</Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">Teams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">Activities</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">Workouts</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
