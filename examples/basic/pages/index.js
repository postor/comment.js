import { CommentList, CommentAdd, CommentCount } from 'local-comment/react'

const Group = ({ topic }) => (<div>
  <h2>topic: {topic}</h2>
  <CommentList
    commentapi="/commentapi"
    topic={topic}
    pageSize={5}
  />
  <CommentCount
    commentapi="/commentapi"
    topic={topic}
  />
  <CommentAdd
    commentapi="/commentapi"
    topic={topic}
  />
</div>)

export default () => (<div>
  <h1>local-comment</h1>
  <Group  topic="global"/>
  <hr />
  <Group  topic="index"/>
</div>)