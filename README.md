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

const currentUser={
  id:1,
  name:'josh',
}, topic='global'

export default (<CommentList
  commentjs="/commentjs"
  topic={topic}
  RowTemplate={({comment,user,_id})=>{
    return (<li>
      <span>{user.name}</span>:
      <span>{comment.content}</span>
      {user.id === currentUser.id && (<a 
        onClick={()=>removeComment(topic,_id)}
      >remove</a>)}
    </li>)
  }}
  Container={({children})=>(<ul>{children}</ul>)}
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

        addComment('/commentjs','global',{
          userId: user.id,
          user,
          content: commentText,
        })

        // news feed to somebody (still using comment logic)
        .then(()=>{
          const {artileAuthorId} = this.props // e.g. article writer
          addComment('/commentjs',`user_feed_${artileAuthorId}`,{
            artileAuthorId, 
            content: (<span>
              <span>{`${user.name} commented "${commentText}", refer:`}</span>
              <a href={url}>{url}</a>
            </span>),
          })
        })
      }}>submit</button>
    </div>)
  }
}

```


