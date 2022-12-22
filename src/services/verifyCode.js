import axiosDo from './axios';

async function verifyCode(code, user){
    try {
        const response = await axiosDo.post('/verifyCode', {code: code, user})
        return response.status
    }catch(err){
        return err.response.status
    }
}

export default verifyCode;