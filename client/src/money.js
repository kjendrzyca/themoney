const generateId = () => Date.now()

function moneyFactory(initialState = {}, entryTypes) {
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
        [parsedEntry.category]: mergeCategory(
          previousState.groupsState[parsedEntry.category],
          parsedEntry,
        ),
      }

      previousState.groupsState = newGroupsState
    },
    remove: (entryName, id, date, category) => {
      state[date].groupsState[category][entryName] = {
        ...state[date].groupsState[category][entryName].filter(
          element => element.id !== id,
        ),
      }
    },
    getAll: (year, month) => state[`${year}-${month}`].groupsState,
    getRepresentation: (year, month) => {
      if (!state[`${year}-${month}`]) {
        return getRepresentation(state[`${year}-${month}`] || {})
      }

      return getRepresentation(state[`${year}-${month}`])
    },
    entryTypes: {
      ...entryTypes,
      FIXED: 'FIXED',
      ONE_TIME: 'ONE_TIME',
    },
    getYearsWithMonths: () =>
      Object.keys(state).reduce((prev, current) => {
        const [year, month] = current.split('-')

        const nextValue = {
          ...prev,
          [year]: [...(prev[year] || []), month],
        }

        return nextValue
      }, {}),
  }
}

function mergeCategory(categoryState = {}, entry) {
  return {
    ...categoryState,
    [entry.name]: mergeEntry(categoryState[entry.name], entry),
  }
}

function mergeEntry(entryState = [], entry) {
  return [
    ...entryState,
    {
      payment: entry.price,
      type: entry.type,
      id: entry.id !== undefined ? entry.id : generateId(),
    },
  ]
}

function getRepresentation({groupsState = {}, revenue = 0}) {
  const byCategory = Object.keys(groupsState)
    .map(categoryKey => {
      const entries = Object.keys(groupsState[categoryKey])
        .map(entryKey => {
          const total = groupsState[categoryKey][entryKey].reduce(
            (sum, val) => sum + val.payment,
            0,
          )
          return {[entryKey]: total}
        })
        .reduce(
          (acc, entry) => ({
            ...acc,
            ...entry,
          }),
          {},
        )

      return {
        [categoryKey]: entries,
      }
    })
    .reduce(
      (acc, entry) => ({
        ...acc,
        ...entry,
      }),
      {},
    )

  const flattenedWithoutCategory = Object.keys(groupsState)
    .map(categoryKey => groupsState[categoryKey])
    .reduce(
      (acc, entry) => ({
        ...acc,
        ...entry,
      }),
      {},
    )

  const byEntryType = Object.keys(flattenedWithoutCategory).reduce(
    (acc, entryKey) => {
      const flattened = flattenedWithoutCategory[entryKey].map(
        entryPayment => ({entryKey, ...entryPayment}),
      )

      flattened.forEach(flattenedEntry => {
        if (!acc[flattenedEntry.type]) {
          acc[flattenedEntry.type] = {}
        }

        acc[flattenedEntry.type][flattenedEntry.entryKey] =
          (acc[flattenedEntry.type][flattenedEntry.entryKey] || 0) +
          flattenedEntry.payment
      })

      return acc
    },
    {},
  )

  const calculateTotal = groupedState =>
    Object.keys(groupedState).reduce((acc, type) => {
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
  const expenses =
    (Number(byEntryTypeTotal.FIXED) || 0) +
    (Number(byEntryTypeTotal.ONE_TIME) || 0)
  const savings = revenue - expenses || 0

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
