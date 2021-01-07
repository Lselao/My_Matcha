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
import { imageUpload } from "../../../actions/profileActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { clearErrors, returnErrors } from "../../../actions/errorActions";

class PictureModal extends Component {
  state = {
    modal: false,
    isLoading: false,
    images: [],
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    returnErrors: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,

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

  onSubmit = async(e) => {
    const fd = this.state.fileData;
    if (fd) {
        this.setState({ isLoading: true, msg: "" });
        fd.append("userId", this.props.userId);
        try{
          const response = await imageUpload(this.state.fileData, this.props.auth.token);
          const { secure_url, public_id } = response.data;
          this.setState({ isLoading: false });
          this.props.setImage({ picId: public_id, picUrl: secure_url });
          this.setState({fd: {fileData: null}})
          this.toggle();
        }
        catch(err){
        this.setState({ isLoading: false});
        this.setState({fileData: null})
        this.props.returnErrors(err.data, err.status)
      }
    }
    else{
      this.props.returnErrors('Please enter a picture', 400)
    }
      
  };

  removeImage = (id) => {
    this.setState({
      images: this.state.images.filter((image) => image.public_id !== id),
    });
  };

  render() {
    return (
      <Fragment>
        <Button onClick={this.toggle} className="btn-sm float-right">
          Update
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Upload Pictures</ModalHeader>
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
  auth: state.auth
});

export default connect(mapStateToProps, { clearErrors, returnErrors })(PictureModal);
