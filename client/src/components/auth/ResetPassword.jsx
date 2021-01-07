import React from 'react'
import {
    Container,
    Card,
    CardTitle,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    ListGroup,
    Alert,
    ListGroupItem,
  } from "reactstrap";
import { resetPasswordPost } from "../../actions/authActions";
import { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';
import { returnErrors } from '../../actions/errorActions';
import { checkToken } from '../../actions/profileActions';
import { useHistory, useParams } from 'react-router-dom';


const ResetPassword = (props) => {
    const [password, setPassword] = useState(null);
    const { token } = useParams();
    const history = useHistory();
    const [passwordConfirm, setPasswordConfirm] = useState(null);
    const dispatch = useDispatch();
    const error = useSelector((state) => state.error);
    const onSubmit = async(e) => {
        e.preventDefault();
        try{
            if (password === passwordConfirm){
                await resetPasswordPost(token, password);
                history.push('/');
            }
            else{
                history.push('/')
                dispatch(returnErrors('Passwords do not match', 400));
            }
        }
        catch(err){
            dispatch(returnErrors(err.data, err.status));
        }
    };

    const onChange = (e) => {
        setPassword(e.target.value);
    };
    const onConfirmChange = (e) => {
        setPasswordConfirm(e.target.value);
    };

    useEffect(() =>{
        const checkFunction = async(token)=>{
            try{
                await checkToken(token)
            }
            catch(err){
                history.push('/')
            }
        }
        checkFunction(token);
    })

        return (
            <Container>
                <Card>
                    <CardTitle className="mt-1 text-center">
                        <strong>Reset Password</strong>
                    </CardTitle>
                    <ListGroup>
                 {error?.msg  && error?.msg !== "No token, authorization denied" ?(
                        <Alert color="danger">{error.msg}</Alert>
                    ) : null}
                        <ListGroupItem>
                            <Form onSubmit={onSubmit}>
                                <FormGroup>
                                    <Label for="password">New Password</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="New Password"
                                        className="mb-3"
                                        onChange={onChange}
                                    />
                                    <Label for="password2">Re-enter Password</Label>
                                    <Input
                                        type="password"
                                        name="password2"
                                        id="password2"
                                        placeholder="Re-enter Password"
                                        className="mb-3"
                                        onChange={onConfirmChange}
                                    />

                                    <Button
                                        color="dark"
                                        style={{ marginTop: "2rem" }}
                                        block
                                        onClick={onSubmit}
                                        href="#"
                                    >
                                        Update
                                    </Button>
                                </FormGroup>
                            </Form>
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </Container>
        )
}

export default ResetPassword;