import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { apiCallBegan } from './api'
import moment from 'moment'

let lastId = 0

const slice = createSlice({
  name: 'bugs',
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true
    },
    bugAddRequested: (bugs, action) => {
      bugs.loading = true
    },
    bugResolveRequested: (bugs, action) => {
      bugs.loading = true
    },
    bugAssignRequested: (bugs, action) => {
      bugs.loading = true
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false
    },
    bugsReceived: (bugs, action) => {
      bugs.loading = false
      bugs.list.push(...action.payload)
      bugs.lastFetch = Date.now()
    },
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload)
      bugs.loading = false
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex(bug => bug.id === action.payload.id)
      bugs.list[index].resolved = true
      bugs.loading = false
    },
    bugAssignedToUser: (bugs, action) => {
      const index = bugs.list.findIndex(bug => bug.id === action.payload.id)
      const userId = action.payload.userId
      bugs.list[index].user = userId
      bugs.loading = false
    },
  },
})

export default slice.reducer

export const {
  bugAdded,
  bugResolved,
  bugAddRequested,
  bugResolveRequested,
  bugAssignedToUser,
  bugsReceived,
  bugsRequested,
  bugAssignRequested,
  bugsRequestFailed,
} = slice.actions

const url = '/bugs'

export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs

  const diffInMinutes = moment().diff(moment(lastFetch), 'minute')
  if (diffInMinutes < 10) return

  return dispatch(
    apiCallBegan({
      url,
      onFailure: bugsRequestFailed.type,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
    })
  )
}

export const addBug = bug =>
  apiCallBegan({
    url,
    method: 'post',
    data: bug,
    onStart: bugAddRequested.type,
    onSuccess: bugAdded.type,
  })

export const resolveBug = id =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: 'patch',
    data: { resolved: true },
    onStart: bugResolveRequested.type,
    onSuccess: bugResolved.type,
  })

export const assignBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: `${url}/${bugId}`,
    method: 'patch',
    data: { userId },
    onStart: bugAssignRequested.type,
    onSuccess: bugAssignedToUser.type,
  })

export const getUnresolvedBugs = createSelector(
  state => state.entities.bugs,
  bugs => bugs.list.filter(bug => !bug.resolved)
)
