import reducer from './reducer'

function createStore(reducer) {
  let state
  let listeners = []

  function dispatch(action) {
    state = reducer(state, action)

    for (let index = 0; index < listeners.length; index++) {
      listeners[index]()
    }
  }

  function getState() {
    return state
  }

  function subscribe(listener) {
    listeners.push(listener)
  }

  return {
    subscribe,
    getState,
    dispatch,
  }
}

export default createStore(reducer)
