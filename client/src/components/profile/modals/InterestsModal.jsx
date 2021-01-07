import React, { Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { updateInterests, deleteInterest } from "../../../actions/authActions";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const InterestsModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState('');
  const [interest, setInterest] = useState('');
  const dispatch = useDispatch();

  const toggle = () => {
    setModal(!modal);
  };

  const removeTag =  async(e, interestId) => {
    const index = e.target.id;
    let userObj = {...user};
    userObj.interests.splice(index, 1);
    try{
      dispatch(await deleteInterest(interestId, userObj, token))
      setMsg('');
    }
    catch(err){
      setMsg(err.response.data.message)
    }
  }

  const onChange = (e) => {
    setInterest( e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!interest || interest === '' || !/^[a-zA-Z]+$/.test(interest)){
      setMsg('Please enter a valid interest');
      setInterest('');
    }
    else{
      let updatedUser = {...user};
      try{
        dispatch(await updateInterests(interest, updatedUser, token));
        setMsg('')
      }
      catch(err){
        setMsg(err.response.data.message)
      }
      finally{
        setInterest('')
      }
    }
  };

  return(
      <Fragment>
        <Button onClick={toggle} href="#" className="btn-sm float-right">
          Update
        </Button>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Update Interests</ModalHeader>
          <ModalBody>
            {msg ? (
              <Alert color="danger">{msg}</Alert>
            ) : null}
            <Form onSubmit={onSubmit}>
              <FormGroup>
                <Label for="interests">Interests</Label>
                  <ul className="list-group" style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                    {
                      user.interests.map((tag, index) => (
                      <li key={index}  id={index} className="btn btn-secondary btn-sm" style={{margin: "5px"}}>
                        {tag.interest}
                        <svg id={index} onClick={(e) => removeTag(e, tag.interestId)}  className="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clipRule="evenodd"/>
                          <path fillRule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clipRule="evenodd"/>
                        </svg>
                      </li>
                      ))
                    }
                  </ul>
                  <Input
                    type="text"
                    name="interest"
                    id="interest"
                    placeholder="Interests"
                    className="mb-3"
                    onChange={onChange}
                    value={interest}
                  >
                  </Input>
                <Button
                  color="dark"
                  style={{ marginTop: "2rem" }}
                  block
                  onClick={onSubmit}
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
  
export default InterestsModal
