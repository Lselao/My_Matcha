import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { changePage } from "../../actions/authActions";
import { NavLink } from "reactstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class ToProfile extends Component {
  static propType = {
    changePage: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
  };

  render() {
    const { user } = this.props.auth;
    return (
      <Fragment>
          <NavLink tag={Link} to="/profile">Welcome {user.username}</NavLink>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { changePage })(ToProfile);
