import React from 'react'

const IsAuthenticated = () => {
    const username = useSelector((state) => state.auth.userInfo?.name) // Retrieve the token from storage
    return !!username
}

export default IsAuthenticated