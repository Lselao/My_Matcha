import React, { Fragment } from "react";
import {Input, Button, ListGroup, ListGroupItem, Form, FormGroup, Alert} from "reactstrap";

export const Chat = (props) => {
  const onSubmit =  (e) => {
    e.preventDefault();
    props.handleSubmit(e, props.user);
  }

  return(
    <Fragment>
      <ListGroup>
        <ListGroupItem>
          Chat with {props.user.username}
        </ListGroupItem>

        <ListGroupItem style={{maxHeight: 200, overflowY: "auto"}}>
            {props.messages[0] ? (
              props.messages.map((message, index) => {
                return (
                  <div key={index} className="border rounded p-1 m-1">
                    {props.auth.user.username === message.user ?(
                      <img src={props.auth.user.profilePic.picUrl} alt=""
                        style={{width: 25}}
                        className="border rounded"
                        />
                      ): 
                      <img src={props.user.picUrl} alt=""
                        style={{width: 25}}
                        className="border rounded"
                      />}
                      <span style={{paddingLeft: 10}}><b>{message.user}</b> - {message.message}</span>
                    </div>
                );
              })) : <Alert color="dark" style={{textAlign:"center"}}>No Messages</Alert>
            }
        </ListGroupItem>
        
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Input onChange={props.handleInputChange} placeholder="Enter your message" value={props.msg}/>
          </FormGroup>
        <div style={{paddingTop: 10}}>
          <Button onClick={() => {
              props.resetChat(props.index);
            }} type="button" style={{width: 100}}>Back</Button>
            {props.msg ? 
            <Button onSubmit={onSubmit} style={{width: 100}}className="float-right">Send</Button>:
            <Button style={{width: 100}}className="float-right" disabled>Send</Button>
            }
        </div>
        </Form>
      </ListGroup>
    </Fragment>
  )
};
