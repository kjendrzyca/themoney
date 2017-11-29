import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'

import moneyInstance from './moneySetup.js'

const representation = moneyInstance.getRepresentation()
console.log('MONEY REPRESENTATION', representation)

class MoneyList extends Component {
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
        {Object.keys(representation.byCategory).map(category => {
          return (
            <Row key={category}>
              <Col xs={6}>{category}</Col>
              <Col xs={6}>{Object.entries(representation.byCategory[category]).map(entry => {
                return <div key={entry}>{entry[0]}: {entry[1]}</div>
              })}</Col>
              <hr />
            </Row>
          )
        })}
      </div>
    );
  }
}

export default MoneyList
