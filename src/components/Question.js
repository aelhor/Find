import React from  'react'

const Question =(props) => { 
    let loved = false
    const activeUserId  = localStorage.getItem('userId')
    

    return (
        props.answer.length > 0?
        <div className='question'>
            <small className ='ques-time'>{
            new Date(props.createdAt).toUTCString().slice(4, 22)
            } </small>
            <button title ='Delete' onClick={()=>props.deleteQuestion()} className='delete-btn'> <i className="material-icons">delete</i> </button>
            <br/><br/>
            <div className='question-body'>{props.body}</div>
            <div className='question-answer'>{props.answer} </div>
            
            {loved = false}

            {
            props.likes.forEach(liker => {
            if (liker.userId === activeUserId) {
                console.log(liker.userName +'likes the ques');
                loved = true
            }
            else
                loved = false
            })
            }
            
            <div className='action_container'>
                <div 
                className={`love-btn  love${props.i}`}
                title ={loved? 'unLike' : 'Like'}
                onClick={props.likeOrDislike} // 
                className={loved ? `love-btn  love${props.i} loved` : `love-btn  love${props.i} not_loved`}
                > 
                    <i className="material-icons">favorite</i> 
                </div>
                <div className='comment_btn'>
                <i className="material-icons">comment</i> 
                </div>
            </div>
            
            <div className='actions-numbers'>
            <a href={'ques/' + props.id} >{parseInt(props.likes.length)} Likes </a> 
            <a href='#'>0 Reply</a>
            </div>
        </div>  : 
        // Not answerd Questions 
            props.page === 'homePage' ? 
                <div className='question'>
                    <small className ='ques-time'>{
                        new Date(props.createdAt).toUTCString().slice(4, 22) }
                    </small>
                    <button title ='Delete' onClick={props.deleteQuestion} className='delete-btn'> <i className="material-icons">delete</i> </button>
                    <br/>
                    <div className='question-body'>{props.body}</div>
                    <form className='ques_form' onSubmit ={ props.answerQuestion} >
                    <textarea 
                    rows="4" 
                    placeholder='Enter your answer' 
                    name={props.id}
                    onChange ={e=>{
                        props.setAnswer(e.target.value) 
                    }}/>
                        <button title='Answer' className='answer-btn'>  <i className="material-icons">send</i></button>
                    </form>
                </div> 
                :// for user page donot display the unanswerd question  
                null
    )
}

export default Question