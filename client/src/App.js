import React, { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'

import './App.css'

import MoneyList from './MoneyList.js'

class App extends Component {
  state = {
    isOpen: false
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div className="App">
        <Navbar
          light
          expand={false}
          sticky="top"
        >
          <NavbarBrand href="/">The Money</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="#">By Category</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">By Type</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <MoneyList />
      </div>
    );
  }
}

export default App;
