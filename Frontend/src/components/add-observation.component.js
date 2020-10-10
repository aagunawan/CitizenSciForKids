import React, { Component } from "react";
import ProjectDataService from "../services/project.service";
import UserDataService from "../services/user.service";
import ObservationDataService from "../services/observation.service";
import Select from 'react-select';

export default class AddObservation extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeLatitude = this.onChangeLatitude.bind(this);
    this.onChangeLongitude = this.onChangeLongitude.bind(this);
    this.onChangeCreatedBy = this.onChangeCreatedBy.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.saveObservation = this.saveObservation.bind(this);
    this.newObservation = this.newObservation.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "", 
      latitude: 0,
      longitude: 0,
      dateCreated: "",
    //   observations: "",
      createdBy: "",
    //   initialAdmins: [],
      initialCreatedBys: [],
      project: "",
    //   location: null,
      file: '',
      image: '',
      submitted: false
    };
  }

  componentDidMount() {
    console.log(this.props.location.state);
    let initialCreatedBys = [];
    UserDataService.getAll()
        .then(response => {
            initialCreatedBys = response.data.map((createdBy) => {
            return createdBy
        });
        console.log(initialCreatedBys);
        this.setState({
            initialCreatedBys: initialCreatedBys,
        });
    });
}

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
    
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeLatitude(e) {
    this.setState({
      latitude: e.target.value
    });
  }

  onChangeLongitude(e) {
    console.log(e.target.value);
    this.setState({
      longitude: e.target.value
    });
  }

  onChangeCreatedBy(e)  {
    
    this.setState({ createdBy: e.value });
    
  };

  onChangeLocation(e)  {
    
    this.setState({ location: e.value });
    
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

  saveObservation() {
    // const imageData = new FormData();
    // imageData.append('file', this.state.image);
    console.log(this.state);
    var data = {
      title: this.state.title,
      description: this.state.description,
      location: {coordinates: [this.state.latitude, this.state.longitude]},
    // location: this.state.latitude,
      project: this.props.location.state.name,
      createdBy: this.state.createdBy,
      image: this.state.image,
    //   location: this.state.location
    };
    console.log(data);

    ObservationDataService.create(data)
      .then(response => {
        console.log(this.state);
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          createdBy: response.data.createdBy,
          image: response.data.image,
          latitude: response.data.location.coordinates[0],
          longitude: response.data.location.coordinates[1],
          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newObservation() {
    this.setState({
        id: null,
        title: "",
        description: "", 
        dateCreated: "",
      //   observations: "",
        createdBy: null,
      //   initialAdmins: [],
        initialCreatedBys: [],
        latitude: 0,
        longitude: 0,
        file: '',
        image: '',
        submitted: false
    });
    this.componentDidMount();
  }

  render() {

    console.log(this.props.location.state);
    console.log(this.state.initialCreatedBys);
    const createdByList = (this.state.initialCreatedBys && this.state.initialCreatedBys.length > 0) ?
    this.state.initialCreatedBys.map((item) => { 
      return (
        {value: item.username, label: item.username}
      )
   
    }) : ''
  


    return (
        <div className="submit-form">
          {this.state.submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={this.newObservation}>
                Add More observation
              </button>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="name">Title (required)</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  required
                  value={this.state.title}
                  onChange={this.onChangeTitle}
                  name="title"
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
                <label htmlFor="latitude">Latitude (-90 to 90)</label>
                <input
                  type="text"
                  className="form-control"
                  id="latitude"
                  required
                  value={this.state.latitude}
                  onChange={this.onChangeLatitude}
                  name="latitude"
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">Longitude (-180 to 180)</label>
                <input
                  type="text"
                  className="form-control"
                  id="longitude"
                  required
                  value={this.state.longitude}
                  onChange={this.onChangeLongitude}
                  name="longitude"
                />
              </div>

              <div className="form-group">
                <label htmlFor="createdBy">createdBy (required)</label>
                <Select
                  id="createdBy"
                  name="createdBy"
                  required
                  onChange={this.onChangeCreatedBy}
                  options={createdByList}                
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Image</label>
                <input type="file" name="file" onChange={this.onDrop}/>
              </div>
              
  
              <button onClick={this.saveObservation} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
    );
  }
}