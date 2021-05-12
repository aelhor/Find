import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { userContext } from '../context'


const getAllQuestion = async(activeUserId,setQuestions)=> { 
  try {
    const res = await axios.get('https://chiedimi.herokuapp.com/questions/' + activeUserId)  
    // console.log('fetching questions Response : ', res)
    setQuestions(res.data)
    console.log('allQuestion : ',res.data)
  } 
  catch (error) {
    console.log('fetching questions Error : ',  error);
  }
} 



let loved = false
// ### likes branch from front end 
const HomePage = (props) => { 
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

    const answerQuestion = async (quesId, e)=> { 
      // send a patch req to the server to answer this ques 
      e.preventDefault()
        try {
          const res = await axios({
            method: 'Patch',
            url: 'https://chiedimi.herokuapp.com/questions/answer/' + quesId,
            data: {
              answer : answer
            }, 
          })
          console.log(res);
          getAllQuestion(activeUserId,setQuestions)
        } 
        catch (error) {
          console.log(error);
        }
    } 
    const deleteQuestion = async(quesId)=>{
      try {
        const res = await axios.delete('https://chiedimi.herokuapp.com/questions/delete/' + quesId)  
        console.log('question deleted : ', res)
        getAllQuestion(activeUserId,setQuestions)
      } 
      catch (error) {
        console.log('delete questions Error : ',  error);
      }
    }

    const likeOrDislike =async (ques, i)=>{
      let activeLikedQues = false
      let loveBtnI = document.querySelector( `.love${i}`)
      if (loveBtnI.classList.contains('loved')){
        activeLikedQues = true
      }

      if (activeLikedQues ){
        try{
          const res = await axios({
              method : 'PATCH', 
              url: 'https://chiedimi.herokuapp.com/questions/dislike/'+ques._id,
              data :{
                  activeUserId : activeUserId,
                  activeUserName : activeUserName
              }
          })
          getAllQuestion(activeUserId,setQuestions )

        }
        catch(error){
            console.log(error)
        }
      }
      else{
        try{
          const res = await axios({
              method : 'PATCH', 
              url: 'https://chiedimi.herokuapp.com/questions/like/'+ques._id,
              data :{
                  activeUserId : activeUserId,
                  activeUserName : activeUserName
              }
          })
          getAllQuestion(activeUserId,setQuestions )
        }
        catch(error){
            console.log(error)
        }
      }
    } 
    
    return <div className='homepage-container'>
       <h1>GOSSIP -_-</h1>
      <img className='homepage-img' alt = 'homepage' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSoA7sqDWhOZp9DnsDsF7-K1CJQftvEOd8gw&usqp=CAU'/>
       {logedIn ?
       <div>
         <h1>{activeUserName}</h1>
         <h3 title='I have time to kill'>Ask me  ...</h3>
         

         {
           questions.map((ques, i)=> {
             return <div key={ ques._id}>
                  {
                    ques.answer ? 
                    <div className='question'>
                      <small className ='ques-time'>{
                         new Date(ques.createdAt).toUTCString().slice(4, 22)
                      } </small>
                      <button title ='Delete' onClick={()=>deleteQuestion(ques._id)} className='delete-btn'> <i className="material-icons">delete</i> </button>
                      <br/><br/>
                      <div className='question-body'>{ques.body}</div>
                      <div className='question-answer'>{ques.answer} </div>
                      {loved = false}

                      {
                       ques.likes.forEach(liker => {
                        if (liker.userId == activeUserId) {
                          console.log(liker.userName +'likes the ques');
                          loved = true
                        }
                        else
                            loved = false
                       })
                      }
                      <div className='action_container'>
                          <div 
                            className={`love-btn  love${i}`}
                            title ={loved? 'unLike' : 'Like'}
                            onClick={()=>likeOrDislike(ques, i)}
                            className={loved ? `love-btn  love${i} loved` : `love-btn  love${i} not_loved`}
                          > 
                              <i className="material-icons">favorite</i> 
                          </div>
                          <div className='comment_btn'>
                             <i className="material-icons">comment</i> 
                          </div>
                      </div>
                      
                      <div className='actions-numbers'>
                        <a href={'ques/' + ques._id} >{parseInt(ques.likes.length)} Likes </a> 
                        <a href='#'>0 Reply</a>
                      </div>

                    </div> : 
          
          // Not Answered Questions
                    <div className='question'>
                       <small className ='ques-time'>{
                          new Date(ques.createdAt).toUTCString().slice(4, 22) }
                        </small>
                        <button title ='Delete' onClick={()=>deleteQuestion(ques._id)} className='delete-btn'> <i className="material-icons">delete</i> </button>
                        <br/>
                      <div className='question-body'>{ques.body}</div>
                      
                      <form className='ques_form' onSubmit ={(e)=> answerQuestion(ques._id, e)} >
                      <textarea 
                        rows="4" 
                        placeholder='Enter your answer' 
                        name={ques._id}
                        onChange ={e=>{
                          setAnswer(e.target.value) 
                        }}/>
                          <button title='Answer' className='answer-btn'>  <i className="material-icons">send</i></button>
                        </form>
                    </div>
                  }
               </div>
             
           })
         }
       </div>: 
       <p>Please <a href='/login'>Login</a> First ...</p>
       }
    </div>
}

 export default HomePage
 