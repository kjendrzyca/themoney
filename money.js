function moneyFactory (revenue = 0) {
  const state = {
    revenue,
    groupsState: {}
  }

  return {
    add: (entry) => {
      state.groupsState = {
        ...state.groupsState,
        [entry.category]: mergeCategory(state.groupsState[entry.category], entry)
      }
    },
    getAll: () => state.groupsState,
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

function getRepresentation ({groupsState, revenue}) {
  const byCategory = Object.keys(groupsState).map(categoryKey => {
    const entries = Object.keys(groupsState[categoryKey]).map(entryKey => {
      const total = groupsState[categoryKey][entryKey].reduce((sum, val) => sum + val.payment, 0)
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

  const flattenedWithoutCategory = Object.keys(groupsState)
    .map(categoryKey => groupsState[categoryKey])
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
  const expenses = byEntryTypeTotal.FIXED + byEntryTypeTotal.ONE_TIME
  const savings = revenue - expenses

  return {
    byCategory,
    byEntryType,
    byEntryTypeTotal,
    byCategoryTotal,
    revenue,
    expenses,
    savings
  }
}

export default moneyFactory
