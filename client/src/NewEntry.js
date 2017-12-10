import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Input, Button} from 'reactstrap'

const Months = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
]

const EntryTypes = {
  ONE_TIME: 'ONE_TIME',
  FIXED: 'FIXED',
}

const Params = {
  YEAR: 'year',
  MONTH: 'month',
  CATEGORY: 'category',
  NAME: 'name',
  PRICE: 'price',
  TYPE: 'type',
}

const initialState = {
  [Params.YEAR]: new Date().getFullYear().toString(),
  [Params.MONTH]: (new Date().getMonth() + 1).toString(),
  [Params.CATEGORY]: '',
  [Params.NAME]: '',
  [Params.PRICE]: 0,
  [Params.TYPE]: '',
}

class NewEntry extends Component {
  static propTypes = {
    addEntry: PropTypes.func.isRequired,
  }

  state = initialState

  changeProperty = event => {
    console.log('event', event.target.name)
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  addEntry = () => {
    this.props.addEntry(this.state)
    this.setState(initialState)
  }

  render() {
    const {year, month, category, name, price, type} = this.state

    const isFormValid = category && name && price && type

    return (
      <div className="NewEntry">
        <Input
          type="text"
          name={Params.YEAR}
          id="yearInput"
          placeholder="Year..."
          value={year}
          onChange={this.changeProperty}
        />

        <Input
          type="select"
          name={Params.MONTH}
          id="categorySelect"
          value={month}
          onChange={this.changeProperty}
        >
          <option value="">Pick month...</option>
          {Months.map(monthName => (
            <option key={monthName} value={monthName}>
              {monthName}
            </option>
          ))}
        </Input>

        <Input
          type="text"
          name={Params.NAME}
          id="entryInput"
          placeholder="Entry..."
          value={name}
          onChange={this.changeProperty}
        />

        <Input
          type="number"
          name={Params.PRICE}
          id="priceInput"
          placeholder="Price..."
          value={price}
          onChange={this.changeProperty}
        />

        <Input
          type="select"
          name={Params.TYPE}
          id="entryTypeSelect"
          value={type}
          onChange={this.changeProperty}
        >
          <option value="">Pick entry type...</option>
          <option value={EntryTypes.ONE_TIME}>One Time</option>
          <option value={EntryTypes.FIXED}>Fixed</option>
        </Input>

        <Input
          type="select"
          name={Params.CATEGORY}
          id="categorySelect"
          value={category}
          onChange={this.changeProperty}
        >
          <option value="">Pick category...</option>
          <option value="GROCERY">Groceries</option>
          <option value="STUFF">Stuff</option>
        </Input>

        <Button disabled={!isFormValid} onClick={this.addEntry}>
          Add
        </Button>
      </div>
    )
  }
}

export default NewEntry
