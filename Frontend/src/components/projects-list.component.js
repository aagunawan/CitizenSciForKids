import React, { Component } from "react";
import ProjectDataService from "../services/project.service";
import ObservationDataService from "../services/observation.service";
import UserDataService from "../services/user.service";
import { Link } from "react-router-dom";


var data = null;

export default class ProjectsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.retrieveProjects = this.retrieveProjects.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveProject = this.setActiveProject.bind(this);
    this.setActiveObservation = this.setActiveObservation.bind(this);
    this.removeAllProjects = this.removeAllProjects.bind(this);
    this.searchName = this.searchName.bind(this);

    this.state = {
      projects: [],
      currentProject: null,
      currentAdmin: null,
      currentIndex: -1,
      currentObservationIndex: -1,
      observationObjectsInCurrentProject: [],
      currentObservation: null,
      searchName: ""
    };
  }

  componentDidMount() {
    this.retrieveProjects();

  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    });
  }

  retrieveProjects() {
    ProjectDataService.getAll()
      .then(response => {
        this.setState({
          projects: response.data
        });
        // data = response.data.image;
        // console.log(data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveProjects();
    this.setState({
      currentProject: null,
      currentAdmin: null,
      currentObservation: null,
      currentIndex: -1,
      currentObservationIndex: -1
    });
  }

  setActiveProject(project, index, admin, observation) {

    this.setState({
      currentProject: project,
      currentIndex: index,
      observationObjectsInCurrentProject: [],
      currentObservation: null,
      currentAdmin: null
    })
    
      // Perform API call for user admin in current project only if the project has admin
      if (admin){

        UserDataService.get(admin)
          .then(response => {
            this.setState({
              currentAdmin: response.data.username
            });
          })
        .catch(e => {
          console.error(e);
        })
        console.log(this.state); 
      }

    // Perform API call for observations in current project only if the project has observations
    if (observation.length > 0){
      let promises = observation.map(obs_id => {
        return ObservationDataService.get(obs_id)
          .then(response => {
            return response.data
          })
      });
  
      Promise.all(promises)
      .then(results => {
        // Handle results
        this.setState({
   
          observationObjectsInCurrentProject: results
        })
      })
      .catch(e => {
        console.error(e);
      })
      console.log(this.state); 
    }
    
  }

  setActiveObservation(observation, index){
    this.setState({
      currentObservation: observation,
      currentObservationIndex: index

    });
  }

  removeAllProjects() {
    ProjectDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchName() {
    ProjectDataService.findByName(this.state.searchName)
      .then(response => {
        this.setState({
          projects: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchName, projects, currentProject, currentAdmin, currentIndex, currentObservationIndex, currentObservation, observationObjectsInCurrentProject } = this.state;

    return (
      
      <div className="list row">
        <div className="col-md-12">
          <div className="input-group mb-3 d-flex justify-content-center">
            <input
              type="text"
              className="form-control-search"
              id = "search-box"
              placeholder="Search by name"
              value={searchName}
              onChange={this.onChangeSearchName}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchName}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <h4>Citizen Science for Kids Projects</h4>

          <ul className="list-group">
            {projects &&
              projects.map((project, index) => (
                <li
                  className={
                    "list-project" +
                    (index === currentIndex ? "active" : "")
                  }
                  // onClick={() => this.setActiveProject(project, index, project.admin,project.observations)}
                  key={index}
                >
                 
         
                  <div> 
                    <img className="col-md-4 rounded float-left" src={project.image.data} alt="" /> 
                    <div className="project-name"><Link className="project-name" to={"/projects-details/" + project.id}>{project.name} </Link>  </div>
                    <div>{project.description}</div>
                  </div>
                  
                </li>
              ))}
          </ul>

          {/* <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllProjects}
          >
            Remove All
          </button> */}
        </div>
        <div className="col-md-6">
          {currentProject ? (
            <div>
              <h4>Project</h4>
              <Link
                to={"/projects/" + currentProject.id}
                className="badge badge-warning"
              >
                Edit Project
              </Link>
              <div>
                <label>
                  <strong>Name:</strong>
                </label>{" "}
                {currentProject.name}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentProject.description}
              </div>
              <div>
                <label>
                  <strong>Date Created:</strong>
                </label>{" "}
                {currentProject.dateCreated}
              </div>
              <div>
                <label>
                  <strong>Admin:</strong>
                </label>{" "}
                {currentAdmin}
              </div>
              <div>
                <label>
                  <strong>Observations:</strong>
                </label>{" "}

                <ul className="list-group">
                  {observationObjectsInCurrentProject &&
                    observationObjectsInCurrentProject.map((observation, index) => (
                      <li
                        className={
                          "list-group-item "+
                          (index === currentObservationIndex ? "active" : "")}
                        onClick={() => this.setActiveObservation(observation, index)}
                        key={index}
                      >
                        {observation.title}
                      </li>
                    ))}
                </ul>

                <div className="col-md-6">
                {currentObservation ? (
                  <div>
                    <h4>Observation</h4>
                    <div>
                      <label>
                        <strong>Title:</strong>
                      </label>{" "}
                      {currentObservation.title}
                    </div>
                    <div>
                      <label>
                        <strong>Description:</strong>
                      </label>{" "}
                      {currentObservation.description}
                    </div>
                    <div>
                      <label>
                        <strong>Date Created:</strong>
                      </label>{" "}
                      {currentObservation.dateCreated}
                    </div>
                  </div>
                ): (
                  <div>
                    <br />
                    {/* <p>Please click on an Observation...</p> */}
                  </div>
                )}</div>
              </div>

              

              {/* <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentProject.published ? "Published" : "Pending"}
              </div> */}

              
            </div>
          ) : (
            <div>
              <br />
              {/* <p>Please click on a Project...</p> */}
            </div>
          )}
        </div>
      </div>
    );
  }
}