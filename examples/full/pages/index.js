import Link from 'next/link'
import UserFeed from '../components/UserFeed'
export default () => (<div>
  <h1>comment and feed</h1>
  <UserFeed 
    user='josh'
  />

  <ul>
    <li>
      <Link href="/topic1?user=josh">
        <a>login as josh</a>
      </Link>
    </li>
    <li>
      <Link href="/topic1?user=postor">
        <a>login as postor</a>
      </Link>
    </li>
  </ul>

</div>)