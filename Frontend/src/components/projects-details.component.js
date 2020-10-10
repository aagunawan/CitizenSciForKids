import React, { Component } from "react";
import ProjectDataService from "../services/project.service";
import ObservationDataService from "../services/observation.service";
import UserDataService from "../services/user.service";
// import CurrentLocation from './map.component';
import { Link } from "react-router-dom";
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { InfoWindow, Marker } from 'google-maps-react';
const mapStyles = {
  width: '100%',
  height: '100%'
};



export class Project extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.saveNewImage = this.saveNewImage.bind(this);
    this.getProject = this.getProject.bind(this);
    // this.onMarkerClick = this.onMarkerClick.bind(this);
    // this.onClose = this.onClose.bind(this);
    // this.updateProject = this.updateProject.bind(this);
    // this.deleteProject = this.deleteProject.bind(this);

    // const { lat, lng } = this.props.initialCenter;
    this.state = {

        id: null,
        name: "",
        description: "",
        dateCreated: "",
        observations: [], // array of observation id
        admin: "",
        image: '',
        currentObservationIndex: -1,
        observationObjectsInCurrentProject: [], // array of observation object instance
        currentObservation: null,
        submitted: false,
        showingInfoWindow: false,  //Hides or the shows the infoWindow
        activeMarker: {},          //Shows the active marker upon click
        selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
        // currentLocation: {
        //   lat: lat,
        //   lng: lng
        // }

      message: "",

      
    };
  }

  componentDidMount() {
    console.log(this.state);
    this.getProject(this.props.match.params.id)
    
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

onMarkerClick = (props, marker, e) =>
  this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true
  });

onClose = props => {
  if (this.state.showingInfoWindow) {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    });
  }
};


  getProject(id) {
    ProjectDataService.get(id)
      .then(response => {
        this.setState({
          // currentProject: {admin: response.data.admin}
          name: response.data.name,
          observations: response.data.observations
        });

        console.log(this.state);

        // getting observation title
        let promises = this.state.observations.map(obs_id => {
          return ObservationDataService.get(obs_id)
            .then(response2 => {
              return response2.data
            })
        });
        Promise.all(promises)
        .then(results => {
          // Handle results
          this.setState({  
          
             observationObjectsInCurrentProject: results
          })
          console.log(results);
        })
        .catch(e => {
          console.error(e);
        })       
        // end of getting obs title

      })
      .catch(e => {
        console.log(e);
      });
  }

  // updateProject() {
  //   ProjectDataService.update(
  //     this.state.currentProject.id,
  //     this.state.currentProject
  //   )
  //     .then(response => {
  //       console.log(response.data);
  //       this.setState({
  //         message: "The project was updated successfully!"
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }

  // deleteProject() {    
  //   ProjectDataService.delete(this.state.currentProject.id)
  //     .then(response => {
  //       console.log(response.data);
  //       this.props.history.push('/projects')
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }

  saveNewImage(id) {
    // const imageData = new FormData();
    // imageData.append('file', this.state.image);
    console.log(id);
    if (this.state.image != ""){
      var data = {
        // name: this.state.name,
        // description: this.state.description,
        // admin: this.state.admin,
        id: id,
        image: {data: this.state.image}
      };
      console.log(data);


      ObservationDataService.uploadImage(data.id, data)  
        .then(response => {
          console.log(this.state);
          this.setState({
            id: response.data.id,
            submitted: true,
            // image: response.data.image,
      
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      }

    // let promises2 = ObservationDataService.uploadImage(data.id, data)      
    //   .then(response => {
    //     return response.data
    //   })
  
    // Promise.all(promises2)
    // .then(results => {
    //   this.setState({       
    //     id: results.data.id,
    //     image: results.data.image.data
    //   })
    //   console.log(results);
    // })
    // .catch(e => {
    //   console.error(e);
    // })       


    // ObservationDataService.uploadImage(data.id, data.image)
    //   .then(response => {
        // console.log(this.state);
        // this.setState({
        //   id: response.data.id,
        //   image: response.data.image.data
        // });
        // console.log(response.data);
      // })
      // .catch(e => {
      //   console.log(e);
      // });
  }

  render() {
    const { name, observations, observationObjectsInCurrentProject, image } = this.state;

    return (
      <div 
      // className="row no-gutters container-fluid"
      >
      {this.state.submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          {/* <button className="btn btn-success" onClick={this.newProject}>
            Add More Project
          </button> */}
        </div>
      ) : (
        <div className="observation-page col container-fluid">

          

            <Map
              google={this.props.google}
              zoom={3}
              style={mapStyles}
              initialCenter={{
                // lat: observation.location.coordinates[0],
                // lng: observation.location.coordinates[1]
              lat: 0,
              lng: 0
              }}
            >

            {observationObjectsInCurrentProject &&
              observationObjectsInCurrentProject.map((observation, index) => (
                
              <Marker key={index}
                onClick={this.onMarkerClick}
                position={{
                  lat: observation.location.coordinates[0],
                  lng: observation.location.coordinates[1]
                // lat: -1.2884,
                // lng: 36.8233
                }}
                name={observation.title}
              />
              ))}
              
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
              >
              <div>
                {this.state.selectedPlace.name}
              </div>
              </InfoWindow>
              

            

            </Map>

              

                <ul 
                className="list-group"
                >
                  {/* <div className="col-md-5">{name} Observations </div> */}
                  <div className="proj-obs-title col-md-4"> 
                  {observationObjectsInCurrentProject &&
                    observationObjectsInCurrentProject.map((observation, index) => (
                      <div className="list-obs-object col-md-12">
                      <li
                        className={
                          "list-group-item list-observation col"                                             
                          // + (index === currentObservationIndex ? "active" : "")
                        } 
                        // onClick={() => this.setActiveObservation(observation, index)}
                        key={index}
                      >
                        <div className = "obs-img-obj row no-gutters">
                          <img className="observation-image col-md-4" src={observation.image.data} alt="" />
                          {/* <div className="col-md-auto"></div> */}
                          <div className="observation-object col"><Link className="observation-title col-12">{observation.title} </Link> 

                     

                            {/* <div className="col-md-auto"></div> */}
                            <div className="observation-description col-12">
                              {observation.dateCreated}                            
                            </div>

                          
                            {/* <div className="row"></div> */}
                          
                            {/* <div className="col"></div> */}

        
                            <div className="update-observation-image col-12">
                              <input className ="upload-obs-image"type="file" name="file"  
                                onChange={this.onDrop}/>
                                <button type="submit" onClick={() =>{this.saveNewImage(observation.id)} } className="obs-img-btn-success">
                              Submit
                              </button>
                            </div> 

                         
                           

                          </div>                                                                      
                        </div>                       
                      </li>
                      </div>
                    ))}
                    <Link to={{pathname: "/add-observation/", state: {name}}} className="new-obs rounded">Add New Observation</Link>
                  </div>
                </ul>
                
              {/* </div>    */}
          {/* </div> */}
        </div>
      )}  
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDyHwsTC6XE26PE4OVhwGcCjhBCk-WO4jg'
})(Project);

// Project.defaultProps = {
//   zoom: 6,
//   initialCenter: [{
//     lat: 0,
//     lng: 0
//   }],
//   centerAroundCurrentLocation: false,
//   visible: true
// };