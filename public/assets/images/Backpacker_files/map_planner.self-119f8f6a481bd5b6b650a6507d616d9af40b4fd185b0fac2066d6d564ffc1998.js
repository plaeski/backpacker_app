var TripPlanner = React.createClass({
  displayName: 'TripPlanner',

  loadCitiesFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: (function (data) {
        this.setState({ data: data });
      }).bind(this),
      error: (function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }).bind(this)
    });
  },
  handleCitySubmit: function (comment) {
    if (this.state.data) {
      var locations = this.state.data;
      if (locations.route_details) {
        var city = locations.route_details.map(function (city) {
          return city.text;
        });
        var newLocation = locations.route_details.concat([comment]);
        locations.route_details = newLocation;
      } else {
        var newLocation = comment;
        locations.route_details = [newLocation];
      }
      this.setState({ data: locations });
      $.ajax({
        url: '/trip_route/update',
        dataType: 'json',
        type: 'POST',
        data: locations,
        success: (function (data) {
          this.setState({ data: data });
        }).bind(this),
        error: (function (xhr, status, err) {
          this.setState({ data: locations });
          console.error(this.props.url, status, err, toString());
        }).bind(this)
      });
    }
  },
  getInitialState: function () {
    return { data: [] };
  },
  componentWillMount: function () {
    this.loadCitiesFromServer();
  },
  removeCity: function (e) {
    var id = e.target.id;
    var listData = this.state.data;
    listData.item_id = id;
    $.ajax({
      url: '/trip_route/stop/delete',
      dataType: 'json',
      type: 'POST',
      data: listData,
      success: (function (data) {
        this.setState({ data: data });
      }).bind(this),
      error: (function (xhr, status, err) {
        this.setState({ data: locations });
        console.error(this.props.url, status, err, toString());
      }).bind(this)
    });
  },
  render: function () {
    return React.createElement(
      'div',
      { className: 'tripPlanner' },
      React.createElement(
        'h1',
        null,
        'Cities'
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'large-8 column' },
          React.createElement(MapBox, { className: 'map-route', data: this.state.data.route_details })
        ),
        React.createElement(
          'div',
          { className: 'large-4 column' },
          React.createElement(CityList, { data: this.state.data, removeCity: this.removeCity }),
          React.createElement(CityForm, { onCommentSubmit: this.handleCitySubmit })
        )
      )
    );
  }
});
var MapBox = React.createClass({
  displayName: 'MapBox',

  createMap: function (cities) {
    var map = new GMaps({
      div: '#map',
      lat: 41.9000,
      lng: 0.4000,
      width: '600px',
      height: '500px',
      zoom: 5
    });
    var coordinates = cities.map(function (city) {
      return [city.lat, city.lng];
    });
    for (var i = 0; i < coordinates.length; i++) {
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
  componentDidUpdate: function () {
    if (this.props.data) {
      var cities = this.props.data.map(function (city) {
        return city;
      });
      this.createMap(cities);
    }
  },
  componentDidMount: function () {
    var map = new GMaps({
      div: '#map',
      lat: 41.9000,
      lng: 0.4000,
      width: '600x',
      height: '500px',
      zoom: 2
    });
  },
  render: function () {
    return React.createElement('div', { id: 'map' });
  }
});

var CityList = React.createClass({
  displayName: 'CityList',

  render: function () {
    if (this.props.data.route_details) {
      var that = this;
      var cityNodes = this.props.data.route_details.map(function (city, i) {
        return React.createElement(
          City,
          { key: city.id },
          city.text,
          ' ',
          React.createElement(
            'div',
            { id: i, onClick: that.props.removeCity },
            'x'
          )
        );
      });
    }
    return React.createElement(
      'div',
      { className: 'cityList' },
      cityNodes
    );
  }
});
var CityForm = React.createClass({
  displayName: 'CityForm',

  getInitialState: function () {
    return { text: '' };
  },
  handleTextChange: function (e) {
    this.setState({ text: e.target.value });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    var that = this;
    GMaps.geocode({
      address: text,
      callback: function (results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;
          var lat = latlng.lat();
          var lng = latlng.lng();
          that.props.onCommentSubmit({ text: text, lat: lat, lng: lng });
          that.setState({ text: '' });
        }
      }
    });
  },
  render: function () {
    return React.createElement(
      'div',
      { className: 'CityForm' },
      React.createElement(
        'form',
        { className: 'CityForm', onSubmit: this.handleSubmit },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Enter City Name',
          value: this.state.text,
          onChange: this.handleTextChange
        }),
        React.createElement('input', { type: 'submit', className: 'button small', value: 'Post' })
      )
    );
  }
});

var City = React.createClass({
  displayName: 'City',

  render: function () {
    return React.createElement(
      'div',
      { className: 'comment' },
      React.createElement(
        'ul',
        { className: 'comment-body' },
        React.createElement(
          'li',
          null,
          this.props.children
        )
      )
    );
  }
});
