function moneyFactory () {
  let state = {}

  return {
    add: (entry) => {
      state = {
        ...state,
        [entry.category]: mergeCategory(state, entry)
      }
    },
    getAll: () => state
  }
}

function mergeCategory (state, entry) {
  return {
    ...state[entry.category],
    [entry.name]: mergeEntry(state, entry)
  }
}

function mergeEntry (state, entry) {
  const alreadyExistingPayment = state[entry.category] && state[entry.category][entry.name]

  if (alreadyExistingPayment) {
    return [
      ...alreadyExistingPayment,
      entry.price
    ]
  }
  return [entry.price]
}

export default moneyFactory
