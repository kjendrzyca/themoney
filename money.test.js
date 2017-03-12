import t from 'tape'
import moneyFactory from './money'

const entry = (category, name, price) => ({ category, name, price })

t.test('money', (st) => {
  st.test('should add single entry to the category', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'tomato', 5))
    money.add(entry('stuff', 'ps4pro', 400))

    const actual = money.getAll()
    const expected = {
      grocery: {
        tomato: [5]
      },
      stuff: {
        ps4pro: [400]
      }
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should add two single entries to the same category', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'tomato', 5))
    money.add(entry('grocery', 'potato', 10))

    const actual = money.getAll()['grocery']
    const expected = {
      tomato: [5],
      potato: [10]
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })

  st.test('should make array of two entries with the same name', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'kiwi', 5))
    money.add(entry('grocery', 'kiwi', 12))

    const actual = money.getAll()['grocery']
    const expected = {
      kiwi: [5, 12]
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })
})

t.test('money representation', (st) => {
  st.test('should represent total payment', (assert) => {
    const money = moneyFactory()
    money.add(entry('grocery', 'kiwi', 5))
    money.add(entry('grocery', 'kiwi', 12))
    money.add(entry('grocery', 'tomato', 5))

    const actual = money.getRepresentation()
    const expected = {
      grocery: {
        kiwi: 17,
        tomato: 5
      }
    }

    assert.deepEqual(actual, expected)
    assert.end()
  })
})
