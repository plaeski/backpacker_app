var ItineraryExplorer = React.createClass({
  loadCitiesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCitySubmit: function(comment) {
    if (this.state.data){
      var locations = this.state.data;
      if (locations.route_details) {
        var city = locations.route_details.map(function(city) {
          return (city.text)
        });
        var newLocation = locations.route_details.concat([comment]);
        locations.route_details = newLocation
      } else {
        var newLocation = comment
        locations.route_details = [newLocation]
      }
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
  removeCity: function(e) {
    var id = e.target.id
    var listData = this.state.data
    listData.item_id = id
    $.ajax({
      url: '/trip_route/stop/delete',
      dataType: 'json',
      type: 'POST',
      data: listData,
      success: function(data) {
        this.setState({data:data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: locations});
        console.error(this.props.url,status,err,toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="tripPlanner">
        <h1>Itineraries</h1>
        <div className="row">
          <div className="large-3 columns">...</div>
          <div className="large-3 columns">
            <ItinList data={this.state.data} />
          </div>
          <div className="large-6 columns">
            <ItinDetails data={this.state.data} removeCity={this.removeCity}/>
          </div>
        </div>
      </div>
    );
  }
});

var ItinList = React.createClass({
  render: function() {
    if (this.props.data) {
      var that = this
      var itinNodes = this.props.data.map(function(itin, i) {
        var days = itin.cities.length;
        return (
          <Itinerary key={itin.id}>
            <h4>{days} day itinerary</h4>
            <ItinCountryDetails data={itin}/>
            <div id={i} onClick={that.props.removeCity}><a href="#" className="button info round">See Details</a></div>   
          </Itinerary>
        );
      });
    }
    return (
      <div className="cityList">
        {itinNodes} 
      </div>
    );
  }
});


var ItinDetails = React.createClass({
  render: function() {
    if (this.props.data) {
      var that = this
      var itinNodes = this.props.data.map(function(itin, i) {
        var days = itin.cities.length;
        return (
          <Itinerary key={itin.id}>
            <h2>Details</h2>
            <div id={i} onClick={that.props.removeCity}>x</div>
              <ItinCityDetails data={itin}/>
          </Itinerary>
        );
      });
    }
    return (
      <div className="cityList">
        {itinNodes} 
      </div>
    );
  }
});

var Itinerary = React.createClass({
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

var ItinCityDetails = React.createClass({
  render: function() {
    if(this.props.data) {
      var details = this.props.data.cities.map(function(itin, i) {
        return(
          <li>
            {itin}
          </li>
        )
      })
    }
    return (
      <div className="cityList">
        <ol>
          {details}
        </ol> 
      </div>
    )
  }
})

var ItinCountryDetails = React.createClass({
  render: function() {
    if(this.props.data) {
      var details = this.props.data.countries.map(function(itin, i) {
        return(
          <li>
            {itin}
          </li>
        )
      })
    }
    return (
      <div className="cityList">
        <ul>
          {details}
        </ul> 
      </div>
    )
  }
})
