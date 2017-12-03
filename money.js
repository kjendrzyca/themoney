const noDataAddedTo = state => !state || !state.groupsState || state.revenue === undefined

function moneyFactory (initialState = {}, entryTypes) {
  // example state
  // const state = {
  //   '2017-11': {
  //     revenue: 5000,
  //     groupsState: {
  //       GROCERY: [],
  //       STUFF: [],
  //     }
  //   }
  // }

  const state = initialState

  return {
    add: entry => {
      // init state if empty
      if (!state[`${entry.year}-${entry.month}`]) {
        state[`${entry.year}-${entry.month}`] = {
          groupsState: {},
          revenue: 0,
        }
      }

      if (!state[`${entry.year}-${entry.month}`].groupsState) {
        state[`${entry.year}-${entry.month}`].groupsState = {}
      }

      if (state[`${entry.year}-${entry.month}`].revenue === undefined) {
        state[`${entry.year}-${entry.month}`].revenue = 0
      }

      const parsedEntry = {
        ...entry,
        price: Number(entry.price),
      }

      const previousState = state[`${parsedEntry.year}-${parsedEntry.month}`]

      const newGroupsState = {
        ...previousState.groupsState,
        [parsedEntry.category]: mergeCategory(previousState.groupsState[parsedEntry.category], parsedEntry),
      }

      previousState.groupsState = newGroupsState
    },
    getAll: (year, month) => state[`${year}-${month}`].groupsState,
    getRepresentation: (year, month) => {
      if (noDataAddedTo(state[`${year}-${month}`])) {
        throw new Error('Add some entries or import data first!')
      }

      return getRepresentation(state[`${year}-${month}`])
    },
    entryTypes: {
      ...entryTypes,
      FIXED: 'FIXED',
      ONE_TIME: 'ONE_TIME',
    },
  }
}

function mergeCategory (categoryState = {}, entry) {
  return {
    ...categoryState,
    [entry.name]: mergeEntry(categoryState[entry.name], entry),
  }
}

function mergeEntry (entryState = [], entry) {
  return [
    ...entryState,
    {payment: entry.price, type: entry.type},
  ]
}

function getRepresentation ({groupsState, revenue}) {
  const groupsStateByDate = groupsState

  const byCategory = Object.keys(groupsStateByDate).map(categoryKey => {
    const entries = Object.keys(groupsStateByDate[categoryKey]).map(entryKey => {
      const total = groupsStateByDate[categoryKey][entryKey].reduce((sum, val) => sum + val.payment, 0)
      return {[entryKey]: total}
    }).reduce((acc, entry) => {
      return {
        ...acc,
        ...entry,
      }
    }, {})

    return {
      [categoryKey]: entries,
    }
  }).reduce((acc, entry) => {
    return {
      ...acc,
      ...entry,
    }
  }, {})

  const flattenedWithoutCategory = Object.keys(groupsStateByDate)
    .map(categoryKey => groupsStateByDate[categoryKey])
    .reduce((acc, entry) => {
      return {
        ...acc,
        ...entry,
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
      [type]: calculated,
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
    savings,
  }
}

export default moneyFactory
