import axiosDo from './axios';

async function createParty(party) {
    try {
        const response = await axiosDo.post('/create-party', {party})
        return response
    }catch(err) {
        return err.response
    }
}

export async function uploadPartyBanner(data) {
    try {
        const response = await axiosDo.post('/upload-party-banner', data)
        return response
    }catch(err) {
        return err.response
    }
}

export async function insertOrganizers(pid, organizers){
    try {
        const response = await axiosDo.post('/insert-organizers', {pid, organizers})
        return response.status
    }catch(err) {
        return err.response
    }
}

export async function updateParty(changes, pid) {
    try {
        const response = await axiosDo.post('/update-party', {changes, pid})
        return response.status
    }catch(err) {
        return err.response
    }
}

export default createParty;