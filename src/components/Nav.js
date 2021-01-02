import React, { useContext } from 'react'
import { userContext } from '../context'

const Nav = (props) => { 
    const {logedIn} = useContext(userContext)
    
    return <div>
            { logedIn?
            <nav>
                <a href='/'  className = 'nav-link' >Home </a>
                <a href='https://laughing-darwin-66632b.netlify.app/following' className = 'nav-link'  >Following</a>

                <a href='https://laughing-darwin-66632b.netlify.app/people' className = 'nav-link'  >People</a>

                <a href='https://laughing-darwin-66632b.netlify.app/login' className = 'nav-link'  >
                    <button className='logout-btn'
                        onClick={()=> localStorage.clear()}
                    >Log Out</button>   
                </a>
            </nav> : 
            <nav>
                <a href='/' className = 'nav-link'>Home </a>
                <a href='https://laughing-darwin-66632b.netlify.app/signup' className = 'nav-link'>Sign Up</a>
                <a href='https://laughing-darwin-66632b.netlify.app/login' className = 'nav-link'>Log In</a>
            </nav>
            }
        </div>
 }

 export default Nav