import React, { Component } from 'react'
import {
  Row, Col,
} from 'reactstrap'

import NewEntry from './NewEntry'
import moneyInstance from './moneySetup.js'

const moneyRepresentation = moneyInstance.getRepresentation()
console.log('MONEY REPRESENTATION', moneyRepresentation)

class MoneyList extends Component {
  state = {
    representation: moneyRepresentation
  }

  addEntry = entry => {
    console.log('entry', entry)
    moneyInstance.add(entry)
    this.setState({
      representation: moneyInstance.getRepresentation()
    })
  }

  getItems = () => {
    const { filter } = this.props
    const { representation } = this.state


    const representationByFilter = filter === 'CATEGORY'
      ? representation.byCategory : representation.byEntryType

    const totalByFilter = filter === 'CATEGORY'
      ? representation.byCategoryTotal : representation.byEntryTypeTotal

    return Object.keys(representationByFilter).map(entry => {
      return (
        <Row key={entry}>
          <Col className="bold text-right" xs={6}>{entry}</Col>
          <Col className="bold text-left" xs={6}>{totalByFilter[entry]} (total)</Col>
          <hr />
          <Col xs={12}>
            {Object.entries(representationByFilter[entry]).map(entry => {
              return <Row key={entry}>
                <Col className="text-right">{entry[0]}:</Col>
                <Col className="text-left">{entry[1]}</Col>
              </Row>
            })}
          </Col>
          <hr />
        </Row>
      )
    })
  }

  render() {
    const { representation } = this.state

    return (
      <div className="MoneyList">
        <Row>
          <Col>
            <NewEntry
              addEntry={this.addEntry}
            />
          </Col>
        </Row>
        <Row>
          <Col className="text-muted">November</Col>
        </Row>
        <Row>
          <Col>Revenue: {representation.revenue}</Col>
          <Col>Expenses: {representation.expenses}</Col>
          <Col>Savings: {representation.savings}</Col>
          <hr />
        </Row>
        { this.getItems() }
      </div>
    );
  }
}

export default MoneyList
