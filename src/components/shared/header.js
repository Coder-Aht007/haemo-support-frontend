import React, { Component } from "react";
import {
  Navbar,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  NavbarBrand,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import {UserUtils} from '../shared/user'

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavOpen: false,
    };
    this.toggleNav = this.taggleNav.bind(this);
  }

  taggleNav() {
    this.setState({
      isNavOpen: !this.state.isNavOpen,
    });
  }

  logOut= () => {
    UserUtils.clearLocalStorage()
  }
  render() {
    return (
      <div>
        <Navbar light color="light" expand="md">
          <div className="container-fluid">
            <NavbarToggler onClick={this.toggleNav} />
            <NavbarBrand href="/">Heamo Support</NavbarBrand>
            <Collapse isOpen={this.state.isNavOpen} navbar>
              <Nav className="container" navbar>
                <NavItem>
                  <NavLink className="nav-link" to="/index">
                    <FontAwesomeIcon icon={faHome} /> Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/profile">
                    <FontAwesomeIcon icon={faBars} /> Profile
                  </NavLink>
                </NavItem>
              </Nav>
              <Nav navbar>
                <NavItem>
                  <a className='btn btn-sm' href='/login' onClick={this.logOut}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    LOGOUT
                  </a>
                </NavItem>
              </Nav>
            </Collapse>
          </div>
        </Navbar>
      </div>
    );
  }
}

export default Header;
