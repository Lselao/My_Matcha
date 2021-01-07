import axios from "axios";
import  userSocket  from "../helpers/socket";

export const imageUpload = async (fileData, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    },
  };
  try{
    return await axios.post(`/imageUpload`, fileData, config);
  }
  catch(err){
    throw (err.response);
  }
};

export const getIsConnection = async (currentUserId, visitedUserId) => {
  return await (
    await axios.get(`/getConnection/${currentUserId}/${visitedUserId}`)
  ).data;
};

export const getIsLiked = async (currentUserId, visitedUserId) => {
  return await (await axios.get(`/getLiked/${currentUserId}/${visitedUserId}`))
    .data;
};
export const getIsBlocked = async (currentUserId, visitedUserId, source) => {
  return await (await axios.get(`/getIsBlocked/${currentUserId}/${visitedUserId}`, { cancelToken: source.token }))
    .data;
};
export const getIsReported = async (currentUserId, visitedUserId, source) => {
  return await (await axios.get(`/getIsReported/${currentUserId}/${visitedUserId}`, { cancelToken: source.token }))
    .data;
};

export const postLike = async (currentUser, visitedUser, isBlocked, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    },
  };
  const isLiked = await getIsLiked(visitedUser.id, currentUser.id);
  const mainSocket = await userSocket(currentUser.id);
  if (!isBlocked){
    if (isLiked) {
      mainSocket.emit(
        "notification send",
        `${currentUser.username} liked you back`,
        visitedUser
      );
    } else {
      mainSocket.emit(
        "notification send",
        `${currentUser.username} liked your profile, you are now connected`,
        visitedUser
      );
    }
  }
  const result = await axios.post("/likes", {
    fromUserId: currentUser.id,
    toUserId: visitedUser.id,
  }, config);
  mainSocket.emit("updateAll")
  return result;
};

export const postDislike = async (currentUser, visitedUser, isBlocked, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    },
  };
  const isConnection = await getIsConnection(visitedUser.id, currentUser.id);
  const mainSocket = await userSocket(currentUser.id)
  if (!isBlocked){
    if (isConnection){
      mainSocket.emit(
        "notification send",
        `${currentUser.username} a connection disliked your profile and you are disconnected from them`,
        visitedUser
      );
    }
    else{
      mainSocket.emit(
        "notification send",
        `${currentUser.username} disliked your profile`,
        visitedUser
      );
    }
  }
  const result =  await axios.post("/dislike", {
    fromUserId: currentUser.id,
    toUserId: visitedUser.id,
  }, config);
  mainSocket.emit("updateAll");
  return result
};

export const imageDelete = async (picId, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    },
  };
  return await axios.post(
    `/imageDelete`,
    { id: picId },
    config
  );
};

export const getConnections = async (userId) => {
  return await (await axios.get(`/getConnections/${userId}`)).data;
};
export const getNotifications = async (userId) => {
  return await (await axios.get(`/getNotifications/${userId}`)).data;
};
export const blockUser = async (userId, visitedUserId, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    },
  };
  return await (await axios.put(`/blockUser/${userId}/${visitedUserId}`, {}, config)).data;
};
export const reportUser = async (userId, visitedUserId, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      "x-auth-token": token
    },
  };
  return await (await axios.put(`/reportUser/${userId}/${visitedUserId}`, {}, config)).data;
};


export const checkToken = async(token) =>{
  try{
    return await (await axios.get(`/checkToken/${token}`)).data;
  }
  catch(err){
    throw err.response
  }
}

export const confirmEmail = async(token) =>{
  try{
    return await (await axios.get(`/confirm/${token}`)).data;
  }
  catch(err){
    throw err.response
  }
}