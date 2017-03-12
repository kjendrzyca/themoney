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
    getRepresentation: () => getRepresentation(state)
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

function getRepresentation (state) {
  const byCategory = Object.keys(state).map(categoryKey => {
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

  const flattenedWithoutCategory = Object.keys(state)
    .map(categoryKey => state[categoryKey])
    .reduce((acc, entry) => {
      return {
        ...acc,
        ...entry
      }
    }, {})

  const byEntryType = Object.keys(flattenedWithoutCategory).reduce((acc, entryKey) => {
    const flattened = flattenedWithoutCategory[entryKey].map(entryPayment => ({entryKey, ...entryPayment}))

    flattened.forEach(flattenedEntry => {
      if (!acc[flattenedEntry.type]) {
        acc[flattenedEntry.type] = {}
      }

      acc[flattenedEntry.type][flattenedEntry.entryKey] =
        (acc[flattenedEntry.type][flattenedEntry.entryKey] || 0) + flattenedEntry.payment
    })

    return acc
  }, {})

  const calculateTotal = groupedState => Object.keys(groupedState).reduce((acc, type) => {
    const groupForType = groupedState[type]
    const calculated = Object.keys(groupForType)
      .map(objectKey => groupForType[objectKey])
      .reduce((sum, val) => sum + val, 0)

    return {
      ...acc,
      [type]: calculated
    }
  }, {})

  const byEntryTypeTotal = calculateTotal(byEntryType)
  const byCategoryTotal = calculateTotal(byCategory)

  return {byCategory, byEntryType, byEntryTypeTotal, byCategoryTotal}
}

export default moneyFactory
