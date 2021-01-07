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
import { clearErrors } from "../../../actions/errorActions";

class EmailModal extends Component {
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
    this.props.onSubmit(e, 'email', this.toggle, this.setMsg);
  };
  // 	//Attempt to login
  // 	this.props.login(user);
  // }

  render() {
    return (
      <Fragment>
        <Button onClick={this.toggle} href="#" className="btn-sm float-right">
          Update
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Update Email</ModalHeader>
          <ModalBody>
          {this.props.error.msg ? (
              <Alert color="danger">{this.props.error.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="mb-3"
                  onChange={this.props.onChange}
                />
                <Button
                  color="dark"
                  style={{ marginTop: "2rem" }}
                  block
                  href="#"
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

export default connect(mapStateToProps, { clearErrors })(EmailModal);
