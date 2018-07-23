import { Component } from 'react'
import { remove } from 'local-comment/lib/request'
import { CommentCount, CommentList } from 'local-comment/react'

const commentapi = "/commentapi"

export default class UserFeed extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { user } = this.props
    const topic = `feed_${user}`
    return (
      <div>
        <h4>
          <CommentCount
            commentapi={commentapi}
            topic={topic}
          />
          <span>feeds of user: {user}</span>
        </h4>
        <CommentList
          commentapi={commentapi}
          topic={topic}
          RowTemplate={
            ({ comment = {} }) => {
              const { fromUser, content, _commentTime, _id, href } = comment
              return (<li>
                <span>{fromUser}:{content}</span>
                <button
                  onClick={() => {
                    remove(commentapi, topic, _id)
                  }}
                >delete</button>
                <i style={{ float: 'right' }}>{moment.unix(_commentTime).fromNow()}</i>
                <p><Link href={href}><a>go to page</a></Link></p>
              </li>)
            }
          }
        />
      </div>)
  }
}