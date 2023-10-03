import React from 'react'

function AuthLayout({ children }) {
    return (
        <div className=' flex items-center h-screen w-screen justify-center'>
            {children}
        </div>
    )
}

export default AuthLayout