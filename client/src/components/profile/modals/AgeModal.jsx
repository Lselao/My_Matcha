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

class AgeModal extends Component {
  state = {
    modal: false,
    age: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  setMsg = (error) =>{
    this.setState(error)
  }

  toggle = () => {
    //Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,
    });
  };
  onSubmit = (e) => {
    this.props.onSubmit(e, 'age', this.toggle, this.setMsg);
  };

  render() {
    return (
      <Fragment>
        <Button onClick={this.toggle} href="#" className="btn-sm float-right">
          Update
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Update Age</ModalHeader>
          <ModalBody>
            {this.props.error.msg ? (
              <Alert color="danger">{this.props.error.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="age">Age</Label>
                <Input
                  type="number"
                  name="age"
                  id="age"
                  placeholder="Age"
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

export default connect(mapStateToProps, { clearErrors })(AgeModal);
