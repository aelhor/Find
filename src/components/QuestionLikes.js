import React , {useEffect, useState} from 'react'
import axios from 'axios'
import cookie from 'js-cookie'


const getOneQues = async (quesId, setLikes, setQuestion) =>{  
    try {
        const resOneQues = await axios({
            method : 'GET', 
            url: 'https://asky-chidemi.herokuapp.com/question/'+ quesId,
            headers : {Authorization : `Bearer ${cookie.get('jwt')}` }
      })
        console.log('resOneQues : ', resOneQues)
        setLikes(resOneQues.data.ques.likes)
        setQuestion(resOneQues.data.ques)
    } catch (error) {
      console.log(error);
    } 
}


const QuestionLikes = (props) => { 
    const [likes, setLikes] = useState([])
    const [ques, setQuestion] = useState({})

    const  [active_is_follower, set_Active_is_follower] = useState(false)
    const quesId =  props.match.params.quesId   
    const activeUserId  = localStorage.getItem('userId')
    const activeUserName = localStorage.getItem('activeUserName')


    
    useEffect(()=> { 
        getOneQues(quesId, setLikes, setQuestion)

       }, [])
    
    const followOrunFollow = ()=> { 
        // follow
        ! active_is_follower ? 
            axios({
                method: 'Post',
                url: 'https://asky-chidemi.herokuapp.com/users/follow/' + activeUserId,
                headers : {Authorization : `Bearer ${cookie.get('jwt')}` },
                data: {
                    targetId : likes.userId ,// target User Id
                    targetUserName : likes.userName,
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
                url: 'https://asky-chidemi.herokuapp.com/users/unfollow/' + activeUserId,
                headers : {Authorization : `Bearer ${cookie.get('jwt')}` },
                data: {
                    targetId : likes.userId ,// target User Id
                    targetUserName : likes.user.userName,
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


    return <div >
        {console.log(quesId)}
            <div className='question'>
                <small className ='ques-time'>{
                    new Date(ques.createdAt).toUTCString().slice(4, 22)
                } </small>
                <br/><br/>
                <div className='question-body'>{ques.body}</div>
                <div className='question-answer'>{ques.answer} </div>
            </div>

        <div className='ques_likes_container'>
            <h4> Likes by :</h4> 
            <small className='likes-num'>{likes.length} Likes</small>
            <div className='liked_by_container' >
                {likes.map(like=> { 
                    return <div className='liked_by'  key={like.userId} >
                        <li ><a  href ={'/user/'+like.userId}> {like.userName} </a></li>
                    </div> 
                })}
            </div>
        </div>
        
    </div>
}

export default QuestionLikes