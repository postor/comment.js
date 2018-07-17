import { Component } from 'react'
import addComment from '../lib/add'

class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentText: '',
    }
  }

  render() {
    const { commentText } = this.state
    return (<div>
      <input
        value={commentText}
        onChange={(e) => this.setState({ commentText: e.target.value })}
      />
      <button onClick={() => {
        const user = {
          id: 1,
          name: 'josh',
        }, url = '/'

        addComment('/commentjs', 'global', {
          userId: user.id,
          user,
          content: commentText,
        })
          .then((insertedObj) => console.log({ insertedObj }))
          .catch((error) => console.log({ error }))
      }}>submit</button>
    </div>)
  }
}

export default Add