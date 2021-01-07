import React, { Component, Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Alert,
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { clearErrors, returnErrors } from "../../../actions/errorActions";
import axios from "axios";

class ProfilePicModal extends Component {
  state = {
    modal: false,
    fistName: "",
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
  onChange = (e) => {
    this.setState({ isLoading: true });
    const fd = new FormData();
    const file = e.target.files[0];

    fd.append("image", file, file.name);
    var reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (e) => {
      document.getElementById("preview").src = e.target.result;
      document.getElementById("preview").style.display = "block";
      this.setState({ isLoading: false });
    };

    this.setState({ fileData: fd });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const fd = this.state.fileData;
    if (fd) {
      this.setState({ isLoading: true, msg: "" });
      fd.append("userId", this.props.userId);
      axios
        .post(`/profilePicUpload`, this.state.fileData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          const { picId, picUrl } = response.data;
          this.props.setProfileImage({ picId, picUrl });
          this.setState({ isLoading: false });
          this.toggle();
        }).catch((err) =>{
          this.props.returnErrors(err.response.data, err.response.status)
          this.setState({ isLoading: false });
        });
    } else {
      this.props.returnErrors('Please upload an image.', 400);
    }
  };

  render() {
    return (
      <Fragment>
        <Button
          outline
          onClick={this.toggle}
          className="btn-sm"
          style={{ width: "100px", marginTop: 10 }}
        >
          Update
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Update Profile Picture</ModalHeader>
          <ModalBody>
            {this.props.error.msg ? (
              <Alert color="danger">{this.props.error.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <div>
                  {this.state.isLoading === true && (
                    <div className="loader"></div>
                  )}
                  <img
                    style={{ width: "100%", display: "none" }}
                    id="preview"
                    src=""
                    alt="preview"
                  />
                  <input
                    type="file"
                    name="picture"
                    onChange={this.onChange}
                    id=""
                  />
                </div>
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

export default connect(mapStateToProps, { clearErrors, returnErrors })(ProfilePicModal);
