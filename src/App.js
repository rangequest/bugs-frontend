import './App.css'
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'
import BugsList from './components/BugsList'
import Bugs from './components/Bugs'

const store = configureStore()

function App() {
  return (
    <Provider store={store}>
      <Bugs />
    </Provider>
  )
}

export default App
