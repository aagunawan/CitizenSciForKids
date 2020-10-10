import React, { Component } from "react";
import ProjectDataService from "../services/project.service";
import UserDataService from "../services/user.service";
// import ImageUploader from 'react-images-upload';
import Select from 'react-select';

export default class AddProject extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeAdmin = this.onChangeAdmin.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.newProject = this.newProject.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      id: null,
      name: "",
      description: "", 
      dateCreated: "",
      observations: "",
      admin: null,
      initialAdmins: [],
      file: '',
      image: '',
      submitted: false
    };
  }

  componentDidMount() {
    let initialAdmins = [];
    UserDataService.getAll()
        .then(response => {
          initialAdmins = response.data.map((admin) => {
            return admin
        });
        console.log(initialAdmins);
        this.setState({
            initialAdmins: initialAdmins,
        });
    });
}

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
    
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeAdmin(admin)  {
    
    this.setState({ admin: admin.value });
    
  };



  onDrop(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        image: reader.result
      });
    }
    reader.readAsDataURL(file)   ;

    console.log(this.state);

}

  saveProject() {
    // const imageData = new FormData();
    // imageData.append('file', this.state.image);
    console.log(this.state.image);
    var data = {
      name: this.state.name,
      description: this.state.description,
      admin: this.state.admin,
      image: this.state.image
    };
    console.log(data);

    ProjectDataService.create(data)
      .then(response => {
        console.log(this.state);
        this.setState({
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          admin: response.data.admin,
          image: response.data.image,
          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newProject() {
    this.setState({
      id: null,
      name: "",
      description: "",
      dateCreated: "",
      observations: "",
      admin: null,
      initialAdmins: [],
      submitted: false,
      image: "",
      file: ""
    });
    this.componentDidMount();
  }

  render() {

    
    console.log(this.state.initialAdmins);
    const adminList = (this.state.initialAdmins && this.state.initialAdmins.length > 0) ?
    this.state.initialAdmins.map((item) => { 
      return (
        {value: item.username, label: item.username}
      )
   
    }) : ''
  


    return (
        <div className="submit-form">
          {this.state.submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={this.newProject}>
                Add More Project
              </button>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="name">Name (required)</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  required
                  value={this.state.name}
                  onChange={this.onChangeName}
                  name="name"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  required
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                  name="description"
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin">Admin (required)</label>
                <Select
                  id="admin"
                  name="admin"
                  required
                  onChange={this.onChangeAdmin}
                  options={adminList}                
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input type="file" name="file" onChange={this.onDrop}/>
              </div>
              
  
              <button onClick={this.saveProject} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
    );
  }
}