import React from "react";
import { ListGroup, ListGroupItem, Button, Badge } from "reactstrap";
import { Chat } from "./chat";

export const ContactList = (props) => {
  return (
    <ListGroup>
      {props.connections ? (
        props.connections.map((connection, index) => {
          if (!props.chat) {
            if (connection.onlineStatus === 1) {
              return (
                <ListGroupItem key={index} variant="flush">
                  {connection.username} - <Badge color="success">Online</Badge>
                  <Button
                    className="btn-sm float-right"
                    onClick={() => {
                      props.startChat(index);
                    }}
                  >
                    Message
                  </Button>
                </ListGroupItem>
              );
            } else {
              return (
                <ListGroupItem key={index} variant="flush">
                  {connection.username} - <Badge color="secondary">Offline</Badge>
                </ListGroupItem>
              );
            }
          } else {
            if (connection.isActivated)
              return (
                <Chat
                  resetChat={props.resetChat}
                  messages={connection.messages}
                  handleInputChange={props.handleInputChange}
                  handleSubmit={props.handleSubmit}
                  username={connection.username}
                  index={index}
                  user={connection}
                  msg={props.msg}
                  auth={props.auth}
                  key={index}
                />
              );
            else {
              return null;
            }
          }
        })
      ) : (
        'No Contacts'
      )}
    </ListGroup>
  );
};
