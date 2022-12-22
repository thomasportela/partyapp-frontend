import axiosDo from './axios'

export async function sendFriendRequest(uid){
    try {
        const response = await axiosDo.post('/send-friend-request', {friend_uid: uid})
        console.log(response)
        return response.status
    }catch(err){
        // console.log(err)
        // console.log(err.response.status)
        return err.response
    }
}

export async function checkFriend(uid){
    try {
        const response = await axiosDo.post('/check-friend', {friend_uid: uid})
        return response
    }catch(err){
       return err.response
    }
}

export async function unfriend(uid){
    try {
        const response = await axiosDo.post('/unfriend', {friend_uid: uid})
        return response.status
    }catch(err){
        return err.response
    }
}

export async function acceptFriendRequest(uid){
    try{
        const response = await axiosDo.post('/accept-friend-request', {friend_uid: uid})
        return response.status
    }catch(err){
        return err.response
    }
}

export async function getFriends(){
    try{
        const response = await axiosDo.get('/get-friends')
        return response.data
    }catch(err){
        return err.response
    }
}

export async function checkFriendRequests(){
    try{
        const response = await axiosDo.get('/check-friend-requests')
        return response
    }catch(err){
        return err.response.status
    }
}