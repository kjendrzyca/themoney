import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Row, Col, Input, Button} from 'reactstrap'
import NewEntry from './NewEntry'
import moneyInstance, {entry as entryFactory} from '../moneySetup'

class MoneyList extends Component {
  static propTypes = {
    filter: PropTypes.string.isRequired,
  }

  state = {
    chosenYear: '',
    chosenMonth: '',
    representation: null,
    yearsWithMonths: moneyInstance.getYearsWithMonths() || {},
  }

  getItems = representation => {
    const {filter} = this.props

    const representationByFilter =
      filter === 'CATEGORY'
        ? representation.byCategory
        : representation.byEntryType

    const totalByFilter =
      filter === 'CATEGORY'
        ? representation.byCategoryTotal
        : representation.byEntryTypeTotal

    const {chosenMonth, chosenYear} = this.state
    const date = `${chosenYear}-${chosenMonth}`

    // eslint-disable-next-line arrow-body-style
    return Object.keys(representationByFilter).map(entryCategoryName => {
      return (
        <Row key={entryCategoryName}>
          <Col className="bold text-right" xs={6}>
            {entryCategoryName}
          </Col>
          <Col className="bold text-left" xs={6}>
            {totalByFilter[entryCategoryName]} (total)
          </Col>
          <hr />
          <Col xs={12}>
            {Object.entries(representationByFilter[entryCategoryName]).map(
              singleEntry => {
                const singleEntryName = singleEntry[0]
                const singleEntryProperties = singleEntry[1]

                return (
                  <Row key={singleEntryName}>
                    <Col xs={6} className="text-right">
                      {singleEntryName}:
                    </Col>
                    <Col xs={6} className="text-left">
                      {singleEntryProperties.total}
                    </Col>
                    <Col xs={12}>
                      {singleEntryProperties.entries.map(specificEntry => (
                        <Row>
                          <Col xs={6} className="text-right">
                            {specificEntry.payment}
                          </Col>
                          <Col xs={6} className="text-left">
                            <Button
                              // eslint-disable-next-line react/jsx-no-bind
                              onClick={this.removeEntry.bind(
                                this,
                                singleEntryName,
                                specificEntry.id,
                                date,
                              )}
                            >
                              DELETE
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                )
              },
            )}
          </Col>
          <hr />
        </Row>
      )
    })
  }

  addEntry = entry => {
    const {year, month, category, name, price, type} = entry
    moneyInstance.add(entryFactory(year, month, category, name, price, type))
    this.setState({
      chosenMonth: month,
      chosenYear: year,
      representation: moneyInstance.getRepresentation(year, month),
      yearsWithMonths: moneyInstance.getYearsWithMonths(),
    })
  }

  removeEntry = (entryName, id, date) => {
    moneyInstance.remove(entryName, id, date)
    this.setState(({chosenMonth, chosenYear}) => ({
      representation: moneyInstance.getRepresentation(chosenYear, chosenMonth),
    }))
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

    this.setState(
      {
        chosenMonth: propertyValue,
      },
      () => {
        const {chosenYear, chosenMonth} = this.state

        const representation =
          chosenYear && chosenMonth
            ? moneyInstance.getRepresentation(chosenYear, chosenMonth)
            : null

        this.setState({representation})
      },
    )
  }

  render() {
    const {
      chosenYear,
      chosenMonth,
      representation,
      yearsWithMonths,
    } = this.state

    return (
      <div className="MoneyList">
        <Row>
          <Col>
            <NewEntry addEntry={this.addEntry} />
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
              {Object.keys(yearsWithMonths)
                .reverse()
                .map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
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
              {(yearsWithMonths[chosenYear] || []).reverse().map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Input>
          </Col>
        </Row>
        <Row>
          {chosenMonth && (
            <Col className="text-muted">
              {chosenYear}-{chosenMonth}
            </Col>
          )}
        </Row>
        {representation && (
          <Row>
            <Col>Revenue: {representation.revenue}</Col>
            <Col>Expenses: {representation.expenses}</Col>
            <Col>Savings: {representation.savings}</Col>
            <hr />
          </Row>
        )}
        {representation && this.getItems(representation)}
      </div>
    )
  }
}

export default MoneyList
