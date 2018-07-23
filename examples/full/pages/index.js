import Group from '../components/Group'

export default () => (<div>
  <h1>comment and feed</h1>
  <div style={{
    width: '50%',
    float: 'left',
  }}>
    <Group user="josh" />
  </div>
  
  <div style={{
    width: '50%',
    float: 'right',
  }}>
    <Group user="postor" />
  </div>

</div>)