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
          current: data[0]
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleItinerarySave: function() {
    var data = this.state.current
    var itinId = this.state.current.id
    data.trip_id = itinId
    var tripId = this.props.trip
    var url = "/trip/" + tripId
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'PATCH',
      data: this.state.current,
      success: function(data) {
        window.location.href = data.redirect;
      },
      error: function(xhr, status, err) {
        console.error(this.props.url,status,err,toString());
      }
    });
  },
  getInitialState: function() {
    return {results: [], data: [], excluded:[], excludedByDuration: [], "itin-list": false, "itin-display": false, "itin-filters": false};
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
      current: chosenItin,
      "itin-list": true
    });
  },
  collapse: function(area) {
    var status = this.state[area];
    return function() {
      console.log(this.state)
      var newStatus = (status===true) ? false : true
      var obj = {}
      obj[area] = newStatus;
      this.setState(obj)
    }.bind(this)
  },
  render: function() {
    return (
      <div className="tripPlanner">
        <div className="trip-planner-container">
        <h1>Itineraries</h1>
        <div className="row itineraries-row">
          <div id="itin-filters" className={"large-3 columns itin-filters " + (this.state["itin-filters"] ? "itin-section-closed" : "")}>
            <ItinFilters sectionClosed={this.state["itin-filters"]} data={this.state.data} filterCountries={this.filterCountries} filterDurations={this.filterDurations}/>
          </div>
          <div className="collapse-itin" onClick={this.collapse("itin-filters")}><i className={(this.state["itin-filters"] ? "fa fa-angle-double-down" : "fa fa-angle-double-up")}></i></div>
          <div className={"large-4 columns itin-list " + (this.state["itin-list"] ? "itin-section-closed" : "")} id="itin-list">
            <ItinList sectionClosed={this.state["itin-list"]} data={this.state.results} changeCurrent={this.changeCurrent} />
          </div>
          <div className="collapse-itin" onClick={this.collapse("itin-list")}><i className={(this.state["itin-list"] ? "fa fa-angle-double-down" : "fa fa-angle-double-up")}></i></div>
          <div className={"large-5 columns itin-display " + (this.state["itin-display"] ? "itin-section-closed" : "")} id="itin-display">
            <ItinDetails sectionClosed={this.state["itin-display"]} data={this.state.current} handleItinerarySave={this.handleItinerarySave}/>
          </div>
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
            <a href="#" id={i} onClick={that.props.changeCurrent} className="button success round itin-change-button">See Details</a>
            <hr />
          </Itinerary>
        );
      });
    }
    return (
      <div className={"cityList " + (this.props.sectionClosed ? "itin-section-closed" : "")}>
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
              <a href="#" onClick={this.props.handleItinerarySave} className="button success round itin-save-button">Save Itinerary</a>
          </Itinerary>
      );
    }
    return (
      <div className={"cityList " + (this.props.sectionClosed ? "itin-section-closed" : "")}>
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
          <li key={i}>
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
          itin+" "
        )
      })
    }
    return (
      <div className="cityList">
          Countries: {details}
      </div>
    )
  }
})

var ItinFilters = React.createClass({
  onChange: function(e, f, g) {
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
        <div key={country}>
          <input value={country} type="checkbox" className="checkbox-custom" onChange={that.onChange} defaultChecked /><label for={country} className="filter-label">{country}</label><br />
        </div>
      )
    })
    return (
      <div className={(this.props.sectionClosed ? "itin-section-closed" : "")}>
        <form>
          <div className="row">
            <div className="filter-block"><a href="#countries">Countries</a></div>
            <div className="filter-block"><a href="#duration">Duration</a></div>
          </div>
          <h2 className="filter-section">Countries</h2>
            <div id="countries">
              {country_list}
            </div>
          <h2 className="filter-section">Duration</h2>
            <div id="duration">
              <input type="checkbox" className="checkbox-custom" onChange={this.onChange.bind(this, 1, 7)} defaultChecked /><label for="7" className="filter-label">One Week</label><br />
              <input type="checkbox" className="checkbox-custom" onChange={this.onChange.bind(this, 8, 14)} defaultChecked/><label for="14" className="filter-label">Two Weeks</label><br />
              <input type="checkbox" className="checkbox-custom" onChange={this.onChange.bind(this, 15, 21)} defaultChecked/><label for="21" className="filter-label">Three Weeks</label><br />
              <input type="checkbox" className="checkbox-custom" defaultChecked  onChange={this.onChange.bind(this, 22, 100)}/><label for="28" className="filter-label">Four Weeks +</label>
              </div>
        </form>
      </div>
    )
  }
});
