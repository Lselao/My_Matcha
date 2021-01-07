import React, { Component, Fragment } from 'react'
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Label,
	Input,
	NavLink,
	Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

class RegisterModal extends Component {
	state = {
		modal: false,
		username: '',
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		age: '',
		msg: null
	}

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object.isRequired,
		register: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired
	}

	componentDidUpdate(prevProps) {
		const { error, isAuthenticated } = this.props;
		if (error !== prevProps.error) {
			//Check for register error
			if (error.id === 'REGISTER_FAIL') {
				this.setState({ msg: error.msg.msg })
			} else {
				this.setState({ msg: null })
			}
		}

		//If authenticated, close modal
		if (this.state.modal) {
			if (isAuthenticated) {
				this.toggle();
			}
		}
	}

	toggle = () => {
		//Clear errors
		this.props.clearErrors();
		this.setState({
			modal: !this.state.modal
		});
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit = (e) => {
		e.preventDefault();
		this.props.clearErrors();

		const { username, firstName, lastName, email, password, age } = this.state

		//Create user object
		const newUser = {
			username,
			firstName,
			lastName,
			email,
			password,
			age,
		}

		this.props.register(newUser);
	}

	render() {
		return (
			<Fragment>
				{this.props.asText ? <button className="font-weight-bold asText" href="/" onClick={this.toggle}>Register</button>:
				<NavLink onClick={this.toggle} href="#">
					Register
				</NavLink>}
				<Modal
					isOpen={this.state.modal}
					toggle={this.toggle}
				>
					<ModalHeader toggle={this.toggle}>
						Register
					</ModalHeader>
					<ModalBody>
						{this.state.msg ?
							JSON.parse(this.state.msg).map((error, index) => (
								<Alert color="danger" key={index}>
									{error}
								</Alert>
							)
							)
							: null}
						<Form onSubmit={this.onSubmit}>
							<FormGroup>
								<Label for="username">Username</Label>
								<Input
									type="text"
									name="username"
									id="username"
									placeholder="Username"
									className="mb-3"
									onChange={this.onChange}
								/>

								<Label for="firstName">First Name</Label>
								<Input
									type="text"
									name="firstName"
									id="firstName"
									placeholder="First Name"
									className="mb-3"
									onChange={this.onChange}
								/>

								<Label for="lastName">Last Name</Label>
								<Input
									type="text"
									name="lastName"
									id="lastName"
									placeholder="Last Name"
									className="mb-3"
									onChange={this.onChange}
								/>

								<Label for="age">Age</Label>
								<Input
									type="number"
									name="age"
									id="age"
									placeholder="Age"
									className="mb-3"
									onChange={this.onChange}
								/>

								<Label for="email">Email</Label>
								<Input
									type="email"
									name="email"
									id="email"
									placeholder="Email"
									className="mb-3"
									onChange={this.onChange}
								/>

								<Label for="password">Password</Label>
								<Input
									type="password"
									name="password"
									id="password"
									placeholder="Password"
									className="mb-3"
									onChange={this.onChange}
								/>

								<Button
									color="dark"
									style={{ marginTop: "2rem" }}
									block
								>
									Register
								</Button>
							</FormGroup>
						</Form>
					</ModalBody>
				</Modal>
			</Fragment>
		)
	}
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error
})

export default connect(mapStateToProps, { register, clearErrors })(RegisterModal);