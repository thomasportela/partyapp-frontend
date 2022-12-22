import axiosDo from './axios'

async function getOrganizers(pid){
    try {
        const respose = await axiosDo.post('/organizers', {pid: pid})
        return respose.data.organizers
    }catch(err){
        return err.response
    }
}

export default getOrganizers