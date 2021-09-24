import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getUnresolvedBugs, loadBugs, resolveBug } from '../store/bugs'

const BugsList = () => {
  const dispatch = useDispatch()

  const bugs = useSelector(getUnresolvedBugs)

  useEffect(() => {
    dispatch(loadBugs())
  }, [])

  return (
    <ul>
      {bugs.map(bug => (
        <React.Fragment>
          <li key={bug.id}>
            {bug.description} - <button onClick={() => dispatch(resolveBug(bug.id))}>Resolve</button>
          </li>
        </React.Fragment>
      ))}
    </ul>
  )
}

export default BugsList
