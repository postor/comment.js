import { CommentList, CommentAdd } from 'local-comment/react'

export default () => (<div>
  <h1>local-comment</h1>
  <CommentList
    commentapi="/commentapi"
    topic="global"
    pageSize={5}
  />
  <CommentAdd
    commentapi="/commentapi"
    topic="global"
  />
  <hr />  
  <CommentList
    commentapi="/commentapi"
    topic="index"
  />
  <CommentAdd
    commentapi="/commentapi"
    topic="index"
  />
</div>)