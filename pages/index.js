import List from '../react/List'


import {
  Container,
  RowTemplate,
  EmptyComponent,
  LoadingComponent,
  ShowMoreComponent,
} from '../react/defaultComponents'

export default () => (<div>
  <h1>comment.js</h1>
  <List 
    commentjs="/commentjs"
    topic="global"
  />
</div>)