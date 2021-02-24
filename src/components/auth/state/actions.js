export const updateUser = (user) => {
    return {
        type: 'UPDATE_USER',
        payload: user
    }
}

export const logout = () => {
    return {
        type: 'LOGOUT',
        payload: {username: '', first_name: '', last_name: '', email: ''}
    }
}