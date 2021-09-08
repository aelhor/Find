import React, { useState } from 'react'
import axios from 'axios'
import cookie from 'js-cookie'

const Search = ()=> { 
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState({})


    const search = async(e) => {
        e.preventDefault()
        console.log(query)
        try {
            let res = await axios({
                method : 'GET',
                url : 'https://asky-chidemi.herokuapp.com/search?q='+query ,
                // data : {q : query}
                // headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
            })
            console.log('serach result  :', res)
            document.querySelector('.search_suggestions').style.display = 'block'
            setSuggestions(res.data)
        } catch (error) {
            console.log('serach Error :',error);       
            document.querySelector('.search_suggestions').style.display = 'none'

        }
    }
    const initSearch = () => {
        // document.querySelector('.search_suggestions').style.display = 'block'
        // console.log(document.querySelector('.search_suggestions'))
    }

    return (
        <div className='search_wrapper'>
            <div className="search_container">
                <form onSubmit={e=>search(e)}>
                    <input 
                        type="text" 
                        placeholder="Search.." 
                        name="search" 
                        value={query} 
                        onChange={e=> setQuery(e.target.value)}
                        autocomplete="off"
                        autoFocus = 'off'
                        onKeyUp={e=>search(e)}
                        // onFocus = {initSearch()}
                        />
                    <button type="submit" className='search_btn'><i className="material-icons">search</i> </button>
                </form>
            </div> 
            <div className='search_suggestions'>
                {suggestions.length > 0 ?
                    suggestions.map(s=> {
                        return<div className='single_suggestion' key={s._id}>
                                <div className='suggestions_img_container'>
                                    {s.fbPicture === 'none' || !s.fbPicture ?  <svg alt='no img ' xmlns="http://www.w3.org/2000/svg"  aria-hidden="true" focusable="false" data-prefix="far" data-icon="user" className="svg-inline--fa fa-user fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"/></svg>
                                    :<img alt='FB Img' className='fb_img' src= {s.fbPicture}/> }
                                </div>
                                <a href={`/user/${s._id}`}>{s.userName} </a>
                            </div>
                    })
                    :null
                }
            </div>
        </div>
    )
}

export default Search