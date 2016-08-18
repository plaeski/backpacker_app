Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
};

var ItineraryExplorer = React.createClass({
  displayName: 'ItineraryExplorer',

  loadCitiesFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: (function (data) {
        this.setState({
          data: data,
          results: data,
          current: data[0]
        });
      }).bind(this),
      error: (function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }).bind(this)
    });
  },
  handleItinerarySave: function () {
    var data = this.state.current;
    var itinId = this.state.current.id;
    data.trip_id = itinId;
    var tripId = this.props.trip;
    var url = "/trip/" + tripId;
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'PATCH',
      data: this.state.current,
      success: function (data) {
        window.location.href = data.redirect;
      },
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err, toString());
      }
    });
  },
  getInitialState: function () {
    return { results: [], data: [], excluded: [], excludedByDuration: [] };
  },
  componentWillMount: function () {
    this.loadCitiesFromServer();
  },
  filterCountries: function (e) {
    var changedState = {
      excluded: this.state.excluded
    };
    if (e.target.checked == false) {
      changedState.excluded.push(e.target.value);
    } else if (e.target.checked == true) {
      for (var i = 0; i < this.state.excluded.length; i++) {
        var excludedCity = this.state.excluded[i];
        var index = excludedCity.indexOf(e.target.value);
        if (index > -1) {
          var updatedList = this.state.excluded.splice(index, [i]);
          changedState.excluded = updatedList;
        }
      }
    }
    var that = this;
    function excludeCountry(itinerary) {
      var result = true;
      for (var i = 0; i < changedState.excluded.length; i++) {
        if (itinerary.countries.indexOf(changedState.excluded[i]) >= 0) {
          result = false;
        }
      }
      return result;
    }
    var newResults = this.state.data.filter(excludeCountry);
    var invalidDuration = this.state.excludedByDuration;
    newResults = newResults.diff(invalidDuration);
    changedState.results = newResults;
    changedState.current = newResults[0];
    this.setState(changedState);
  },
  filterDurations: function (startPoint, endPoint, element) {
    function durationCheck(itinerary) {
      if (itinerary.duration >= startPoint && itinerary.duration <= endPoint) {
        return true;
      } else {
        return false;
      }
    }
    if (element.target.checked == false) {
      var itineraries = this.state.results;
      var durations = itineraries.map(function (itinerary) {
        return itinerary.cities.length;
      });
      for (var i = 0; i < durations.length; i++) {
        itineraries[i].duration = durations[i];
      }
      var excludedItineraries = itineraries.filter(durationCheck);
      var currentResults = itineraries.diff(excludedItineraries);
    } else if (element.target.checked == true) {
      var currentResults = this.state.results;
      var excludedItineraries = this.state.excludedByDuration;
      var reinclude = excludedItineraries.filter(durationCheck);
      excludedItineraries = excludedItineraries.diff(reinclude);
      for (var i = 0; i < reinclude.length; i++) {
        currentResults.push(reinclude[i]);
      }
    }
    this.setState({
      results: currentResults,
      excludedByDuration: excludedItineraries
    });
  },
  changeCurrent: function (e) {
    var num = e.target.id;
    var chosenItin = this.state.results[num];
    this.setState({
      current: chosenItin
    });
  },
  render: function () {
    return React.createElement(
      'div',
      { className: 'tripPlanner' },
      React.createElement(
        'h1',
        null,
        'Itineraries'
      ),
      React.createElement(
        'div',
        { className: 'row itineraries-row' },
        React.createElement(
          'div',
          { className: 'large-3 columns itin-filters' },
          React.createElement(ItinFilters, { data: this.state.data, filterCountries: this.filterCountries, filterDurations: this.filterDurations })
        ),
        React.createElement(
          'div',
          { className: 'large-4 columns itin-list' },
          React.createElement(ItinList, { data: this.state.results, changeCurrent: this.changeCurrent })
        ),
        React.createElement(
          'div',
          { className: 'large-5 columns itin-display' },
          React.createElement(ItinDetails, { data: this.state.current, handleItinerarySave: this.handleItinerarySave })
        )
      )
    );
  }
});

var ItinList = React.createClass({
  displayName: 'ItinList',

  render: function () {
    if (this.props.data) {
      var that = this;
      var itinNodes = this.props.data.map(function (itin, i) {
        var days = itin.cities.length;
        return React.createElement(
          Itinerary,
          { key: itin.id },
          React.createElement(
            'h4',
            null,
            days,
            ' day itinerary'
          ),
          React.createElement(ItinCountryDetails, { data: itin }),
          React.createElement(
            'a',
            { href: '#', id: i, onClick: that.props.changeCurrent, className: 'button success round itin-change-button' },
            'See Details'
          ),
          React.createElement('hr', null)
        );
      });
    }
    return React.createElement(
      'div',
      { className: 'cityList' },
      itinNodes
    );
  }
});

var ItinDetails = React.createClass({
  displayName: 'ItinDetails',

  render: function () {
    if (this.props.data) {
      var itin = this.props.data;
      return React.createElement(
        Itinerary,
        { key: itin.id },
        React.createElement(
          'h2',
          null,
          'Details'
        ),
        React.createElement(ItinCityDetails, { data: itin }),
        React.createElement(
          'a',
          { href: '#', onClick: this.props.handleItinerarySave, className: 'button success round itin-save-button' },
          'Save Itinerary'
        )
      );
    }
    return React.createElement(
      'div',
      { className: 'cityList' },
      itin
    );
  }
});

var Itinerary = React.createClass({
  displayName: 'Itinerary',

  render: function () {
    return React.createElement(
      'div',
      { className: 'itin' },
      React.createElement(
        'ul',
        { className: 'itin-body' },
        React.createElement(
          'li',
          null,
          this.props.children
        )
      )
    );
  }
});

var ItinCityDetails = React.createClass({
  displayName: 'ItinCityDetails',

  render: function () {
    if (this.props.data) {
      var details = this.props.data.cities.map(function (itin, i) {
        var date = i + 1;
        return React.createElement(
          'li',
          null,
          'Day ',
          date,
          ' - ',
          itin
        );
      });
    }
    return React.createElement(
      'div',
      { className: 'cityList' },
      React.createElement(
        'ul',
        { className: 'cities' },
        details
      )
    );
  }
});

var ItinCountryDetails = React.createClass({
  displayName: 'ItinCountryDetails',

  render: function () {
    if (this.props.data) {
      var details = this.props.data.countries.map(function (itin, i) {
        return itin + " ";
      });
    }
    return React.createElement(
      'div',
      { className: 'cityList' },
      'Countries: ',
      details
    );
  }
});

var ItinFilters = React.createClass({
  displayName: 'ItinFilters',

  onChange: function (e, f, g) {
    if (f) {
      this.props.filterDurations(e, f, g);
    } else {
      this.props.filterCountries(e);
    }
  },
  render: function () {
    var countries = [];
    this.props.data.map(function (itin) {
      itin.countries.map(function (country) {
        countries.push(country.trim());
      });
    });
    var unique = $.unique(countries).sort();
    var that = this;
    var country_list = unique.map(function (country) {
      return React.createElement(
        'div',
        null,
        React.createElement('input', { value: country, type: 'checkbox', className: 'checkbox-custom', onChange: that.onChange, defaultChecked: true }),
        React.createElement(
          'label',
          { 'for': country, className: 'filter-label' },
          country
        ),
        React.createElement('br', null)
      );
    });
    return React.createElement(
      'div',
      null,
      React.createElement(
        'form',
        null,
        React.createElement(
          'h2',
          null,
          'Countries'
        ),
        country_list,
        React.createElement(
          'h2',
          null,
          'Duration'
        ),
        React.createElement('input', { type: 'checkbox', className: 'checkbox-custom', onChange: this.onChange.bind(this, 1, 7), defaultChecked: true }),
        React.createElement(
          'label',
          { 'for': '7', className: 'filter-label' },
          'One Week'
        ),
        React.createElement('br', null),
        React.createElement('input', { type: 'checkbox', className: 'checkbox-custom', onChange: this.onChange.bind(this, 8, 14), defaultChecked: true }),
        React.createElement(
          'label',
          { 'for': '14', className: 'filter-label' },
          'Two Weeks'
        ),
        React.createElement('br', null),
        React.createElement('input', { type: 'checkbox', className: 'checkbox-custom', onChange: this.onChange.bind(this, 15, 21), defaultChecked: true }),
        React.createElement(
          'label',
          { 'for': '21', className: 'filter-label' },
          'Three Weeks'
        ),
        React.createElement('br', null),
        React.createElement('input', { type: 'checkbox', className: 'checkbox-custom', defaultChecked: true, onChange: this.onChange.bind(this, 22, 100) }),
        React.createElement(
          'label',
          { 'for': '28', className: 'filter-label' },
          'Four Weeks +'
        )
      )
    );
  }
});
