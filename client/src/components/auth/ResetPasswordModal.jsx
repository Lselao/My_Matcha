import React from 'react'
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
} from 'reactstrap';
import {  resetPassword } from '../../actions/authActions';
import { useState } from 'react';

const ResetPasswordModal =  () => {
	const [modal, setModal] = useState(false);
	const [msg, setMsg] = useState(null);
	const [email, setEmail] = useState(null);
	const [success, setSuccess] = useState(null);

	const toggle = () => {
		//Clear errors
		setModal(!modal)
	}

	const onChange = (e) => {
		setEmail(e.target.value);
	}

	const onSubmit = async (e) => {
		e.preventDefault();
		try{
			const res = await resetPassword(email)
			setSuccess(true);
			setMsg(res.message);
		}
		catch(err){
			setSuccess(false);
			setMsg(err.response.data.message);
		}
		finally{
			setEmail(null);
		}
	}

	return (
		<div>
			<Button
				color="link"
				style={{ padding: 0 }}
				type="button"
				onClick={toggle}
			>
				Forgot your password?
				</Button>
			<Modal
				isOpen={modal}
				toggle={toggle}
			>
				<ModalHeader toggle={toggle}>
					Forgot Password
					</ModalHeader>
				<ModalBody>
					{msg ?
						<Alert color={success ? "success" : "danger"}>
							{msg}
						</Alert> : null}
					<Form onSubmit={onSubmit}>
						<FormGroup>
							<Label for="email">Email</Label>
							<Input
								type="email"
								name="email"
								id="email"
								placeholder="Email"
								className="mb-3"
								onChange={onChange}
							/>

							<Button
								color="dark"
								style={{ marginTop: "1rem" }}
								block
							>
								Submit
								</Button>
						</FormGroup>
					</Form>
				</ModalBody>
			</Modal>
		</div>
	)
}

export default ResetPasswordModal