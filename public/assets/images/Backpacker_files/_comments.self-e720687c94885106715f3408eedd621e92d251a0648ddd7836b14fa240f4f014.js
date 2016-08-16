var Comments = React.createClass({
  displayName: "Comments",

  renderComments: function () {
    return this.props.comments.map(function (comment) {
      return React.createElement(
        "div",
        { key: comment.id },
        comment.content
      );
    });
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "comments-box" },
      this.renderComments()
    );
  }
});
