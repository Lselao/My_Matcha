import React, { Component, Fragment } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container,
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import RegisterModal from "../auth/RegisterModal";
import Logout from "../auth/Logout";
import LoginModal from "../auth/LoginModal";
import ToProfile from "../profile/ToProfile";
import { changePage } from "../../actions/authActions";
import { History } from "./History";
import { Link } from "react-router-dom";
import Notifications from "./Notifications";
import Message  from "./message/index";

class AppNavbar extends Component {
  state = {
    isOpen: false,
  };

  static propType = {
    auth: PropTypes.object.isRequired,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  toHome = () => {
    this.props.changePage("home");
  };

  render() {
    const { isAuthenticated, user, valid } = this.props.auth;

    const authLinks = (
      <Fragment>
        {valid ? 
          (<Fragment>
            <NavItem>
              <History/>
            </NavItem>
            <NavItem>
              <Message auth={this.props.auth}/>
            </NavItem>
            <NavItem>
              <Notifications/>
            </NavItem>
          </Fragment>) : null
        }
        <NavItem>
          <strong>{user ? <ToProfile /> : ""}</strong>
        </NavItem>
        <NavItem>
          <Logout />
        </NavItem>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <NavItem>
          <RegisterModal />
        </NavItem>
        <NavItem>
          <LoginModal />
        </NavItem>
      </Fragment>
    );

    return (
      <div>
        <Navbar color="dark" dark expand="sm" className="mb-5">
          <Container>
            <NavbarBrand tag={Link} to="/">
              Matcha
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {isAuthenticated ? authLinks : guestLinks}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { changePage })(AppNavbar);
