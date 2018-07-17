import React, { Component } from 'react'
import PropTypes from 'prop-types'
import addComment from '../lib/add'

class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentText: '',
    }
  }

  static propTypes = {
    commentjs: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
  }

  render() {
    const { commentText } = this.state
    const { commentjs, topic } = this.props
    return (<div>
      <input
        value={commentText}
        onChange={(e) => this.setState({ commentText: e.target.value })}
      />
      <button onClick={() => {
        addComment(commentjs, topic, {
          content: commentText,
        })
          .then(insertedObj => console.log({ insertedObj }))
          .then(() => this.setState({ commentText: '' }))
          .catch(error => console.log({ error }))
      }}>submit</button>
    </div>)
  }
}

export default Add