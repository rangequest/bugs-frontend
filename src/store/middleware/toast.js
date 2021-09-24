const error = store => next => action => {
  if (action.type === 'error') console.log('Tostify: ', action.payload.message)
  else return next(action)
}

export default error
