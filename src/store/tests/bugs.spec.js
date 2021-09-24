import { apiCallBegan } from '../api'
import { addBug, bugAdded, bugAddRequested } from '../bugs'
describe('bugsSlice', () => {
  describe('action creators', () => {
    it('addBug', () => {
      const bug = { description: 'a' }
      const result = addBug(bug)
      const expected = {
        type: apiCallBegan.type,
        payload: {
          url: '/bugs',
          method: 'post',
          data: bug,
          onStart: bugAddRequested.type,
          onSuccess: bugAdded.type,
        },
      }
      expect(result).toEqual(expected)
    })
  })
})
