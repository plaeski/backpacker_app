var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
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
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var city = this.state.data.map(function(city) {
      return (city.text)
    });
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data:data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url,status,err,toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    this.loadCommentsFromServer();
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Cities</h1>
        <MapBox data={this.state.data} />
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
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
    var cities = this.props.data.map(function(city) {
      return city
    });
    this.createMap(cities);
  },
  render: function() {
    return (
      <div id="map">
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function(){
    return {text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
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
      <div className="commentForm">
        <form className="commentForm" onSubmit={this.handleSubmit}>
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
          <li>{this.props.children}</li>
        </ul>
      </div>
    );
  }
});

