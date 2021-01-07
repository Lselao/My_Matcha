import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Media,
  Button,
  Badge,
} from "reactstrap";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsLiked,
  postLike,
  blockUser,
  postDislike,
  getIsBlocked,
  getIsReported,
  reportUser
} from "../../actions/profileActions";
import  userSocket from "../../helpers/socket";
import {Details} from './Details'
import Message  from "../nav/message/index";

export const OtherUserProfile = () => {
  const [isLiked, setIsLiked] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.user);
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState({});
  const [isReported, setIsReported] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isBlockedBy, setIsBlockedBy] = useState(false);
  const [visitedUser, setVisitedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const dispatch = useDispatch();

  const sendLike = () => {
    postLike(currentUser, visitedUser, isBlockedBy, auth.token).then(() => {
      setIsLiked(true);
    });
  };
  const sendDislike = () => {
    postDislike(currentUser, visitedUser, isBlockedBy, auth.token).then(() => {
      setIsLiked(false);
    });
  };

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    async function getVisitedUser() {
      try{
        setIsBlocked(await getIsBlocked(currentUser.id, id, source))
        setIsBlockedBy(await getIsBlocked(id, currentUser.id, source))
        setIsReported(await getIsReported(currentUser.id, id, source))
        setVisitedUser(await (await Axios.get(`/getUser/${id}`, { cancelToken: source.token })).data); 
      }
      catch(err){
      }
    }

    if (currentUser)
    getVisitedUser();
    
    return () => {
      source.cancel();
    };
  }, [id, currentUser]);
  
  const onBlock = async(e) =>{
    e.preventDefault();
    const mainSocket = await userSocket(user.id);
    await blockUser(currentUser.id, visitedUser.id, auth.token)
    mainSocket.emit('updateAll');
    mainSocket.emit('notification send', `${currentUser.username} has blocked you and you are disconnected`, visitedUser);
    setIsBlocked(true);
  }
  const onReport = async(e) =>{
    e.preventDefault();
    await reportUser(currentUser.id, visitedUser.id, auth.token)
    setIsReported(true);
  }
  
  useEffect(() => {

    async function fetchData() {
      if (currentUser && visitedUser) {
        const mainSocket = await userSocket(currentUser.id);
        if(!isBlockedBy){
          mainSocket.emit('notification send', `${currentUser.username} viewed your profile`, visitedUser, currentUser.id);
        }
        if (
          (await getIsLiked(currentUser.id, visitedUser.id))
        ) {
          setIsLiked(true);
        }
        // (await getIsConnection(currentUser.id, visitedUser.id))          
        //TODO add message button if connection
        if (currentUser.pageViewHistory.length > 5) {
          currentUser.pageViewHistory.shift();
        } else if (currentUser.pageViewHistory.length >= 0) {
          currentUser.pageViewHistory.unshift({
            id: visitedUser.id,
            username: visitedUser.username,
          });
          dispatch({
            type: "USER_UPDATE",
            payload: currentUser,
          });
        }
        setUser(visitedUser);
        setIsLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser, visitedUser]);
  return isLoading ? (
    <div className="loader"></div>
  ) : (
    <Container>
      {isAuthenticated ? (
        <Card>
          <CardTitle className="mt-1 text-center">
            <strong>{`${user.firstName}'s Profile`}</strong>
            {" "}
            {user.onlineStatus ? 
              <Badge href="#" color="success">Online</Badge>
            :
              <p><small><b>Last seen:</b> {user.lastSeen}</small></p>
            }
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
              alt="profilePic"
            />
          </Media>
          <ListGroupItem>
            {!isLiked ? (
              <Button style={{width: "100px"}} outline color="primary" className="btn-sm m-1" onClick={sendLike}>
                Like
              </Button>
            ) : (
              <Button style={{width: "100px"}} outline className="btn-sm m-1" onClick={sendDislike}>Unlike</Button>
            )}
              <Message auth={auth} fromProfile={true}/>
              {isBlocked 
              ? (<Button className="btn-sm btn-danger m-1 float-right" >Blocked <i className="fa fa-ban red" aria-hidden="true"></i></Button>): 
              (<Button className="btn-sm btn-danger m-1 float-right" onClick={onBlock}>Block <i className="fa fa-ban red" aria-hidden="true"></i></Button>)
              }
              {isReported
              ? (<Button className="btn-sm btn-danger m-1 float-right">Reported <i className="fa fa-ban red" aria-hidden="true"></i></Button>): 
              (<Button outline color="danger" className="btn-sm m-1 float-right" onClick={onReport}>Report <i className="fa fa-ban red" aria-hidden="true"></i></Button>)
              }

          </ListGroupItem>
          <Details user={user}></Details>
          <ListGroup>
            <ListGroupItem>
              <strong>First Name:</strong> {user.firstName}
            </ListGroupItem>
            <ListGroupItem>
              <strong>Last Name:</strong> <span>{user.lastName}</span>
            </ListGroupItem>
            <ListGroupItem>
              <strong>Username:</strong> <span>{user.username}</span>
            </ListGroupItem>
            {/* <ListGroupItem>
              <strong>Email:</strong> <span>{user.email}</span>
            </ListGroupItem> */}
            <ListGroupItem>
              <strong>Bio:</strong> <span>{user.bio}</span>
            </ListGroupItem>
            <ListGroupItem>
              <strong>Gender:</strong> <span>{user.gender}</span>
            </ListGroupItem>
            <ListGroupItem>
              <strong>Sexual Preferece:</strong> <span>{user.sexualPref}</span>
            </ListGroupItem>
            <ListGroupItem>
              <strong>Interests:</strong>
              {user.interests &&
                    user.interests.map((item, index) => {
                      if (index === user.interests.length - 1)
                        return <span key={item.interestId}>{item.interest}</span>;
                      else return <span key={item.interestId}>{item.interest}, </span>;
                    })}
            </ListGroupItem>
            <ListGroupItem>
              <strong>Pictures:</strong>
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
                        ></img>
                      </div>
                    );
                  })}
              </div>
            </ListGroupItem>
          </ListGroup>
        </Card>
      ) : null}
    </Container>
  );
};
