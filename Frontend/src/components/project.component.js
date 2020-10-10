import React, { Component } from "react";
import ProjectDataService from "../services/project.service";



export default class Project extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getProject = this.getProject.bind(this);
    // this.updatePublished = this.updatePublished.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);

    this.state = {
      currentProject: {
        id: null,
        name: "",
        description: "",
        dateCreated: "",
        observation: "",
        admin: ""
        // published: false
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getProject(this.props.match.params.id);
  }

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function(prevState) {
      return {
        currentProject: {
          ...prevState.currentProject,
          name: name
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;
    
    this.setState(prevState => ({
      currentProject: {
        ...prevState.currentProject,
        description: description
      }
    }));
  }

  onChangeAdmin(e) {
    const admin = e.target.value;
    
    this.setState(prevState => ({
      currentProject: {
        ...prevState.currentProject,
        admin: admin
      }
    }));
  }

  getProject(id) {
    ProjectDataService.get(id)
      .then(response => {
        this.setState({
          currentProject: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  // updatePublished(status) {
  //   var data = {
  //     id: this.state.currentProject.id,
  //     name: this.state.currentProject.name,
  //     description: this.state.currentProject.description,
  //     published: status
  //   };

  //   ProjectDataService.update(this.state.currentProject.id, data)
  //     .then(response => {
  //       this.setState(prevState => ({
  //         currentProject: {
  //           ...prevState.currentProject,
  //           published: status
  //         }
  //       }));
  //       console.log(response.data);
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }

  updateProject() {
    ProjectDataService.update(
      this.state.currentProject.id,
      this.state.currentProject
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The project was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteProject() {    
    ProjectDataService.delete(this.state.currentProject.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/projects')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentProject } = this.state;

    return (
      <div>
        {currentProject ? (
          <div className="edit-form">
            <h4>Project</h4>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={currentProject.name}
                  onChange={this.onChangeName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentProject.description}
                  onChange={this.onChangeDescription}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateCreated">Date Created</label>
                <input
                  type="text"
                  className="form-control"
                  id="dateCreated"
                  value={currentProject.dateCreated}
                  // onChange={this.onChangedateCreated}
                />
              </div>
              <div className="form-group">
                <label htmlFor="admin">Admin</label>
                <input
                  type="text"
                  className="form-control"
                  id="admin"
                  value={currentProject.admin}
                  onChange={this.onChangeAdmin}
                />
              </div>


            </form>




            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteProject}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateProject}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Project...</p>
          </div>
        )}
      </div>
    );
  }
}