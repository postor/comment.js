import List from '../react/List'
import Add from '../react/Add'
import Count from '../react/Count'

export default () => (<div>
  <h1>local-comment</h1>
  <List
    commentapi="/commentapi"
    topic="global"
    pageSize = {10}
  />

  <Add
    commentapi="/commentapi"
    topic="global"
  />

  <Count
    commentapi="/commentapi"
    topic="global"
  />
</div>)