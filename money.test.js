import t from 'tape'
import moneyFactory from './money'

const entry = (category, name, price, type) => ({ category, name, price, type })
const EntryTypes = {
  ONE_TIME: 'ONE_TIME',
  FIXED: 'FIXED'
}

t.test('money', (st) => {
  st.test('should add single entry to the category', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'tomato', 5, EntryTypes.FIXED))
    money.add(entry('stuff', 'ps4pro', 400, EntryTypes.ONE_TIME))

    const actual = money.getAll()
    const expected = {
      grocery: {
        tomato: [{payment: 5, type: EntryTypes.FIXED}]
      },
      stuff: {
        ps4pro: [{payment: 400, type: EntryTypes.ONE_TIME}]
      }
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should add two single entries to the same category', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'tomato', 5, EntryTypes.ONE_TIME))
    money.add(entry('grocery', 'potato', 10, EntryTypes.ONE_TIME))

    const actual = money.getAll()['grocery']
    const expected = {
      tomato: [{payment: 5, type: EntryTypes.ONE_TIME}],
      potato: [{payment: 10, type: EntryTypes.ONE_TIME}]
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should make array of two entries with the same name', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'kiwi', 5, EntryTypes.ONE_TIME))
    money.add(entry('grocery', 'kiwi', 12, EntryTypes.ONE_TIME))

    const actual = money.getAll()['grocery']
    const expected = {
      kiwi: [
        {payment: 5, type: EntryTypes.ONE_TIME},
        {payment: 12, type: EntryTypes.ONE_TIME}
      ]
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })
})

t.test('money representation', (st) => {
  st.test('should group by category with calculated total payment', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'kiwi', 5))
    money.add(entry('grocery', 'kiwi', 12))
    money.add(entry('grocery', 'tomato', 5))

    const actual = money.getRepresentation()['byCategory']
    const expected = {
      grocery: {
        kiwi: 17,
        tomato: 5
      }
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should calculate total per group by category', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry('grocery', 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry('grocery', 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry('stuff', 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry('stuff', 'tv', 1100, EntryTypes.ONE_TIME))

    const actual = money.getRepresentation()['byCategoryTotal']
    const expected = {
      'grocery': 5 + 12 + 512,
      'stuff': 400 + 1100
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should group by entry type with calculated total payment', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry('grocery', 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry('grocery', 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry('stuff', 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry('stuff', 'tv', 1100, EntryTypes.ONE_TIME))

    const actual = money.getRepresentation()['byEntryType']
    const expected = {
      [EntryTypes.FIXED]: {
        kiwi: 17
      },
      [EntryTypes.ONE_TIME]: {
        ps4pro: 400,
        tv: 1100,
        kiwi: 512
      }
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should calculate total per group by entry', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry('grocery', 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry('grocery', 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry('stuff', 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry('stuff', 'tv', 1100, EntryTypes.ONE_TIME))

    const actual = money.getRepresentation()['byEntryTypeTotal']
    const expected = {
      [EntryTypes.FIXED]: 5 + 12,
      [EntryTypes.ONE_TIME]: 512 + 400 + 1100
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should save revenue', (assert) => {
    assert.equal(moneyFactory(5000).getRepresentation().revenue, 5000)
    assert.end()
  })

  st.test('should calculate savings', (assert) => {
    const money = moneyFactory(5000)
    money.add(entry('grocery', 'kiwi', 5, EntryTypes.FIXED))
    money.add(entry('grocery', 'kiwi', 12, EntryTypes.FIXED))
    money.add(entry('grocery', 'kiwi', 512, EntryTypes.ONE_TIME))
    money.add(entry('stuff', 'ps4pro', 400, EntryTypes.ONE_TIME))
    money.add(entry('stuff', 'tv', 1100, EntryTypes.ONE_TIME))

    const actual = money.getRepresentation()['savings']
    const expected = 5000 - (5 + 12 + 512 + 400 + 1100)

    assert.deepEqual(actual, expected)
    assert.end()
  })
})
