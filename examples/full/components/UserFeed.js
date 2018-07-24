import { Component } from 'react'
import Link from 'next/link'
import moment from 'moment'
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
            Template={({ count }) => (<span style={{
              color: 'red',
            }}>{count}</span>)}
          />
          <span>feeds of user: {user}</span>
        </h4>
        <CommentList
          commentapi={commentapi}
          topic={topic}
          pageSize={5}
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
          ShowMoreComponent={
            ({ showMore, done }) => {
              return ((<button
                onClick={() => showMore()}
                disabled={done}
              >{done ? 'no more feeds!' : 'Show More!'}</button>))
            }
          }
        />
      </div>)
  }
}