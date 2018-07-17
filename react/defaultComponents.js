export const RowTemplate = (props) => (<li>{JSON.stringify(props.comment)}</li>)
export const Container = (props) => (<div>{props.children}</div>)
export const EmptyComponent = () => (<span>no comment yet!</span>)
export const LoadingComponent = () => (<span>loading...</span>)
export const ShowMoreComponent = ({ showMore, done }) => (<button
  onClick={() => showMore()}
  disabled={done}
>{done ? 'no more comments!' : 'Show More!'}</button>)