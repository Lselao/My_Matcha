import axios from "axios";
import { returnErrors } from "./errorActions";

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  PAGE_CHANGED,
  UPDATE_FAIL,
  USER_UPDATE,
} from "./types";
import userSocket, { mainSocket } from "../helpers/socket";

//Change Page
export const changePage = (page) => (dispatch) => {
  dispatch({
    type: PAGE_CHANGED,
    payload: page,
  });
};

//Check token & load user
export const loadUser = () => (dispatch, getState) => {
  //User Loading
  dispatch({ type: USER_LOADING });

  userSocket().then(() => {
  axios
    .get(`/whoami/${mainSocket.id}`, tokenConfig(getState))
    .then((res) => {
        mainSocket.emit("update");
        dispatch({
          type: USER_LOADED,
          payload: res.data,
        })
      }
      ).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: AUTH_ERROR,
        });
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      // dispatch({
      //   type: AUTH_ERROR,
      // });
    });
};
export const reloadUser = () => (dispatch, getState) => {
  //User Loading
  dispatch({ type: USER_LOADING });

  userSocket().then(() => {
  axios
    .get(`/whoami/${mainSocket.id}`, tokenConfig(getState))
    .then((res) => {
        dispatch({
          type: USER_LOADED,
          payload: res.data,
        })
      }
      ).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: AUTH_ERROR,
        });
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      // dispatch({
      //   type: AUTH_ERROR,
      // });
    });
};

//Register User
export const register = ({username,email,password,firstName,lastName, age}) => (dispatch) => {
  //Header
  const config = {
    headers: {
      "Content-Type": "Application/json",
    },
  };
  const key = 'AIzaSyCygkGaEZeIqy6_D_FO48XKGQX45T6aNIE'
    axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${key}`).then(({data}) => {
    axios.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.location.lat},${data.location.lng}&key=${key}`).then(rt => {
  userSocket().then(() => {
    //Request Body
    const socketId = mainSocket.id
    const body = JSON.stringify({ username, email, password, firstName, lastName, socketId, age, location: rt, locationReal: data.location} );
  axios
    .post("/signup", body, config)
    .then((res) => {
        mainSocket.emit("update");
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status, "REGISTER_FAIL"))
        dispatch({
          type: REGISTER_FAIL,
        });
      });
    }).catch(err =>{
      throw new Error("socket error")
    })
    })
  })
};

//Login User
export const login = ({ username, password }) => (dispatch) => {
  //Header
  const config = {
    headers: {
      "Content-Type": "Application/json",
    },
  };


    userSocket().then((userSock) => {
      let userSocketId = userSock.id;
      //Request Body
      const body = JSON.stringify({ username, password, userSocketId});
      axios
        .post("/login", body, config)
        .then((res) => {
          mainSocket.emit("update");
          return dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
          });
        })
        .catch((err) => {
          dispatch(
            returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
          );
          dispatch({
            type: LOGIN_FAIL,
          });
        });
    });

};

export const updateUser = (user, field) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "Application/json",
    },
  };
  const body = JSON.stringify({ user, field });

  axios
    .post("/update", body, config)
    .then((res) =>
      dispatch({
        type: USER_UPDATE,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "UPDATE_FAIL")
      );
      dispatch({
        type: UPDATE_FAIL,
      });
    });
};

export const updateUserProfile = (user, field, token) => (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    },
  };
  const body = JSON.stringify({ user, field });
  return new Promise((res, reject) =>{
    axios
    .post("/update", body, config)
    .then((res) =>
    dispatch({
      type: USER_UPDATE,
      payload: res.data,
    })
    )
    .catch((err) => {
      reject(err.response)
    }).finally(() => res('success'));
  })
};

export const updateUserNoReq = (user) => (dispatch) => {
      dispatch({
        type: USER_UPDATE,
        payload: user,
      })
};

export const deleteUser = (user, token) => (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    }
  };
  axios.delete(`/deleteProfile/${user['id']}`, config)
    .then((res) =>{
      dispatch( {
        type: LOGOUT_SUCCESS,
      })
    }
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "UPDATE_FAIL")
        );
      });
};

//Logout user
export const logout = (userId) => {
  axios.post("/logout", { id: userId }).then(() => {
    userSocket().then((userSock) => {
      mainSocket.emit("update");
      userSock.disconnect();
    });
  });
  return {
    type: LOGOUT_SUCCESS,
  };
};


//Setup config/headers and token
export const tokenConfig = (getState) => {
  //Get token from local storage
  const token = getState().auth.token;

  //Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  //If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
};

export const notificationSet = (number, user)=>{
  user.notificationCount = number;
  return{
    type: 'USER_UPDATE',
    user: user
  }
}

export const updateInterests =  (interest, user, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    },
  };
  return axios.post('/addInterests', {interest, userId: user.id}, config).then((result) =>{
    user.interests.push({interestId: result.data.interestId, interest})
      return{
        type: 'USER_UPDATE',
        payload: user
      };
  })
}

export const deleteInterest = (interestId, user, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    },
  };
  return axios.post('/deleteInterest', {interestId, userId: user.id}, config).then((result) =>{
      return{
        type: 'USER_UPDATE',
        payload: user
      };
  })
}

export const updateLocation = (user, locationId, token) =>{
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    },
  };
  return axios.post('/updateUserLocation', {userId: user.id, locationId}, config).then((res) =>{
    user.location = {...res.data};
    return{
      type: 'USER_UPDATE',
      payload: user
    }
  })
}

export const getLocations = async(source) =>{
  return await (await axios.get('/getLocations', { cancelToken: source.token })).data
}
export const resetPassword = async(email) =>{
  return await (await axios.post('/reset', {email: email})).data
}

export const resetPasswordPost = async(token, password) =>{
  try{
    return await (await axios.post('/confirmPassword', {token, password})).data
  }
  catch(err){
    throw (err.response)
  }
}

