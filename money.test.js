import test from 'tape'
import money from './money'

test('money', (assert) => {
  // given
  money.add('grocery', 5)

  // when
  const actual = money.getAll()['grocery']
  const expected = 5

  // then
  assert.equal(actual, expected, 'should add and get single value')
  assert.end()
})
