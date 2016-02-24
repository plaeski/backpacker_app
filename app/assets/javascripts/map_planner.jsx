var TripPlanner = React.createClass({
  loadCitiesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if ($.isEmptyObject(data.route_details)) {
          this.setState({data: []});
        } else {
          this.setState({data: data});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCitySubmit: function(comment) {
    if (this.state.data){
      var locations = this.state.data;
      var city = locations.route_details.map(function(city) {
        return (city.text)
      });
      var newLocation = locations.route_details.concat([comment]);
      locations.route_details = newLocation
      this.setState({data: locations });
      $.ajax({
        url: '/trip_route/update',
        dataType: 'json',
        type: 'POST',
        data: locations,
        success: function(data) {
          this.setState({data:data});
        }.bind(this),
        error: function(xhr, status, err) {
          this.setState({data: locations});
          console.error(this.props.url,status,err,toString());
        }.bind(this)
      });
    }
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    this.loadCitiesFromServer();
  },
  render: function() {
    return (
      <div className="tripPlanner">
        <h1>Cities</h1>
        <MapBox data={this.state.data.route_details} />
        <CityList data={this.state.data.route_details} />
        <CityForm onCommentSubmit={this.handleCitySubmit} />
      </div>
    );
  }
});

var MapBox = React.createClass({

  createMap: function (cities) {
    var map = new GMaps({
      div: '#map',
      lat: 41.9000,
      lng: 0.4000,
      width: '750px',
      height: '500px',
      zoom: 5
    });
      var coordinates = cities.map(function(city) {
        return [city.lat, city.lng]
      })

      for (var i = 0; i<coordinates.length; i++) {
        map.addMarker({
          lat: coordinates[i][0],
          lng: coordinates[i][1]
        });
        map.setCenter(coordinates[i][0], coordinates[i][1]);
      }
      
      map.drawPolyline({
        path: coordinates,
        strokeColor: '#131540',
        strokeOpacity: 0.6,
        strokeWeight: 5
      }); 
  },
  componentDidUpdate: function() {
    if (this.props.data){
      var cities = this.props.data.map(function(city) {
        return city
      });
      this.createMap(cities);
    }
  },
  render: function() {
    return (
      <div id="map">
      </div>
    );
  }
});

var CityList = React.createClass({
  render: function() {
    if (this.props.data) {
      var cityNodes = this.props.data.map(function(city) {
        return (
          <Comment key={city.id}>
            {city.text}
          </Comment>
        );
      });
  }
    return (
      <div className="cityList">
        {cityNodes}
      </div>
    );
  }
});

var CityForm = React.createClass({
  getInitialState: function(){
    return {text: ''};
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return
    }
    var that = this;
    GMaps.geocode({
      address: text, 
      callback: function(results, status){
        if(status=='OK'){
          var latlng = results[0].geometry.location;
          var lat = latlng.lat()
          var lng = latlng.lng()
          that.props.onCommentSubmit({text:text, lat: lat, lng: lng})
          that.setState({text: ''});
        }  
      }
    });
    
  },
  render: function() {
    return (
      <div className="CityForm">
        <form className="CityForm" onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            placeholder="Say something..."
            value={this.state.text}
            onChange={this.handleTextChange}
          />
          <input type="submit" value="Post" />
        </form>
      </div>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <ul className="comment-body">
          <li>
            {this.props.children}
          </li>
        </ul>
      </div>
    );
  }
});