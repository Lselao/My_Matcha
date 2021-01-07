import React, { Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Alert
} from "reactstrap";
import { useState } from "react";
import { useEffect } from "react";
import { getLocations, updateLocation } from "../../../actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const AddressModal = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [avaliableLocations, setAvaliableLocations] = useState(null)
  const user = useSelector((state) => state?.auth?.user);
  const token = useSelector((state) => state?.auth?.token);
  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() =>{
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const findLocations = async () =>{
      try{
        setAvaliableLocations(await getLocations(source));
      }
      catch(err){
        if (axios.isCancel(err)) {
          
        }
      }
    }
    findLocations();

    return () => {
      source.cancel();
    };
  }, [])

  const onChange = (e) => {
    setLocation(e.target.value);
  };

  const onSubmit = async(e) => {
    if (location) {
      const updatedUser = {...user};
      dispatch(await updateLocation(updatedUser, location, token));
      toggle();
    }
    else {
      setMsg('please set a location')
    }

  };

  return (
    <Fragment>
      <Button onClick={toggle} href="#" className="btn-sm float-right">
        Update
        </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Update Address</ModalHeader>
        <ModalBody>
          {msg ? (
            <Alert color="danger">{msg}</Alert>
          ) : null}
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Input type="select" defaultValue={user.location.id} onChange={onChange}>
                {avaliableLocations
                ?
                (avaliableLocations.map((avaliableLocation) => (
                    (<option key={avaliableLocation.id} value={avaliableLocation.id}>{avaliableLocation.locationName}</option>) 
                  ))
                  )
                :
                (null)
              }
              </Input>
              <Button
                color="dark"
                style={{ marginTop: "2rem" }}
                block
                href="#"
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

export default AddressModal;
