import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { userContext } from '../context'
import Question from './Question'
import {getAllQuestion, answerQuestion, deleteQuestion, likeOrDislike} from '../functions/quesFunction' 

const HomePage = () => { 
    const {logedIn} = useContext(userContext) 
    // const {activeUserId} = useContext(userContext)
    const activeUserId  = localStorage.getItem('userId')
    const activeUserName = localStorage.getItem('activeUserName')
    const [questions, setQuestions] = useState([]) 
    const [answer, setAnswer] = useState('')

    // need to fetch  user's questions 
    useEffect(()=> { 
     getAllQuestion(activeUserId,setQuestions )
    }, [])
        
    return <div className='homepage-container'>
       <h1>GOSSIP -_-</h1>
      <img className='homepage-img' alt = 'homepage' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSoA7sqDWhOZp9DnsDsF7-K1CJQftvEOd8gw&usqp=CAU'/>
       {logedIn  ?
       <div>
         <h1>{activeUserName}</h1>
         <h3 title='I have time to kill'>Ask me !</h3>
         {
           questions.length > 0 ? 
           questions.map((ques, i)=> {
             return <div key={ ques._id}> 
                      <Question 
                        createdAt = {ques.createdAt}
                        id = {ques._id}
                        body = {ques.body}
                        answer = {ques.answer}
                        likes = {ques.likes}
                        i = {i}
                        page = {'homePage'}
                        deleteQuestion = {()=>deleteQuestion(ques._id, setQuestions, questions)}
                        likeOrDislike = {()=>likeOrDislike(activeUserId, ques._id, i, setQuestions)}
                        answerQuestion = {(e)=>answerQuestion(ques._id, e, answer, setQuestions, activeUserId)}
                        setAnswer = {setAnswer}                     
                      /> 
               </div>
             
           })
           : <div>Loading ... </div>
         }
       </div>: 
       <p>Please <a href='/login'>Login</a> First ...</p>
       }
    </div>
}

 export default HomePage
 