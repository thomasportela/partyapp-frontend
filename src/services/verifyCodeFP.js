import axiosDo from './axios';

async function verifyCodeFP(code, phone, password) {
    try {
        const response = await axiosDo.post('/verifyCode-forgotPassword', {code: code, phone: phone, password: password});
        return response
    }catch(err){
        return err.response.status
    }
}

export default verifyCodeFP;