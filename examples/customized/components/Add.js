import React, { Component } from 'react'
import addComment from 'local-comment/lib/add'

const commentapi = '/commentapi'
const topic = 'global'

class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentText: '',
    }
  }

  render() {
    const { commentText } = this.state
    const { user } = this.props
    return (<div style={{
      position: 'relative'
    }}>
      <input style={{
        width: '20%'
      }}
        value={user}
        onChange={(e) => this.setState({ user: e.target.value })}
      />:
      <input style={{
        width: '60%'
      }}
        value={commentText}
        onChange={(e) => this.setState({ commentText: e.target.value })}
      />
      <button onClick={() => {
        addComment(commentapi, topic, {
          content: commentText,
          user,
        })
          .then(insertedObj => console.log({ insertedObj }))
          .then(() => this.setState({ commentText: '' }))
          .catch(error => console.log({ error }))
      }}>submit</button>
    </div>)
  }
}

export default Add