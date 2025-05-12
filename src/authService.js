import config from './config'
export async function checkAuth() {
    const url = `${config.studioServer.BASE_URL}api/v1/auth`

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Not logged in');
    }

    return await response.json();
}
