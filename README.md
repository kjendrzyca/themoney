# The Money

[![CircleCI](https://circleci.com/gh/kjendrzyca/themoney/tree/master.svg?style=svg)](https://circleci.com/gh/kjendrzyca/themoney/tree/master)

Instant visualization of your spending habits.

# Data structure

### Plain data
```
{
  '2017-01': {
    revenue: 5000,
    groupsState: {
      "GROCERY": {
        "tomato": [
          {
            "payment": 5,
            "type": "FIXED",
            "id": 0
          }
        ]
      },
      "STUFF": {
        "ps4pro": [
          {
            "payment": 400,
            "type": "ONE_TIME",
            "id": 0
          }
        ]
      }
    }
  }
}
```

### Representation
```
{
  "byCategory": {
    "GROCERY": {
      "kiwi": {
        total: 17,
        entries: [
          {payment: 5, type: EntryTypes.FIXED, id: 0},
          {payment: 12, type: EntryTypes.FIXED, id: 0},
        ]
      },
      "tomato": {
        total: 5,
        entries: [
          {payment: 5, type: EntryTypes.FIXED, id: 0}
        ]
      }
    }
  },
  "byEntryType": {
    "FIXED": {
      "kiwi": {
        total: 17,
        entries: [
          {entryKey: 'kiwi', payment: 5, type: EntryTypes.FIXED, id: 0},
          {entryKey: 'kiwi', payment: 12, type: EntryTypes.FIXED, id: 0},
        ],
      },
      "tomato": {
        total: 5,
        entries: [
          {entryKey: 'tomato', payment: 5, type: EntryTypes.FIXED, id: 0},
        ],
      }
    }
  },
  "byEntryTypeTotal": {
    "FIXED": 22
  },
  "byCategoryTotal": {
    "GROCERY": 22
  },
  "revenue": 0,
  "expenses": 22,
  "savings": -22
}
```

# TODO

1. ~~add import functionality to money to read from database~~
1. adding additional revenue
1. ~~add entry types getter/setter~~
1. add categories getter/setter (can be hardcoded list in the UI, but later it would be great to add new)
1. ~~handling different months~~
1. ~~parse price to number always or throw error~~
1. updating entry
1. deleting entry
1. locking a month
1. figure out how to add revenue per month
1. year/half-year/on-demand summary
1. rename category or entry type (id instead of hardcoded value?)
1. add list of single entries to each group in data representation (per entry type also?)

# Credits
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
