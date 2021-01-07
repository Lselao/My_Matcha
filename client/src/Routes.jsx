import { connect } from 'react-redux';

import AppNavbar from "./components/nav/AppNavbar";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import UserProfile from "./components/profile/UserProfile";
import React, { Component } from "react";
import { ProfileCard } from "./components/profile/ProfileCard";
import { OtherUserProfile } from "./components/profile/OtherUserProfile";
import SearchResults  from "./components/profile/SearchResults";
import ResetPassword from "./components/auth/ResetPassword";
import Verify from "./components/auth/Verify";

class App extends Component {
  render() {
    const {isAuthenticated, isLoading, valid} = this.props.auth;
    
    return (
        <Router>
            <AppNavbar />
            <Switch>
                <Route path="/profile/:id">
                    {isAuthenticated ? ( valid ? <OtherUserProfile /> : <Redirect to="/profile"/>) : (isLoading ? null : <Redirect to="/"/>)}
                </Route>
                <Route path="/profile">
                    {isAuthenticated ? <UserProfile /> : (isLoading ? null : <Redirect to="/"/>)}
                </Route>
                <Route path="/search">
                    {isAuthenticated && !valid ? <Redirect to="/profile"/> : <SearchResults/>}
                </Route>
                <Route path="/reset/:token">
                    <ResetPassword/>
                </Route>
                <Route path="/verify/:token">
                    <Verify/>
                </Route>
                <Route path="/">
                    {isAuthenticated && !valid ? <Redirect to="/profile"/> : <ProfileCard/>}
                </Route>
            </Switch>
        </Router>
    );
  }
}


const mapStateToProps = state => ({
	auth: state.auth,
})

export default connect(mapStateToProps, {})(App);