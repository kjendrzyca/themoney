function moneyFactory () {
  let state = {}

  return {
    add: (entry) => {
      state = {
        ...state,
        [entry.category]: mergeCategory(state[entry.category], entry)
      }
    },
    getAll: () => state,
    getRepresentation: () => {
      return Object.keys(state).map(categoryKey => {
        const entries = Object.keys(state[categoryKey]).map(entryKey => {
          const total = state[categoryKey][entryKey].reduce((sum, val) => sum + val.payment, 0)
          return {[entryKey]: total}
        }).reduce((acc, entry) => {
          return {
            ...acc,
            ...entry
          }
        }, {})

        return {
          [categoryKey]: entries
        }
      }).reduce((acc, entry) => {
        return {
          ...acc,
          ...entry
        }
      }, {})
    }
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
    {payment: entry.price, type: entry.type}
  ]
}

export default moneyFactory
