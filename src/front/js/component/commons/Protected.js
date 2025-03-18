import React from 'react';
import {useNavigate } from 'react-router-dom';

export default function Protected({children}) {
    const navigate = useNavigate();
    const user = localStorage.getItem('user')

    if (!user){
        navigate('/login')
    }


    return (
        <>
            {children}
        </>
    );

}