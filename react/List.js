import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { list, find, count } from '../lib/request'
import { getSse } from '../browser'

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
    }
    this._toClean = []
  }

  static propTypes = {
    commentapi: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    pageSize: PropTypes.number,
    refreshInterval: PropTypes.number,
    Container: PropTypes.any,
    RowTemplate: PropTypes.any,
    EmptyComponent: PropTypes.any,
    LoadingComponent: PropTypes.any,
    ShowMoreComponent: PropTypes.any,
  }

  static defaultProps = {
    pageSize: 20,
    refreshInterval: 60000,
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

    const { refreshInterval } = this.props
    if (refreshInterval) {
      const interval = setInterval(() => this.forceUpdate(), refreshInterval)
      this._toClean.push(() => clearInterval(interval))
    }

    const { topic, commentapi } = this.props
    const evtSource = getSse(commentapi)

    if (!evtSource) {
      return
    }
    //EventSource supported

    const listenner = (e) => {
      const obj = JSON.parse(e.data)
      if (obj.add) {
        this.loadNewComment(obj._id)
      } else if (obj.remove) {
        const { comments } = this.state
        this.setState({
          comments: comments.filter(x => x._id != obj._id)
        })
      } else if (obj.update) {

      }

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
    const { Container, RowTemplate, EmptyComponent, LoadingComponent, ShowMoreComponent } = this.props
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
    const { commentapi, topic, pageSize } = this.props
    if (loading || done) {
      return
    }
    const newest = moment().unix()
    this.setState({ loading: true, newest, })
    const [cancle1, promise1] = list(commentapi, topic, {
      limit: pageSize,
      skip: comments.length,
    })
    const [cancle2, promise2] = count(commentapi, topic)

    this._toClean.push(cancle1)
    this._toClean.push(cancle2)

    Promise.all([promise1, promise2])
      .then(([resultComments, count]) => {
        const { comments } = this.state
        const finalComments = [...comments, ...resultComments]
        this.setState({
          loading: false,
          done: finalComments.length >= count,
          comments: finalComments,
        })
        this._toClean = this._toClean.filter(x => x != cancle1 && x != cancle2)
      })
      .catch(error => {
        console.log(error)
        this.setState({
          loading: false,
        })
        this._toClean = this._toClean.filter(x => x != cancle)
      })
  }

  loadNewComment(_id) {
    const { commentapi, topic } = this.props
    const [cancle, promise] = find(commentapi, topic, _id)
    promise
      .then(comment => {
        const { comments } = this.state
        this.setState({ comments: [comment, ...comments] })
        this._toClean = this._toClean.filter(x => x != cancle)
      })
      .catch(error => {
        console.log({ error })
        this._toClean = this._toClean.filter(x => x != cancle)
      })

  }
}

export default List