import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authActions";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Routes from "./Routes";

export default class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  
  render() {
    return (
      <Provider store={store}>
        <Routes/>
      </Provider>
    );
  }
}
