import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { count } from '../lib/request'
import { getSse } from '../browser'


class Count extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
      inited: false,
    }
    this._toClean = []
  }

  static propTypes = {
    commentapi: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    Loading: PropTypes.any,
    Template: PropTypes.any,
  }

  static defaultProps = {
    Loading: () => (<span>loading...</span>),
    Template: ({ count }) => (<span>{count}</span>),
  }

  componentDidMount() {
    if (typeof window == 'undefined') {
      return
    }
    //browser only
    this.loadCount()

    const { topic, commentapi } = this.props
    const evtSource = getSse(commentapi)

    if (!evtSource) {
      return
    }
    //EventSource supported

    const listenner = (e) => {
      const obj = JSON.parse(e.data)
      const { count, inited } = this.state
      if (!inited) {
        //not inited
        return
      }

      if (obj.add) {
        this.setState({
          count: count + 1
        })
      } else if (obj.remove) {
        this.setState({
          count: count - 1
        })
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
    const { Loading, Template } = this.props
    const { count, inited } = this.state
    if (!inited) {
      return (<Loading />)
    }
    return (<Template count={count} />)
  }

  loadCount() {
    const { commentapi, topic, filter = {} } = this.props

    const [cancle, promise] = count(commentapi, topic, filter)
    this._toClean.push(cancle)
    promise
      .then(count => {
        console.log({ count })
        this.setState({
          count,
          inited: true,
        })
        this._toClean = this._toClean.filter(x => x != cancle)
      })
      .catch(error => {
        console.log(error)
        this._toClean = this._toClean.filter(x => x != cancle)
      })
  }
}

export default Count