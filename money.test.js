import t from 'tape'
import moneyFactory from './money'

const DEFAULT_YEAR = '2017'
const DEFAULT_MONTH = '11'
const DEFAULT_DATE = '2017-11'

const entry = (
  category,
  name,
  price,
  type,
  month = DEFAULT_MONTH,
  year = DEFAULT_YEAR,
) => ({
  category,
  name,
  price,
  type,
  month,
  year,
})

const EntryTypes = {
  ONE_TIME: 'ONE_TIME',
  FIXED: 'FIXED',
}

const Categories = {
  GROCERY: 'GROCERY',
  STUFF: 'STUFF',
}

t.test('money', (st) => {
  st.test('should add single entry to the category', assert => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'tomato', 5, EntryTypes.FIXED))
    money.add(entry(Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME))

    const actual = money.getAll(DEFAULT_YEAR, DEFAULT_MONTH)
    const expected = {
      [Categories.GROCERY]: {
        tomato: [{payment: 5, type: EntryTypes.FIXED}],
      },
      [Categories.STUFF]: {
        ps4pro: [{payment: 400, type: EntryTypes.ONE_TIME}],
      },
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should add two single entries to the same category', assert => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'tomato', 5, EntryTypes.ONE_TIME))
    money.add(entry(Categories.GROCERY, 'potato', 10, EntryTypes.ONE_TIME))

    const actual = money.getAll(DEFAULT_YEAR, DEFAULT_MONTH)[Categories.GROCERY]
    const expected = {
      tomato: [{payment: 5, type: EntryTypes.ONE_TIME}],
      potato: [{payment: 10, type: EntryTypes.ONE_TIME}],
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should make array of two entries with the same name', assert => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.ONE_TIME))
    money.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.ONE_TIME))

    const actual = money.getAll(DEFAULT_YEAR, DEFAULT_MONTH)[Categories.GROCERY]
    const expected = {
      kiwi: [
        {payment: 5, type: EntryTypes.ONE_TIME},
        {payment: 12, type: EntryTypes.ONE_TIME},
      ],
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })
})

t.test('money representation', (st) => {
  st.test('should group by category with calculated total payment', assert => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'kiwi', 5))
    money.add(entry(Categories.GROCERY, 'kiwi', 12))
    money.add(entry(Categories.GROCERY, 'tomato', 5))

    const actual = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)['byCategory']
    const expected = {
      [Categories.GROCERY]: {
        kiwi: 17,
        tomato: 5,
      },
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should calculate total per group by category', assert => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'tv', 1100, EntryTypes.ONE_TIME))

    const actual = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)['byCategoryTotal']
    const expected = {
      [Categories.GROCERY]: 5 + 12 + 512,
      [Categories.STUFF]: 400 + 1100,
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should group by entry type with calculated total payment', assert => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'tv', 1100, EntryTypes.ONE_TIME))

    const actual = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)['byEntryType']
    const expected = {
      [EntryTypes.FIXED]: {
        kiwi: 17,
      },
      [EntryTypes.ONE_TIME]: {
        ps4pro: 400,
        tv: 1100,
        kiwi: 512,
      },
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should calculate total per group by entry', assert => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'tv', 1100, EntryTypes.ONE_TIME))

    const actual = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)['byEntryTypeTotal']
    const expected = {
      [EntryTypes.FIXED]: 5 + 12,
      [EntryTypes.ONE_TIME]: 512 + 400 + 1100,
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should throw error when no data is added', assert => {
    const gettingRepresentation = () => moneyFactory({
      '2017-11': {
        revenue: 5000,
      },
    }).getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)
    assert.throws(gettingRepresentation, /Add some entries or import data first!/)
    assert.end()
  })

  st.test('should save revenue', assert => {
    const money = moneyFactory({
      [DEFAULT_DATE]: {
        revenue: 5000,
      },
    })
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
    assert.equal(money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH).revenue, 5000)
    assert.end()
  })

  st.test('should calculate savings and expenses', assert => {
    const money = moneyFactory({
      [DEFAULT_DATE]: {
        revenue: 5000,
      },
    })
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'tv', 1100, EntryTypes.ONE_TIME))

    const actualExpenses = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)['expenses']
    const expectedExpenses = 5 + 12 + 512 + 400 + 1100
    const actualSavings = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)['savings']
    const expectedSavings = 5000 - expectedExpenses

    assert.equal(actualExpenses, expectedExpenses)
    assert.equal(actualSavings, expectedSavings)
    assert.end()
  })
})
