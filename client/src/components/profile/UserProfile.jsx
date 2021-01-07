import React, { Component } from "react";
import {
  Container,
  Card,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Media,
  Button,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FirstNameModal from "./modals/FirstNameModal";
import AgeModal from "./modals/AgeModal";
import ProfilePicModal from "./modals/ProfilePicModal";
import PictureModal from "./modals/PictureModal.jsx";
import LastNameModal from "./modals/LastNameModal";
import UsernameModal from "./modals/UsernamModal";
import EmailModal from "./modals/EmailModal";
import PasswordModal from "./modals/PasswordModal";
import InterestsModal from "./modals/InterestsModal";
import store from "../../store";
import { updateUserProfile } from "../../actions/authActions";
import { deleteUser,  updateUserNoReq } from "../../actions/authActions";
import BioModal from "./modals/BioModal.jsx";
import { returnErrors } from "../../actions/errorActions";

import { Details } from './Details';
import GenderModal from "./modals/GenderModal";
import SexualPrefModal from "./modals/SexualPrefModal";
import { imageDelete } from "../../actions/profileActions";
import AddressModal from "./modals/AddressModal";
import DeleteProfileModal from "./modals/DeleteProfileModal";
class UserProfile extends Component {
  state = {
    isOpen: false,
  };
  constructor() {
    super();
    this.deletePhoto = this.deletePhoto.bind(this);
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    returnErrors: PropTypes.func.isRequired

  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  onSubmit = async(e, field = "", toggle, setError) => {
    e.preventDefault();
    if (!this.state.user) {
      this.setState({})
      return this.props.returnErrors('Please Fill out Fields', 400)
    }
    else if (!this.state?.user[field]) {
      this.setState({})
      return this.props.returnErrors('Please Fill out Fields', 400)
    }
    if (field.includes('password'))
    if (this.state.user.password !== this.state.user.password2){
      return this.props.returnErrors('Passwords do not match');
    }
    let user = store.getState().auth.user;
    user = { ...user, ...this.state.user };
    try{
      await this.props.updateUserProfile(user, field, this.props.auth.token);
      this.setState({})
      toggle();
    }
    catch(err){
      this.props.returnErrors(err.data, err.status);
      this.setState({})
    }
  };

  onDelete = (e) => {
    e.preventDefault();
    this.props.deleteUser({ ...this.props.auth.user }, this.props.auth.token);
  }

  deletePhoto = (e) => {
    const { pictures } = this.props.auth.user;
    this.setState({ isLoading: true });
    const index = e.target.id;
    const { picId } = pictures[index];
    imageDelete(picId, this.props.auth.token).then((response) => {
      let user = { ...this.props.auth.user };
      user.pictures.splice(index, 1);
      this.props.updateUserNoReq(user);
      this.setState({ isLoading: false });
    });
  };

  setImage = (image) => {
    const user = { ...this.props.auth.user };
    if (!user?.pictures) {
      user["pictures"] = [];
    }
    user.pictures.push(image);
    this.props.updateUserNoReq(user);
  };

  setProfileImage = (image) => {
    const user = { ...this.props.auth.user };
    if (!user?.profilePic) {
      user["profilePic"] = {};
    }
    user.profilePic = image;
    this.props.updateUserNoReq(user);

  };

  onChange = (e) => {
    this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } });
  };

  test = (index) => {
    let user = { ...this.props.auth.user };
    let id = user.pictures[index.target.id].id;
    const img = document.getElementById(id);
    img.remove();
  };
  render() {
    const { isAuthenticated, user, isLoading, valid } = this.props.auth;
    return (isLoading ? (
      <div className="loader"></div>
    ) : (
        <Container>
          {valid ? null :
            <Alert color="dark">
              Welcome to Matcha!
              <br/>
              <b>Note:</b> You need to fill in all of the fields and add atleast 3 interests to continue.<br/>
              {user.resetToken ? <span><b>Note:</b> Please verify your email address.</span> : null}
            </Alert>
          }
          {isAuthenticated ? (
            <Card>
              <CardTitle className="mt-1 text-center">
                <strong>{`${user.firstName}'s Profile`}</strong>
              </CardTitle>
              <Media
                className="m-auto p-2"
                href="#"
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Media
                  object
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "contain",
                    borderRadius: "50%",
                    border: "2px solid black",
                  }}
                  src={user?.profilePic?.picUrl}
                  alt="wryyy"
                />
                <ProfilePicModal
                  onSubmit={this.onSubmit}
                  onChange={this.onChange}
                  userId={user.id}
                  setProfileImage={this.setProfileImage}
                />
              </Media>
              <Details user={user}></Details>
              <ListGroup>
                <ListGroupItem>
                  <strong>First Name:</strong> {user.firstName}
                  <FirstNameModal
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Last Name:</strong> <span>{user.lastName}</span>
                  <LastNameModal
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Username:</strong> <span>{user.username}</span>
                  <UsernameModal
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Email:</strong> <span>{user.email}</span>
                  <EmailModal onSubmit={this.onSubmit} onChange={this.onChange} />
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Password:</strong> <span>••••••••</span>
                  <PasswordModal
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Age:</strong> <span>{user.age}</span>
                  <AgeModal onSubmit={this.onSubmit} onChange={this.onChange} />
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Bio:</strong> <span>{user.bio}</span>
                  <BioModal onSubmit={this.onSubmit} onChange={this.onChange} />
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Gender:</strong> <span>{user.gender}</span>
                  <GenderModal
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Sexual Preferece:</strong>{" "}
                  <span>{user.sexualPref}</span>
                  <SexualPrefModal
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  <InterestsModal
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                  />
                  <strong>Interests:</strong>{" "}
                  {user.interests &&
                    user.interests.map((item, index) => {
                      if (index === user.interests.length - 1)
                        return <span key={item.interestId}>{item.interest}</span>;
                      else return <span key={item.interestId}>{item.interest}, </span>;
                    })}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Address:</strong>{" "}
                  <span>{user.location.locationName}</span>
                  <AddressModal
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                  />
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Pictures:</strong>
                  <PictureModal
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                    userId={user.id}
                    setImage={this.setImage}
                    pictures={user.pictures}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    {user.pictures &&
                      user.pictures.map((image) => {
                        return (
                          <div
                            key={image.picId}
                            id={image.picId}
                            style={{ border: "1px black solid" }}
                          >
                            <img
                              alt="profile"
                              src={image.picUrl}
                              style={{
                                objectFit: "contain",
                                height: "200px",
                                width: "200px",
                                border: "1px black solid",
                              }}
                            />
                            <Button
                              className="btn-sm"
                              color="danger"
                              id={user.pictures.indexOf(image)}
                              onClick={this.deletePhoto}
                              style={{
                                display: "block",
                                width: "100%",
                                bottom: 0,
                              }}
                            >
                              Delete
                          </Button>
                          </div>
                        );
                      })}
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  <DeleteProfileModal onDelete={this.onDelete} />
                </ListGroupItem>
              </ListGroup>
            </Card>
          ) : null}
        </Container>
      ));
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error
});

export default connect(mapStateToProps, { updateUserProfile, deleteUser, updateUserNoReq, returnErrors })(UserProfile);
