import { CommentList } from 'local-comment/react'
import AddComment from '../components/Add'
import moment from 'moment'

export default () => (<div>
  <h1>local-comment</h1>
  <CommentList
    commentapi="/commentapi"
    topic="global"
    pageSize={5}
    RowTemplate={
      ({ comment = {} }) => {
        const {user,content,_commentTime} = comment
        return (<li>{user}:{content}<i style={{float:'right'}}>{moment.unix(_commentTime).fromNow()}</i></li>)
      }
    }
  />
  <AddComment />
</div>)