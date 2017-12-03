import moneyFactory from './money';

export const YEAR = 2017
export const MONTH = 11

const initialRevenue = 5000;
const theMoney = moneyFactory({
  [`${YEAR}-${MONTH}`]: {
    revenue: initialRevenue,
  }
});

export const entry = (category, name, price, type) => ({ category, name, price, type, year: YEAR, month: MONTH })
const EntryTypes = {
  ONE_TIME: 'ONE_TIME',
  FIXED: 'FIXED',
}

const Categories = {
  GROCERY: 'GROCERY',
  STUFF: 'STUFF',
}

theMoney.add(entry(Categories.GROCERY, 'kiwi', 5, EntryTypes.FIXED))
theMoney.add(entry(Categories.GROCERY, 'kiwi', 12, EntryTypes.FIXED))
theMoney.add(entry(Categories.GROCERY, 'kiwi', 512, EntryTypes.ONE_TIME))
theMoney.add(entry(Categories.STUFF, 'ps4pro', 400, EntryTypes.ONE_TIME))
theMoney.add(entry(Categories.STUFF, 'tv', 1100, EntryTypes.ONE_TIME))

export default theMoney;
