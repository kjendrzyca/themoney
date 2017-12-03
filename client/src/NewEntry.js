import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'reactstrap'

const EntryTypes = {
  ONE_TIME: 'ONE_TIME',
  FIXED: 'FIXED',
}

const Params = {
  CATEGORY: 'category',
  NAME: 'name',
  PRICE: 'price',
  TYPE: 'type'
}

const initialState = {
  [Params.CATEGORY]: '',
  [Params.NAME]: '',
  [Params.PRICE]: 0,
  [Params.TYPE]: '',
}

class NewEntry extends Component {
  static propTypes = {
    addEntry: PropTypes.func.isRequired
  }

  state = initialState

  changeProperty = event => {
    console.log('event', event.target.name)
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  addEntry = () => {
    this.props.addEntry(this.state)
    this.setState(initialState)
  }

  render() {
    const { category, name, price, type } = this.state

    const isFormValid = category && name && price && type

    return (
      <div className="NewEntry">
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
          <option>Pick entry type...</option>
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
          <option>Pick category...</option>
          <option value={'GROCERY'}>Groceries</option>
          <option value={'STUFF'}>Stuff</option>
        </Input>

        <Button
          disabled={!isFormValid}
          onClick={this.addEntry}
        >
          Add
        </Button>
      </div>
    )
  }
}

export default NewEntry
