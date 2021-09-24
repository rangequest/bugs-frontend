import { createSlice } from '@reduxjs/toolkit'
let lastProjectId = 0

const slice = createSlice({
  name: 'projects',
  initialState: [],
  reducers: {
    projectAdded: (projects, action) => {
      projects.push({
        id: ++lastProjectId,
        name: action.payload.name,
        completed: false,
      })
    },
    projectCompleted: (projects, action) => {
      const index = projects.findIndex(project => project.id === action.payload.id)
      projects[index].completed = true
    },
  },
})

export default slice.reducer

export const { projectAdded, projectCompleted } = slice.actions
