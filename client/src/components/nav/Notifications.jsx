import React, { Fragment } from "react";
import {
  NavLink,
  UncontrolledPopover,
  PopoverBody,
  PopoverHeader,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { getNotifications } from "../../actions/profileActions";
import  userSocket  from "../../helpers/socket";
import {notificationSet} from "../../actions/authActions";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state?.auth?.user);
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() =>{
    const doSock = async() => {
        const mainSocket = await userSocket(user.id);
        mainSocket.off('notification');
        mainSocket.on('notification', (notification) => {
        setIsChecked(false);
        setNotifications([notification, ...notifications])
      })
    }
    doSock();
  }, [notifications, user])

  useEffect(() => {
    if (user) {
      getNotifications(user.id).then((results) => {
        setNotifications(results);
        if(user.notificationCount)
          setIsChecked(false)
      });
    }
  }, [user]);

  const checkedNotify = async() =>{
    const mainSocket = await userSocket(user.id);
      notificationSet(0, user);
      mainSocket.emit('notification read', user.id)
      setIsChecked(true);
  }

  return (
    <Fragment>
      <NavLink id="notification_popover" onClick={checkedNotify}>
        {window.innerWidth > 576 ? (
          !isChecked ? (
            <i className="fa fa-bell text-danger" aria-hidden="true"></i>
          ) : (
            <i className="fa fa-bell" aria-hidden="true"></i>
          )
        ) : (
          "Notifications"
        )}
      </NavLink>
      <UncontrolledPopover
        trigger="legacy"
        placement="bottom"
        target="notification_popover"
      >
        <PopoverHeader>
          Notifications
        </PopoverHeader>
        <PopoverBody>
          <ListGroup>
            {notifications.length > 0 ? (
                notifications.map((notification, index) =>{
                    return (<ListGroupItem key={index}>{notification.message}</ListGroupItem>)
                })
            ) : (
              "Empty"
            )}
          </ListGroup>
        </PopoverBody>
      </UncontrolledPopover>
    </Fragment>
  );
};

export default Notifications;
