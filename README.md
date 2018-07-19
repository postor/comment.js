# local-comment

## warning

no access controll yet | 暂时还没有权限控制

## features

- realtime comment update | 实时评论，基于sse
- easy to adopt | 容易使用

## examples

1.install and start mongodb

2.clone and run

```
git clone https://github.com/postor/local-comment.git
cd local-comment/examples/basic
yarn && yarn dev
```

3.open browser

http://localhost:3000


## usage

server

```
const app = require('express')()
app.use('/commentapi',require('local-comment').router())
```

list and add (react)

```
import { CommentList, CommentAdd } from 'local-comment/react'

export default (<CommentList
  commentapi="/commentapi"
  topic={'global'}
/>)


export default (<CommentAdd
  commentapi="/commentapi"
  topic={'global'}
/>)

```

customized list 

```
import { removeComment } from 'local-comment'
import { CommentList } from 'local-comment/react'

const currentUser={
  id:1,
  name:'josh',
}, topic='global'

export default (<CommentList
  commentapi="/commentapi"
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


add comment customize

```
import { Component } from 'react'
import { add as addComment } from 'local-comment/request'

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

        addComment('/commentapi','global',{
          userId: user.id,
          user,
          content: commentText,
        })

        // news feed to somebody (still using comment logic)
        .then(()=>{
          const {artileAuthorId} = this.props // e.g. article writer
          addComment('/commentapi',`user_feed_${artileAuthorId}`,{
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


