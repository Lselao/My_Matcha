import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";
import { NavLink } from "reactstrap";
import PropTypes from "prop-types";

class Logout extends Component {
  static propType = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
  };
  logout = () => {
    this.props.logout(this.props.auth.user.id);
  };

  render() {
    return (
      <Fragment>
        <NavLink onClick={this.logout}>Logout</NavLink>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Logout);
