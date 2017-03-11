function moneyFactory () {
  let state = {}

  return {
    add: (entry) => {
      state = {
        ...state,
        [entry.category]: mergeCategory(state[entry.category], entry)
      }
    },
    getAll: () => state
  }
}

function mergeCategory (categoryState = {}, entry) {
  return {
    ...categoryState,
    [entry.name]: mergeEntry(categoryState[entry.name], entry)
  }
}

function mergeEntry (entryState = [], entry) {
  return [
    ...entryState,
    entry.price
  ]
}

export default moneyFactory
