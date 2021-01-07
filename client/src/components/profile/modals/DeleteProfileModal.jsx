import React, { Component, Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  ModalFooter
} from "reactstrap";
import { connect } from "react-redux";

class DeleteProfileModal extends Component {
  state = {
    msg: null,
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.toggle();
  };

  render() {
    return (
      <Fragment>
        <Button onClick={this.toggle} href="#" color="danger">
          Delete Profile
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Delete Profile</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
            <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            
            Are you sure you want to delete your profile?
          </ModalBody>
            
            <ModalFooter>
              <div>
                <Button onClick={this.toggle}>
                  Cancel
                </Button>
                {' '}
                <Button color="danger" onClick={this.props.onDelete}>
                  Delete
                </Button>
              </div>
            </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(DeleteProfileModal);
