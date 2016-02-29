Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

var ItineraryExplorer = React.createClass({
  loadCitiesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({
          data: data,
          results: data,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {results: [], data: [], excluded:[], excludedByDuration: []};
  },
  componentWillMount: function() {
    this.loadCitiesFromServer();
  },
  filterCountries: function(e) {
    var changedState = {
      excluded: this.state.excluded,
    };
    if (e.target.checked == false) {
      changedState.excluded.push(e.target.value)
    } else if (e.target.checked == true){
      for (var i = 0; i<this.state.excluded.length; i++) {
        var excludedCity = this.state.excluded[i]
        var index = excludedCity.indexOf(e.target.value);
        if (index > -1) {
          var updatedList = this.state.excluded.splice(index, [i])
          changedState.excluded = updatedList
        }
      }
    }
    var that = this
    function excludeCountry(itinerary) {
      var result = true
      for (var i = 0; i<changedState.excluded.length; i++) {
        if (itinerary.countries.indexOf(changedState.excluded[i]) >= 0) {
          result = false
        }
      }
      return result 
    }
    var newResults = this.state.data.filter(excludeCountry)
    var invalidDuration = this.state.excludedByDuration
    newResults = newResults.diff(invalidDuration)
    debugger;
    changedState.results = newResults
    changedState.current = newResults[0]
    this.setState(changedState)
  },
  filterDurations: function(startPoint, endPoint, element) {
    function durationCheck (itinerary){
      if (itinerary.duration >= startPoint && itinerary.duration <=endPoint){
        return true
      } else {
        return false
      } 
    }
    if (element.target.checked == false) {
      var itineraries = this.state.results
      var durations = itineraries.map(function(itinerary){
        return itinerary.cities.length
      })
      for (var i=0; i<durations.length; i++) {
        itineraries[i].duration = durations[i]
      }
      var excludedItineraries = itineraries.filter(durationCheck)
      var currentResults = itineraries.diff(excludedItineraries)
    } 
    else if (element.target.checked == true){
      var currentResults = this.state.results
      var excludedItineraries = this.state.excludedByDuration
      var reinclude = excludedItineraries.filter(durationCheck)
      excludedItineraries = excludedItineraries.diff(reinclude)
      for (var i = 0; i<reinclude.length; i++){
        currentResults.push(reinclude[i])
      }
    }
    this.setState({
      results: currentResults,
      excludedByDuration: excludedItineraries
    })
  },
  changeCurrent: function(e) {
    var num = e.target.id
    var chosenItin = this.state.results[num]
    this.setState({
      current: chosenItin
    });
  },
  render: function() {
    return (
      <div className="tripPlanner">
        <h1>Itineraries</h1>
        <div className="row">
          <div className="large-3 columns">
            <ItinFilters data={this.state.data} filterCountries={this.filterCountries} filterDurations={this.filterDurations}/>
          </div>
          <div className="large-3 columns itin-list">
            <ItinList data={this.state.results} changeCurrent={this.changeCurrent} />
          </div>
          <div className="large-6 columns">
            <ItinDetails data={this.state.current}/>
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
            <a href="#" id={i} onClick={that.props.changeCurrent} className="button info round">See Details</a>  
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
      var itin = this.props.data
      return (
        <Itinerary key={itin.id}>
            <h2>Details</h2>
              <ItinCityDetails data={itin}/>
          </Itinerary>
      );
    }
    return (
      <div className="cityList">
        {itin} 
      </div>
    );
  }
});

var Itinerary = React.createClass({
  render: function() {
    return (
      <div className="itin">
        <ul className="itin-body">
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
        var date = i+1
        return(
          <li>
            Day {date} - {itin}
          </li>
        )
      })
    }
    return (
      <div className="cityList">
        <ul className = "cities">
          {details}
        </ul> 
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
        <ul className="cities">
          {details}
        </ul> 
      </div>
    )
  }
})

var ItinFilters = React.createClass({
  onChange: function(e, f, g) {
    debugger;
    if (f){
      this.props.filterDurations(e, f, g);
    } else {
      this.props.filterCountries(e);
    }
  },
  render: function() {
    var countries = []
    this.props.data.map(function(itin){
      itin.countries.map(function(country){
        countries.push(country.trim())
      })
    })
    var unique = $.unique(countries).sort()
    var that = this
    var country_list = unique.map(function(country){
      return (
        <div>
          <input value={country} type="checkbox" onChange={that.onChange} defaultChecked /><label for={country}>{country}</label><br />
        </div>
      )
    })
    return (
      <div>
        <form>
          <h3>Countries</h3>
          {country_list}
          <h3>Duration</h3>
          <input type="checkbox" onChange={this.onChange.bind(this, 1, 7)} defaultChecked /><label for="7">One Week</label><br />
          <input type="checkbox"  onChange={this.onChange.bind(this, 8, 14)} defaultChecked/><label for="14">Two Weeks</label><br />
          <input type="checkbox"  onChange={this.onChange.bind(this, 15, 21)} defaultChecked/><label for="21">Three Weeks</label><br />
          <input type="checkbox" defaultChecked  onChange={this.onChange.bind(this, 22, 100)}/><label for="28">Four Weeks +</label>
        </form>
      </div>
    )
  }
});