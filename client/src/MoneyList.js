import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'

import moneyInstance from './moneySetup.js'

const representation = moneyInstance.getRepresentation()
console.log('MONEY REPRESENTATION', representation)

class MoneyList extends Component {
  getItems = () => {
    const { filter } = this.props;

    if (filter === 'CATEGORY') {
      return Object.keys(representation.byCategory).map(category => {
        return (
          <Row key={category}>
            <Col xs={6}>{category}</Col>
            <Col xs={6}>
              {Object.entries(representation.byCategory[category]).map(entry => {
                return <Row key={entry}>
                  <Col>{entry[0]}:</Col>
                  <Col>{entry[1]}</Col>
                </Row>
              })}
            </Col>
            <hr />
            <Col className="bold" xs={6}>Total:</Col>
            <Col className="bold" xs={6}>{representation.byCategoryTotal[category]}</Col>
            <hr />
          </Row>
        )
      })
    }

    return Object.keys(representation.byEntryType).map(type => {
      return (
        <Row key={type}>
          <Col xs={6}>{type}</Col>
          <Col xs={6}>
            {Object.entries(representation.byEntryType[type]).map(entry => {
              return <Row key={entry}>
                <Col>{entry[0]}:</Col>
                <Col>{entry[1]}</Col>
              </Row>
            })}
          </Col>
          <hr />
          <Col className="bold" xs={6}>Total:</Col>
          <Col className="bold" xs={6}>{representation.byEntryTypeTotal[type]}</Col>
          <hr />
        </Row>
      )
    })
  }

  render() {
    return (
      <div className="MoneyList">
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
