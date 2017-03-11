let state = {}

export default {
  add: (name, value) => {
    state = {
      ...state,
      [name]: value
    }
  },
  getAll: () => state
}
