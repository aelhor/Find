import React, { useContext,useEffect } from 'react'
import { userContext } from '../context'
let userName = localStorage.getItem('activeUserName')

const logOutConfirm = ()=>{
    return window.confirm('Log out ?')
}
const Nav = (props) => { 
    const {logedIn} = useContext(userContext)
        return <div>
            { logedIn?
            <nav>
                <a href='/'  className = 'nav-link username-link' >{userName || 'Home'} </a>
                <a href='/following' className = 'nav-link'  >Following</a>
                <a href='/people' className = 'nav-link'  >People</a>
                <a href ='/login'>
                <button className='logout-btn'
                    onClick={()=>{ 
                        if(logOutConfirm()) {
                            localStorage.clear() 
                        }                        
                    }}
                >Log Out</button>  
                </a>                 
            </nav> : 
            <nav>
                <a href='/' className = 'nav-link'>Home </a>
                <a href='/signup' className = 'nav-link'>Sign Up</a>
                <a href='/login' className = 'nav-link'>Log In</a>
            </nav>
            }
        </div>
 }

 export default Nav