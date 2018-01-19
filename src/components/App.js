import React, {Component} from 'react'
import {
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from 'reactstrap'

import './App.css'

import MoneyList from './MoneyList'

class App extends Component {
  state = {
    isOpen: false,
    filter: 'CATEGORY',
  }

  toggle = () => this.setState({isOpen: !this.state.isOpen})

  filterBy = filter => this.setState({filter})

  render() {
    const {filter} = this.state

    return (
      <div className="App">
        <Navbar className="app-navbar" light expand={false} sticky="top">
          <NavbarBrand href="/">The Money</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Button color="link" onClick={() => this.filterBy('CATEGORY')}>
                  By Category
                </Button>
              </NavItem>
              <NavItem>
                <Button color="link" onClick={() => this.filterBy('TYPE')}>
                  By Type
                </Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <MoneyList filter={filter} />
      </div>
    )
  }
}

export default App
