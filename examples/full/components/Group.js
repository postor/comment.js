import GlobalTopic from './GlobalTopic'
import UserFeed from './UserFeed'

export default ({ user }) => {

  return (<div>
    <UserFeed
      user={user}
    />
    <hr />
    <GlobalTopic
      user={user}
    />
  </div>)
}