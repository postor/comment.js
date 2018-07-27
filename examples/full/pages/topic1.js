import Group from '../components/Group'
import { withRouter } from 'next/router'

export default withRouter(({ router }) => {
  const { user = 'postor' } = router.query
  return (<Group user={user} topic="topic1" />)
})