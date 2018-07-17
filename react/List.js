import { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import request from 'superagent'

import {
  Container,
  RowTemplate,
  EmptyComponent,
  LoadingComponent,
  ShowMoreComponent,
} from './defaultComponents'

class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      done: false,
      loading: false,
      comments: [],
      newest: moment().unix(),
      oldest: moment().unix(),
    }
    this._toClean = []
  }

  static propTypes = {
    commentjs: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    pageSize: PropTypes.number,
    Container: PropTypes.any,
    RowTemplate: PropTypes.any,
    EmptyComponent: PropTypes.any,
    LoadingComponent: PropTypes.any,
    ShowMoreComponent: PropTypes.any,
  }

  static defaultProps = {
    pageSize: 20,
    Container,
    RowTemplate,
    EmptyComponent,
    LoadingComponent,
    ShowMoreComponent,
  }

  componentDidMount() {
    if (typeof window == 'undefined') {
      return
    }
    //browser only
    this.showMore()

    if (typeof EventSource == 'undefined') {
      return
    }
    //EventSource supported
    const { topic, commentjs } = this.props
    const evtSource = new EventSource(`${commentjs}/sse`)
    const listenner = () => {
      this.loadNewComments()
    }
    evtSource.addEventListener(topic, listenner, false);
    this._toClean.push(() => {
      evtSource.removeEventListener(topic, listenner, false);
    })
  }

  componentWillUnmount() {
    this._toClean.forEach(x => x())
  }

  render() {
    const { Container, RowTemplate, EmptyComponent, LoadingComponent } = this.props
    const { comments, loading, done } = this.state
    return (<Container>
      {comments.map((x, i) => (<RowTemplate key={i} comment={x} />))}
      {(() => {
        if (loading) {
          return (<LoadingComponent />)
        }

        if (done) {
          if (!comments.length) {
            return (<EmptyComponent />)
          }
        }

        return (<ShowMoreComponent showMore={() => this.showMore()} done={done} />)
      })()}
    </Container>)
  }

  showMore() {
    const { loading, done, comments } = this.state
    const { commentjs } = this.props
    if (loading || done) {
      return
    }
    const newest = moment().unix()
    this.setState({ loading: true, newest, })
    request
      .get(`${commentjs}/comment`)
      .query(this.getShowMoreQuery())
      .then(r => r.body)
      .then((result) => {
        if (result.error) {
          return Promise.reject(result.error)
        }
        this.setState({
          loading: false,
          done: result.done,
          comments: comments.concat(result.comments)
        })

      })
      .catch(error => {
        console.log(error)
        this.setState({
          loading: false,
        })
      })
  }

  loadNewComments() {
    const { loading, done, comments } = this.state
    const { commentjs } = this.props
    if (loading) {
      return
    }
    this.setState({ loading: true })

    request
      .get(`${commentjs}/comment`)
      .query(this.getNewCommentsQuery())
      .then(r => r.body)
      .then((result) => {
        if (result.error) {
          return Promise.reject(result.error)
        }

        this.setState({
          loading: false,
          comments: result.comments.concat(comments)
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          loading: false,
        })
      })
  }

  getShowMoreQuery() {
    const { pageSize = 20, topic } = this.props
    const { comments, oldest = false, newest = false } = this.state
    const before = oldest ? oldest : moment().unix()
    return {
      topic,
      before,
      limit: pageSize,
      skip: comments.length,
    }
  }

  getNewCommentsQuery() {
    const { topic } = this.props
    const { newest = false } = this.state
    if (!newest) throw 'something wrong!'
    return {
      topic,
      after: newest,
      limit: 100,
    }
  }
}

export default List