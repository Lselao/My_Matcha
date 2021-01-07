import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { ListGroup, ListGroupItem, UncontrolledPopover, PopoverBody, PopoverHeader, NavLink } from "reactstrap";
import { useSelector } from "react-redux";

export const History = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <Fragment>
      <NavLink id="history_popover">
        {window.innerWidth > 576 ?
          <i className="fa fa-history" aria-hidden="true"></i>:
          'History'
        }
      </NavLink>
      <UncontrolledPopover  trigger="legacy"  placement="bottom" target="history_popover" >
        <PopoverHeader>History</PopoverHeader>
        <PopoverBody>
          <ListGroup>
            {user.pageViewHistory.length !== 0 ? 
            user.pageViewHistory.map(({ username, id }, index) => {
              return (
                <ListGroupItem
                  tag={Link}
                  to={`/profile/${id}`}
                  className="historyItem"
                  key={index}
                >
                  {username}
                </ListGroupItem>
              );
            }) : 'Empty'
          }
          </ListGroup>
        </PopoverBody>
      </UncontrolledPopover >
    </Fragment>
  );
};
