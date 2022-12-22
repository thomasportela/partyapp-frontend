import axiosDo from './axios'

async function handleRefreshToken(refreshToken) {
    try {
        console.log('Tentei refreshar')
        const response = await axiosDo.post('/token', {refreshToken: refreshToken})
        const accessToken = response.data.accessToken
        console.log(accessToken)
        return accessToken
    }catch(err){
        return err.response.status
    }
}

export default handleRefreshToken