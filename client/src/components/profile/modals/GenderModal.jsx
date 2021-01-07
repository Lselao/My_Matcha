import React, { Component, Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Alert,
} from "reactstrap";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { clearErrors } from "../../../actions/errorActions";

class BioModal extends Component {
  state = {
    modal: false,
    fistName: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  toggle = () => {
    //Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,
    });
  };
  setMsg = (error) =>{
    this.setState(error)
  }

  onSubmit = (e) => {
    this.props.onSubmit(e, 'gender', this.toggle, this.setMsg);
  };

  // 	//Attempt to login
  // 	this.props.login(user);
  // }

  render() {
    return (
      <Fragment>
        <Button onClick={this.toggle} className="btn-sm float-right">
          Update
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Update Gender</ModalHeader>
          <ModalBody>
          {this.props.error.msg ? (
              <Alert color="danger">{this.props.error.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="gender">Choose a Gender:</Label>
                <select
                  name="gender"
                  id="gender"
                  onChange={this.props.onChange}
                  defaultValue="-"
                >
                  <option disabled value="-">
                    {" "}
                    -- select an option --{" "}
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <Button
                  color="dark"
                  style={{ marginTop: "2rem" }}
                  block
                  onClick={this.onSubmit}
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

export default connect(mapStateToProps, { clearErrors })(BioModal);
