import React, { Component, Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { clearErrors, returnErrors } from "../../../actions/errorActions";

class PasswordModal extends Component {
  state = {
    modal: false,
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    returnErrors: PropTypes.func.isRequired

  };

  toggle = () => {
    //Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,
    });
  };

  onSubmit = (e) => {   
      this.props.onSubmit(e, 'password', this.toggle);
  };

  render() {
    return (
      <Fragment>
        <Button onClick={this.toggle} href="#" className="btn-sm float-right">
          Update
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Update Password</ModalHeader>
          <ModalBody>
            {this.props.error.msg ? (
              <Alert color="danger">{this.props.error.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="mb-3"
                  onChange={this.props.onChange}
                />
                <Label for="password2">Re-enter Password</Label>
                <Input
                  type="password"
                  name="password2"
                  id="password2"
                  placeholder="Re-enter Password"
                  className="mb-3"
                  onChange={this.props.onChange}
                />

                <Button
                  color="dark"
                  style={{ marginTop: "2rem" }}
                  block
                  onClick={this.onSubmit}
                  href="#"
                >
                  Update
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
});

export default connect(mapStateToProps, { clearErrors, returnErrors })(PasswordModal);
