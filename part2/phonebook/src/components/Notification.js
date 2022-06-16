const Notification = ({text, status}) => {
  const success = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const error = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const style = status === 'success' ? success : error

  if(!text){
    return null
  }
  
  return (
    <div style={style}>{text}</div>
  )
}

export default Notification