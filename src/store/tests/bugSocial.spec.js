import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { addBug, assignBugToUser, getUnresolvedBugs, loadBugs, resolveBug } from '../bugs'
import configureStore from '../configureStore'

describe('bugsSliceSocial', () => {
  let fakeAxios
  let store

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    store = configureStore()
  })

  const bugsSlice = () => store.getState().entities.bugs

  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  })

  describe('assign bug to a user', () => {
    it('should assign a bug to a user', async () => {
      fakeAxios.onPost('/bugs').reply(200, { id: 3, description: 'a' })
      fakeAxios.onPatch('/bugs/3').reply(200, { id: 3, userId: 6 })

      await store.dispatch(addBug({ description: 'a' }))
      const x = await store.dispatch(assignBugToUser(3, 6))

      expect(bugsSlice().list[0].user).toBe(6)
    })
  })

  describe('loading bugs', () => {
    describe('if the bugs exist in the cache', () => {
      it('they should not be fetched from the server again', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }])

        await store.dispatch(loadBugs())
        await store.dispatch(loadBugs())

        expect(fakeAxios.history.get.length).toBe(1)
      })
    })

    describe('if the bugs do not exist in the cache', () => {
      it('they should be fetched from the server', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }])

        await store.dispatch(loadBugs())

        expect(bugsSlice().list).toHaveLength(1)
      })
    })
    describe('loading indicator', () => {
      it('shold be true while fetching the bugs', () => {
        fakeAxios.onGet('/bugs').reply(() => {
          expect(bugsSlice().loading).toBe(true)
          return [200, [{ id: 1 }]]
        })

        store.dispatch(loadBugs())
      })

      it('shold be false after fetching the bugs', async () => {
        fakeAxios.onGet('/bugs').reply(200, [{ id: 1 }])
        await store.dispatch(loadBugs())
        expect(bugsSlice().loading).toBe(false)
      })

      it('shold be false after if server error', async () => {
        fakeAxios.onGet('/bugs').reply(500)
        await store.dispatch(loadBugs())
        expect(bugsSlice().loading).toBe(false)
      })
    })
  })

  it('should add the bug to the store if it saved in the database', async () => {
    // Arrange
    const bug = { description: 'a' }
    const savedBug = { ...bug, id: 1 }
    fakeAxios.onPost('/bugs').reply(200, savedBug)

    // Act
    await store.dispatch(addBug(bug))

    // Assert
    expect(bugsSlice().list).toContainEqual(savedBug)
  })

  it("should not add the bug to the store if it's not saved in the database", async () => {
    // Arrange
    const bug = { description: 'a' }
    fakeAxios.onPost('/bugs').reply(500)

    // Act
    await store.dispatch(addBug(bug))

    // Assert
    expect(bugsSlice().list).toHaveLength(0)
  })

  it('should update/resolve the bug to the store if it update/resolve in the database', async () => {
    // Arrange
    fakeAxios.onPost('/bugs').reply(200, { id: 1 })
    fakeAxios.onPatch('/bugs/1').reply(200, { id: 1, resolved: true })

    // Act
    await store.dispatch(addBug({}))
    await store.dispatch(resolveBug(1))

    // Assert
    expect(bugsSlice().list[0].resolved).toBe(true)
  })

  it('should not update/resolve the bug to the store if it did not update/resolve in the database', async () => {
    // Arrange
    fakeAxios.onPost('/bugs').reply(200, { id: 1 })
    fakeAxios.onPatch('/bugs/1').reply(500)

    // Act
    await store.dispatch(addBug({}))
    await store.dispatch(resolveBug(1))

    // Assert
    expect(bugsSlice().list[0].resolved).not.toBe(true)
  })

  it('should return the unresolved bug count', () => {
    const state = createState()
    state.entities.bugs.list = [{ id: 1, resolved: true }, { id: 2 }, { id: 3 }]

    const result = getUnresolvedBugs(state)

    expect(result).toHaveLength(2)
  })
})
