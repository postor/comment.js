import { CommentList, CommentAdd } from 'local-comment/react'

export default () => (<div>
  <h1>local-comment</h1>
  <CommentList
    commentjs="/commentjs"
    topic="global"
    pageSize={5}
  />
  <CommentAdd
    commentjs="/commentjs"
    topic="global"
  />
  <hr />  
  <CommentList
    commentjs="/commentjs"
    topic="index"
  />
  <CommentAdd
    commentjs="/commentjs"
    topic="index"
  />
</div>)