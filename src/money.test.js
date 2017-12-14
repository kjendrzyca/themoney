import assert from 'assert'
import moneyFactory from './money'

const DEFAULT_YEAR = '2017'
const DEFAULT_MONTH = '11'
const DEFAULT_DATE = '2017-11'

const entry = (
  category,
  name,
  price,
  type,
  id = 0,
  month = DEFAULT_MONTH,
  year = DEFAULT_YEAR,
) => ({
  id,
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

describe('money', () => {
  it('should add single entry to the category', () => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'tomato', 5, EntryTypes.FIXED))
    money.add(entry(Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME))

    const actual = money.getAll(DEFAULT_YEAR, DEFAULT_MONTH)
    const expected = {
      [Categories.GROCERY]: {
        tomato: [{id: 0, payment: 5, type: EntryTypes.FIXED}],
      },
      [Categories.STUFF]: {
        ps4pro: [{id: 0, payment: 400, type: EntryTypes.ONE_TIME}],
      },
    }

    assert.deepEqual(actual, expected)
  })

  it('should add two single entries to the same category', () => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'tomato', 5, EntryTypes.ONE_TIME))
    money.add(entry(Categories.GROCERY, 'potato', 10, EntryTypes.ONE_TIME))

    const actual = money.getAll(DEFAULT_YEAR, DEFAULT_MONTH)[Categories.GROCERY]
    const expected = {
      tomato: [{id: 0, payment: 5, type: EntryTypes.ONE_TIME}],
      potato: [{id: 0, payment: 10, type: EntryTypes.ONE_TIME}],
    }

    assert.deepEqual(actual, expected)
  })

  it('should make array of two entries with the same name', () => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.ONE_TIME))
    money.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.ONE_TIME))

    const actual = money.getAll(DEFAULT_YEAR, DEFAULT_MONTH)[Categories.GROCERY]
    const expected = {
      kiwi: [
        {id: 0, payment: 5, type: EntryTypes.ONE_TIME},
        {id: 0, payment: 12, type: EntryTypes.ONE_TIME},
      ],
    }

    assert.deepEqual(actual, expected)
  })

  it('should parse price that is a string', () => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'tomato', '5', EntryTypes.FIXED))

    const actual = money.getAll(DEFAULT_YEAR, DEFAULT_MONTH)
    const expected = {
      [Categories.GROCERY]: {
        tomato: [{id: 0, payment: 5, type: EntryTypes.FIXED}],
      },
    }

    assert.deepEqual(actual, expected)
  })

  it('should remove entry', () => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'tomato', '5', EntryTypes.FIXED, 1))
    money.add(entry(Categories.GROCERY, 'tomato', '8', EntryTypes.FIXED, 2))

    money.remove('tomato', 2, DEFAULT_DATE, Categories.GROCERY)

    const actual = money.getAll(DEFAULT_YEAR, DEFAULT_MONTH)[Categories.GROCERY]
    const expected = {
      tomato: [{id: 1, payment: 5, type: EntryTypes.FIXED}],
    }

    assert.deepEqual(actual, expected)
  })
})

describe('money representation', () => {
  it('should group by category with calculated total payment', () => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'tomato', 5, EntryTypes.FIXED))

    const actual = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)
      .byCategory

    const expected = {
      [Categories.GROCERY]: {
        kiwi: {total: 17},
        tomato: {total: 5},
      },
    }

    assert.deepEqual(actual, expected)
  })

  it('should calculate total per group by category', () => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'tv', 1100, EntryTypes.ONE_TIME))

    const actual = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)
      .byCategoryTotal
    const expected = {
      [Categories.GROCERY]: 5 + 12 + 512,
      [Categories.STUFF]: 400 + 1100,
    }

    assert.deepEqual(actual, expected)
  })

  it('should group by entry type with calculated total payment', () => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'tv', 1100, EntryTypes.ONE_TIME))

    const actual = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)
      .byEntryType
    const expected = {
      [EntryTypes.FIXED]: {
        kiwi: {total: 17},
      },
      [EntryTypes.ONE_TIME]: {
        ps4pro: {total: 400},
        tv: {total: 1100},
        kiwi: {total: 512},
      },
    }

    assert.deepEqual(actual, expected)
  })

  it('should calculate total per group by entry', () => {
    const money = moneyFactory()
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry(Categories.GROCERY, 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry(Categories.STUFF, 'tv', 1100, EntryTypes.ONE_TIME))

    const actual = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)
      .byEntryTypeTotal
    const expected = {
      [EntryTypes.FIXED]: 5 + 12,
      [EntryTypes.ONE_TIME]: 512 + 400 + 1100,
    }

    assert.deepEqual(actual, expected)
  })

  it('should return empty data when nothing is added', () => {
    const actual = moneyFactory().getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)
    assert.equal(actual.revenue, 0)
    assert.equal(actual.savings, 0)
    assert.equal(actual.expenses, 0)
    assert.deepEqual(actual.byCategory, {})
    assert.deepEqual(actual.byCategoryTotal, {})
    assert.deepEqual(actual.byEntryType, {})
    assert.deepEqual(actual.byEntryTypeTotal, {})
  })

  it('should return empty data when only revenue is added', () => {
    const actual = moneyFactory({
      '2017-11': {
        revenue: 5000,
      },
    }).getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)
    assert.equal(actual.revenue, 5000)
    assert.equal(actual.savings, 5000)
    assert.equal(actual.expenses, 0)
    assert.deepEqual(actual.byCategory, {})
    assert.deepEqual(actual.byCategoryTotal, {})
    assert.deepEqual(actual.byEntryType, {})
    assert.deepEqual(actual.byEntryTypeTotal, {})
  })

  it('should made correct calculations when only groupState is added', () => {
    const actual = moneyFactory({
      '2017-11': {
        groupsState: {
          GROCERY: {
            kiwi: [{payment: 5, type: 'FIXED'}],
          },
        },
      },
    }).getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)
    assert.equal(actual.revenue, 0)
    assert.equal(actual.savings, -5)
    assert.equal(actual.expenses, 5)
    assert.deepEqual(actual.byCategoryTotal, {
      GROCERY: 5,
    })
    assert.deepEqual(actual.byEntryTypeTotal, {
      FIXED: 5,
    })
  })

  it('should save revenue', () => {
    const money = moneyFactory({
      [DEFAULT_DATE]: {
        revenue: 5000,
      },
    })
    money.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
    assert.equal(
      money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH).revenue,
      5000,
    )
  })

  it('should calculate savings and expenses', () => {
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

    const actualExpenses = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)
      .expenses
    const expectedExpenses = 5 + 12 + 512 + 400 + 1100
    const actualSavings = money.getRepresentation(DEFAULT_YEAR, DEFAULT_MONTH)
      .savings
    const expectedSavings = 5000 - expectedExpenses

    assert.equal(actualExpenses, expectedExpenses)
    assert.equal(actualSavings, expectedSavings)
  })

  it('should provide standard entry types', () => {
    const money = moneyFactory()
    assert.deepEqual(money.entryTypes, {
      FIXED: 'FIXED',
      ONE_TIME: 'ONE_TIME',
    })
  })

  it('should add custom entry types', () => {
    const money = moneyFactory(
      {},
      {
        RARE: 'RARE',
      },
    )
    assert.deepEqual(money.entryTypes, {
      RARE: 'RARE',
      FIXED: 'FIXED',
      ONE_TIME: 'ONE_TIME',
    })
  })

  it('should return list of months grouped by year', () => {
    const money = moneyFactory()
    money.add(
      entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED, 1, '01', '2017'),
    )
    money.add(
      entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED, 2, '02', '2017'),
    )
    money.add(
      entry(Categories.GROCERY, 'tomato', 5, EntryTypes.FIXED, 3, '12', '2016'),
    )

    const actual = money.getYearsWithMonths()
    const expected = {
      2017: ['01', '02'],
      2016: ['12'],
    }

    assert.deepEqual(actual, expected)
  })
})
