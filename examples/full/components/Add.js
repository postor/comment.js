import React, { Component } from 'react'
import { add as addComment, patch as patchComment } from 'local-comment/lib/request'


class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentText: '',
    }
  }

  render() {
    const { user, toUser } = this.props
    const { commentText, } = this.state
    return (<div style={{
      position: 'relative'
    }}>
      <span style={{
        minWidth: '20%'
      }}>{user}{toUser ? `[reply ${toUser}]` : ``}</span>:
      <input style={{
        width: '60%'
      }}
        value={commentText}
        onChange={(e) => this.setState({ commentText: e.target.value })}
      />
      <button onClick={() => this.handleAddComment()}>submit</button>
    </div>)
  }

  handleAddComment() {
    const { toUser } = this.props
    if (toUser) {
      this.replyComment(toUser)
    } else {
      this.addComment()
    }

  }

  addComment() {
    const { commentapi, topic, user } = this.props
    const { commentText } = this.state
    const [, promise1] = addComment(commentapi, topic, {
      content: commentText,
      user,
    })
    promise1
      .then(([comment, feed]) => { })
      .then(insertedObj => console.log({ insertedObj }))
      .then(() => this.setState({ commentText: '' }))
      .catch(error => console.log({ error }))
  }


  replyComment(toUser) {
    const { commentapi, topic, user } = this.props
    const { commentText } = this.state
    const feedTopic = `feed_${toUser}`
    const [, promise1] = addComment(commentapi, topic, {
      content: `@${toUser} ${commentText}`,
      user,
      toUser,
    })
    const [, promise2] = addComment(commentapi, feedTopic, {
      content: `${commentText}`,
      fromUser: user,
      route: `/`
    })

    Promise.all([
      promise1,
      promise2,
    ])
      .then(() => this.setState({ commentText: '' }))
      .catch(error => console.log({ error }))
  }

}

export default Add