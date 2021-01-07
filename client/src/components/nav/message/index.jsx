import React, { Fragment } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import  userSocket from "../../../helpers/socket";
import { useEffect } from "react";
import { getConnections } from "../../../actions/profileActions";
import { ContactList } from "./contactList";
import { ChatIcon } from "./chatIcon";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { useCallback } from "react";
import { reloadUser } from "../../../actions/authActions";
//toDo ADD event to triggert reload of connections

const Message = (props) => {
  const [message, setMessage] = useState("");
  const [openChat, setOpenChat] = useState(false);
  const dispatch = useDispatch();
  const [chat, setChat] = useState(null);
  const user = useSelector((state) => state?.auth?.user);
  const [connections, setConnections] = useState([]);
  const handleSubmit = async(e, toUser) => {
    e.preventDefault();
    const mainSocket = await userSocket(user.id);
    mainSocket.emit("input", message, toUser, user);
    toUser.messages.push({ message, user: user.username });
    setMessage("");
  };

  const activateChat = () => {
    setOpenChat(!openChat);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const resetChat = (index) => {
    endChat(index);
    setChat(null);
  };
  const fetchConnections = useCallback(async () => {
    setConnections(await getConnections(user?.id));
    setChat(null);
  }, [user, setConnections]);

  useEffect(() => {
    if (user){
      fetchConnections();
    } 
  }, [user, fetchConnections]);

  useEffect(() => {
    const doSock = async() => {
      const mainSocket = await userSocket(user.id);
       mainSocket.off('message');
      mainSocket.off('update');
      mainSocket.on("update", () => {
       dispatch(reloadUser());
       fetchConnections();
     });
      mainSocket.on("message", async (message, username) => {
        let connec = [...connections];
        mainSocket.emit('notification send', `${username} has messaged you`, user)
        connec.map((connection) => {
          if (connection.username === username) {
            connection.messages.push({ message, user: username });
          }
          return connection;
        });
        setConnections(connec);
      });
    }
    if (user) {
      doSock();
    }
  }, [ user, connections, dispatch, fetchConnections]);

  const startChat = (index) => {
    const chats = [...connections];
    chats[index].isActivated = true;
    setChat(chats);
  };
  const endChat = (index) => {
    const chats = [...connections];
    chats[index].isActivated = false;
    setChat(chats);
  };

  return user ? (
    openChat ? (
      <Fragment>
        <Modal isOpen={openChat} toggle={activateChat}>
          <ModalHeader toggle={activateChat}>Connections</ModalHeader>
          <ModalBody>
            <ContactList
              startChat={startChat}
              connections={connections}
              chat={chat}
              resetChat={resetChat}
              endChat={endChat}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              msg={message}
              auth={props.auth}
            />
          </ModalBody>
        </Modal>
        <ChatIcon fromProfile={props.fromProfile} activateChat={activateChat}></ChatIcon>
      </Fragment>
    ) : (
      <ChatIcon fromProfile={props.fromProfile} activateChat={activateChat}></ChatIcon>
    )
  ) : null;
};
export default Message;
