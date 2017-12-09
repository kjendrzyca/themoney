import React, { Component } from 'react'
import {
  Row, Col, Input
} from 'reactstrap'

import NewEntry from './NewEntry'
import moneyInstance, { entry as entryFactory } from './moneySetup.js'

class MoneyList extends Component {
  state = {
    representation: null,
    chosenYear: '',
    chosenMonth: '',
    yearsWithMonths: moneyInstance.getYearsWithMonths() || {},
  }

  addEntry = entry => {
    console.log('entry', entry)
    const { year, month, category, name, price, type } = entry
    moneyInstance.add(entryFactory(year, month, category, name, price, type))
    this.setState({
      representation: moneyInstance.getRepresentation(year, month),
      yearsWithMonths: moneyInstance.getYearsWithMonths(),
    })
  }

  selectDate = event => {
    const propertyName = event.target.name
    const propertyValue = event.target.value

    if (propertyName === 'year') {
      this.setState({
        chosenYear: propertyValue,
        chosenMonth: '',
      })

      return
    }

    this.setState({
      chosenMonth: propertyValue,
    }, () => {
      const {chosenYear, chosenMonth} = this.state

      const representation = (chosenYear && chosenMonth)
        ? moneyInstance.getRepresentation(chosenYear, chosenMonth)
        : null;
      console.log('MONEY REPRESENTATION', representation)

      this.setState({ representation })
    })
  }

  getItems = representation => {
    const { filter } = this.props

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
    const { chosenYear, chosenMonth, representation, yearsWithMonths } = this.state

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
          <Col>
            <Input
              type="select"
              name="year"
              id="yearSelect"
              value={chosenYear}
              onChange={this.selectDate}
            >
              <option value="">Pick the year...</option>
              {
                Object.keys(yearsWithMonths)
                  .reverse()
                  .map(year => <option key={year} value={year}>{year}</option>)
              }
            </Input>
            <Input
              disabled={!chosenYear}
              type="select"
              name="month"
              id="monthSelect"
              value={chosenMonth}
              onChange={this.selectDate}
            >
              <option value="">Pick the month...</option>
              {
                (yearsWithMonths[chosenYear]|| [])
                  .reverse()
                  .map(month => <option key={month} value={month}>{month}</option>)
              }
            </Input>
          </Col>
        </Row>
        <Row>
          {chosenMonth && <Col className="text-muted">{chosenYear}-{chosenMonth}</Col>}
        </Row>
        { representation && <Row>
          <Col>Revenue: {representation.revenue}</Col>
          <Col>Expenses: {representation.expenses}</Col>
          <Col>Savings: {representation.savings}</Col>
          <hr />
        </Row>}
        { representation && this.getItems(representation) }
      </div>
    );
  }
}

export default MoneyList
