var Comments = React.createClass({

  renderComments: function() {
    return this.props.comments.map(function(comment){
      return (
        <div key={ comment.id }>
          {comment.content}
        </div>
      )
    })
  },
  render: function() {
    return (
      <div className="comments-box">
        { this.renderComments() }
      </div>
    )
  }
});

