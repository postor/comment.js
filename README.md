# comment.js

## features

- realtime comment update
- user feed notification
- easy to adopt

## usage

server

```
const app = require('express')()
app.use('/commentjs',require('comment.js').router())
```

show comment list (react)

```
import { CommentList, removeComment } from 'comment.js'

const topic = 'global'

export default (<CommentList
  topic={topic}
  user={{
    id:1,
    name:'josh',
  }}
  rowTemplate={({user,comment,i})=>{
    return (<li key={i}>
      {userContent}
      <span>{comment}<span>
      {comment.userId === user.id && (<a 
        onClick={()=>removeComment(topic,comment._id)}
      >remove</a>)}
    </li>)
  }}
  container={({children})=>(<ul>{children}</ul>)}
/>)
```

add comment

```
import { Component } from 'react'
import { addComment } from 'comment.js'

class MyCommentBox extends Component {
  constructor(props){
    super(props)
    this.state={
      commentText: '',
    }
  }
  
  render(){
    const { commentText } = this.state
    return (<div>
      <input 
        value={commentText}
        onChange={(e)=>this.setState({commentText:e.target.value})}
      />
      <button onClick={()=>{
        const user = {
          id:1,
          name:'josh',
        }, url = '/'

        addComment({
          topic: 'global'
          userId: user.id,
          user,
          content: commentText,
        })

        // news feed to somebody (still using comment logic)
        const {artileAuthorId} = this.props // e.g. article writer
        addComment({
          topic: `user_feed_${artileAuthorId}`
          artileAuthorId, 
          content: (<span>
            <span>{`${user.name} commented "${commentText}", refer:`}</span>
            <a href={url}>{url}</a>
          </span>),
        })
      }}>submit</button>
    </div>)
  }
}

```


