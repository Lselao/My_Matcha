import React from "react";
// import "../../Styles/chat.css";
import {
  NavLink,
  Button
} from "reactstrap";

export const ChatIcon = (props) => {
  return (
    !props.fromProfile ?  
    <NavLink onClick={props.activateChat}>
      <i className="fa fa-comment"></i>
    </NavLink>:
    <Button onClick={props.activateChat} style={{width: "100px"}}outline color="primary" className="btn-sm m-1">
      Chat
    </Button> 
  );
};
