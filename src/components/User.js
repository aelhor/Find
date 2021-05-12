import React, { useEffect, useState } from "react";
import axios from "axios";

let loved = false

const getAllQuestion = (userId, setQuestions)=> { 
    axios.get('https://chiedimi.herokuapp.com/questions/' + userId)
    .then(res=> { 
        console.log('fetching questions Response : ', res);
        setQuestions(res.data)
    })
    .catch(error=> {
        // // console.log('fetching questions Error : ',  error);
    })
}
const User = (props)=> { 
    const [user, setUser] = useState({})
    const [quesBody ,setQuesBody] = useState('')
    const [questions, setQuestions] = useState([]) 
    const userId = props.match.params.id               // target user
    // const {activeUserId} = useContext(userContext)
    const activeUserId = localStorage.getItem('userId')
    const activeUserName = localStorage.getItem('activeUserName')
    const  [active_is_follower, set_Active_is_follower] = useState(false)
    const sucessNote = document.querySelector('.success')
    const failedNote = document.querySelector('.failed')

    useEffect(()=> { 
        // get the user's info 
        axios.get('https://chiedimi.herokuapp.com/users/' + userId)
        .then(res=> {
            console.log('user  :', res.data.user);
            setUser(res.data.user)
            // check if acive user is already a follower  
            for(let i = 0 ; i < res.data.user.followers.length ; i++){
                if(activeUserId === res.data.user.followers[i].userId ){
                    set_Active_is_follower(true)
                    document.querySelector('.follow-btn').classList.add('true-follow')
                    console.log('active is a follower')
                    break
                }
            }
        })
        .catch(error=> { 
            // console.log(error);
        })

        // get all usre's questions
        getAllQuestion(userId, setQuestions)

    }, [])

    const askQuestion =(userId, e)=> { 
        e.preventDefault()
        axios({
            method: 'Post',
            url: 'https://chiedimi.herokuapp.com/questions/ask/' + userId,
            data: {
              body : quesBody
            }, 
          })
          .then(res=> {             
            console.log(res)

            // clear the input 
            setQuesBody('')
            //display a sucessful message 
            // setTimeout(() => {
            //     sucessNote.classList.add('display_note')
            // }, 2000);
          })
          .catch(error=> {
            console.log(error);
            // setTimeout(() => {
            //     failedNote.classList.add('display_note')
            // }, 2000);
          })
    }

    const followOrunFollow = ()=> { 
        // follow
        ! active_is_follower ? 
            axios({
                method: 'Post',
                url: 'https://chiedimi.herokuapp.com/users/follow/' + activeUserId,
                data: {
                    targetId : userId ,// target User Id
                    targetUserName : user.userName,
                    activeUserName : activeUserName
                }, 
            })
            .then(res=> { 
                console.log('Follow response: ', res);
                set_Active_is_follower(true)
                // window.location.reload()
            })
            .catch(error=> {
                console.log(error);
            }) :
            // unFollow
            axios({
                method: 'Post',
                url: 'https://chiedimi.herokuapp.com/users/unfollow/' + activeUserId,
                data: {
                    targetId : userId ,// target User Id
                    targetUserName : user.userName,
                    activeUserName : activeUserName
                }, 
            })
            .then(res=> { 
                console.log('Follow response: ', res);
                set_Active_is_follower(false)
            })
            .catch(error=> {
                // console.log(error);
            })
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
            getAllQuestion(userId,setQuestions )
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
            getAllQuestion(userId,setQuestions )
            }
            catch(error){
                console.log(error)
            }
        }
    } 
    
   
    return<div>
        <div>
            <h1> {user ?user.userName : 'Null' }  </h1>
            <button onClick={()=>followOrunFollow()} className ={active_is_follower ? 'true-follow':'follow-btn'}>
             { active_is_follower ? 'UNFOLLOW': 'FOLLOW'}
            </button>
        </div>
       <br></br>
       <form className='ques_form' onSubmit = {(e)=>askQuestion(userId, e)}>
            < textarea
                rows="4" 
                value ={quesBody}
                onChange={(e)=> setQuesBody(e.target.value)}
                required = {true}
                placeholder = 'Ask a question ...'
                className = 'ques-input'
                min={2}
            />
            <button className='answer-btn'> <i className="material-icons">send</i> </button>
        </form>
            {
                questions.length > 0 ?
                    questions.map((ques, i)=> { 
                        return(
                            ques.answer ? 
                            <div className='question' key = {ques._id}>
                                <small className ='ques-time'>{
                                  new Date(ques.createdAt).toUTCString().slice(4, 22)}</small><br/>
                                <div  className='question-body'>{ques.body}</div>
                                <div className='question-answer'> {ques.answer}</div>
                              
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
                                    <a href={'/ques/'+ques._id} >{parseInt(ques.likes.length)} Likes </a> 
                                    <a href='#'>0 Reply</a>
                                </div>

                            </div>:null
                        )
                    })
                :
                    <p>No questions yet...!</p>
            }
            
    </div>
}
export default User