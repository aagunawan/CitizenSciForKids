import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login.component";
import Registration from "./components/Registration.component";
import AddProject from "./components/add-project.component";
import Project from "./components/project.component";
import ProjectsList from "./components/projects-list.component";
import ProjectDetails from "./components/projects-details.component";
import AddObservation from "./components/add-observation.component";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <a href="/" className="navbar-brand">
              Citizen Science for Kids
            </a>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/projects"} className="nav-link">
                  Projects
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/add"} className="nav-link">
                  Create New Project
                </Link>
              </li>
            </div>
          </nav>

          <div className="container mt-3">
            <Switch>
              {/* <Route exact path="/" component={ProjectsList} /> */}
              <Route exact path="/register" component={Registration} />
              <Route exact path="/login" component={Login} />
              <Route exact path= "/projects" component={ProjectsList} />
              <Route path= "/projects-details/:id" component={ProjectDetails} />            
              <Route exact path="/add" component={AddProject} />
              <Route exact path="/add-observation" component={AddObservation} />
              <Route path="/projects/:id" component={Project} />
              <Redirect from="*" to="/login" />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;