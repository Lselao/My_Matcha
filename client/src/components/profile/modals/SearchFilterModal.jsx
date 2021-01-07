import React, { Component, Fragment } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  Form,
  FormGroup,
  Label,
  Col,
  CustomInput
} from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";

class SearchFilterModal extends Component {
  state = {
    msg: null,
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      options: {
        quickSearch: "",
        sort: "alphabetical",
        ascDesc: "asc"
      }
    });
  };

  handleChange = (e) => {
    this.setState({...this.state, options: {...this.state.options, [e.target.name]: e.target.value}})
    if (e.target.type === "checkbox")
      this.setState({...this.state, options: {...this.state.options, nearby: e.target.checked}});
 }
 
  onSubmit = async(e) => {
    e.preventDefault(); 
    const results = await (await Axios.post('/search', {options: this.state.options, userId: this.props.auth.user.id})).data;
    if (this.props.fromSearch)
      this.toggle();
    this.props.history.push({
      pathname: '/search',
      state: { results: results }
    })
  };

  quickSearch = async(e) => {
    e.preventDefault(); 
    const results = await (await Axios.post('/search', {options: this.state.options, userId: this.props.auth.user.id})).data;

    this.props.history.push({
      pathname: '/search',
      state: { results: results }
    })
  };

  render() {
    return (
      <Fragment>
          <Container style={{paddingBottom: 20}}>
            <InputGroup>
                <Input onChange={this.handleChange} name="quickSearch" placeholder="Search..." />
                {this.state.options && this.state.options.quickSearch ?
                <InputGroupAddon addonType="append"><Button onClick={this.quickSearch} outline color="secondary">Search</Button></InputGroupAddon>:
                <InputGroupAddon addonType="append"><Button disabled outline color="secondary">Search</Button></InputGroupAddon>
              }
                <InputGroupAddon addonType="append"><Button outline onClick={this.toggle} color="secondary">Advanced Search</Button></InputGroupAddon>
            </InputGroup>
          </Container>

          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Search</ModalHeader>
            <ModalBody>
              {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
              ) : null}
              <Form onSubmit={this.onSubmit}>
                <FormGroup row>
                  <Label for="name" sm={3}>Name: </Label>
                  <Col sm={9}>
                    <Input type="name" name="name" id="name" placeholder="Name" onChange={this.handleChange} value={this.state.name}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="agegap" sm={3}>Age Gap: </Label>
                  <Col sm={9}>
                    <Input type="number" name="ageGap" onChange={this.handleChange} value={this.state.ageGap} id="agegap"/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="matchingInterests" sm={4}>Matching Interests: </Label>
                  <Col sm={8}>
                    <Input type="number" name="matchingInterests" id="matchingInterests"onChange={this.handleChange} value={this.state.matchingInterests}/>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Label for="fame">Fame Rating:</Label>
                  <CustomInput  min="1" max="4" type="range" id="fame" name="fame" onChange={this.handleChange} value={this.state.fame} />
                </FormGroup>

                <FormGroup row>
                  <Col sm={6}>
                    <FormGroup onChange={this.handleChange} value={this.state.sexualPref}>
                      <Label for="sexual">Sexual Preference: </Label>
                      <FormGroup check>
                        <Label check>
                          <Input type="radio" name="sexualPref" value="Heterosexual"/>{' '}
                            Heterosexual
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Label check>
                          <Input type="radio" name="sexualPref" value="Bisexual"/>{' '}
                            Bisexual
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Label check>
                          <Input type="radio" name="sexualPref" value="Homosexual"/>{' '}
                            Homosexual
                        </Label>
                      </FormGroup>
                    </FormGroup>
                  </Col>
  
                  <Col sm={6}>
                    <FormGroup onChange={this.handleChange} value={this.state.gender}>
                      <Label for="gender">Gender: </Label>
                      <FormGroup check>
                        <Label check>
                          <Input type="radio" name="gender" value="Male" />{' '}
                            Male
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Label check>
                          <Input type="radio" name="gender" value="Female"/>{' '}
                            Female
                        </Label>
                      </FormGroup>
                    </FormGroup>
                  </Col>

                  <Col sm={6}>
                  <Label for="orderby">Order By: </Label>
                  <Input onChange={this.handleChange} type="select" bsSize="sm" className="mb-2" name="sort">
                    <option value="alphabetical">Alphabetical</option>
                    <option value="age">Age</option>
                    <option value="location">Location</option>
                    <option value="fame">Fame Rating</option>
                    <option value="tag">Matching Tags</option>
                  </Input>
                    <FormGroup onChange={this.handleChange} >
                      <FormGroup check>
                        <Label check>
                          <Input type="radio" name="ascDesc" value="asc" />{' '}
                            Ascending
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Label check>
                          <Input type="radio" name="ascDesc" value="desc"/>{' '}
                            Descending
                        </Label>
                      </FormGroup>
                    </FormGroup>
                  </Col>
                  <Col sm={6}>
                    <FormGroup>
                      <CustomInput type="switch" id="nearby" name="nearby" label="Nearby" onChange={this.handleChange} />
                    </FormGroup>
                  </Col>

                </FormGroup>

                  <Button className="float-right">Search</Button>
              </Form>
            </ModalBody>
          </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default withRouter(connect(mapStateToProps, {})(SearchFilterModal));
