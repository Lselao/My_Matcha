import React from 'react'
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { confirmEmail } from '../../actions/profileActions';


export default function Verify() {
    const { token } = useParams();
    const history = useHistory();

    useEffect(() =>{
        const checkFunction = async(token)=>{
            try{
                await confirmEmail(token)
                history.push('/')
            }
            catch(err){
                history.push('/')
            }
        }
        checkFunction(token);
    })
    return (
        <div>
        </div>
    )
}
