import React, { useContext } from 'react'
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
                <a href='/login' className = 'nav-link'  >
                    <button className='logout-btn'
                        onClick={()=>{ 
                            const x = logOutConfirm()
                            if(x) 
                                localStorage.clear()   
                            }
                        }
                    >Log Out</button>   
                </a>
            </nav> : 
            <nav>
                {/* <h1>GOSSIP -_-</h1> */}
                <a href='/' className = 'nav-link'>Home </a>
                <a href='/signup' className = 'nav-link'>Sign Up</a>
                <a href='/login' className = 'nav-link'>Log In</a>
            </nav>
            }
        </div>
 }

 export default Nav