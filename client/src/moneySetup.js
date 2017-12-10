import moneyFactory from './money'

const YEAR = 2017
const MONTH = 11

const initialRevenue = 5000
const theMoney = moneyFactory({
  [`${YEAR}-${MONTH}`]: {
    revenue: initialRevenue,
  },
})

export const entry = (year, month, category, name, price, type) => ({
  category,
  name,
  price,
  type,
  year,
  month,
})
const EntryTypes = {
  ONE_TIME: 'ONE_TIME',
  FIXED: 'FIXED',
}

const Categories = {
  GROCERY: 'GROCERY',
  STUFF: 'STUFF',
}

theMoney.add(
  entry(YEAR, MONTH, Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED),
)
theMoney.add(
  entry(YEAR, MONTH, Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED),
)
theMoney.add(
  entry(YEAR, MONTH, Categories.GROCERY, 'kiwi', 512, EntryTypes.ONE_TIME),
)
theMoney.add(
  entry(YEAR, MONTH, Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME),
)
theMoney.add(
  entry(YEAR, MONTH, Categories.STUFF, 'tv', 1100, EntryTypes.ONE_TIME),
)

export default theMoney
