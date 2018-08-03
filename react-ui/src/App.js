import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      fetching: true
    };
  }

  setCoordsFromLocalStorage(cachedLat, cachedLon) {
    this.setState({
     latitude: cachedLat,
     longitude: cachedLon
    }, () => {
     this.callWeatherApi(this.state.latitude,
                         this.state.longitude,
                         "geo")
     .then(res => this.setState({ response: res.express }))
     .catch(err => console.log(err));
    });
   }

  changeLocation(location) {
    this.setState({
     location: location
    }, () => {
     this.callWeatherApi("latitude", "longitude", this.state.location)
     .then(res => this.setState({ response: res.express }))
     .catch(err =>
      this.setState({
       errorText: "city does not exist",
      }),
      console.log(this.state.errorText)
     );
    });
   }

   getCoords() {
    if (window.navigator.geolocation) { 
     navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem('latitude', position.coords.latitude);
      localStorage.setItem('longitude', position.coords.longitude);
      this.callWeatherApi(position.coords.latitude,
                          position.coords.longitude,
                          "geo")
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
    }, (error) => {
     this.setState({
      error: error.message,
     });
    });
    } 
   }

  componentDidMount() {
    let cachedLat = localStorage.getItem('latitude');
    let cachedLon = localStorage.getItem('longitude');

    cachedLat ? 
      this.setCoordsFromLocalStorage(cachedLat, cachedLon) :
      this.getCoords();

    /*fetch('/api')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          message: json.message,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          message: `API call failed: ${e}`,
          fetching: false
        });
      })*/
  }

  callWeatherApi = async (latitude, longitude, location) => {
  let response = await fetch('/api/weather?latitude=' + latitude + '&longitude=' + longitude + '&location=' + location);
    let body = await response.json();
    if (body.cod == 404) {
      throw Error(body.message);
    } else {
      this.callUnsplashApi(body.name)
      this.setState({
      errorText: "",
      data: body,
      loading: false
      })
      return body;
    }};
  
  callUnsplashApi = async (location) => {
    let response = await fetch('/api/unsplash?location=' + location);
    let body = await response.json();
    
    if (response.status !== 200) throw Error(body.message);
    var randomPhotoNumber = Math.floor(Math.random() * 10);
    this.setState({
      currentCityImage: body[randomPhotoNumber].urls.regular,
      userFirstName: body[randomPhotoNumber].user.first_name,
      userProfileLink: body[randomPhotoNumber].user.links.html,
      userProfileImage:
      body[randomPhotoNumber].user.profile_image.medium
    });
    return body;
    };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          {'This is '}
          <a href="https://github.com/mars/heroku-cra-node">
            {'create-react-app with a custom Node/Express server'}
          </a><br/>
        </p>
        <p className="App-intro">
          {this.state.fetching
            ? 'Fetching message from API'
            : this.state.message}
        </p>
      </div>
    );
  }
}

export default App;
