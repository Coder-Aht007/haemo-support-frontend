import React, { Component } from "react";
import classNames from "classnames";

// reactstrap components
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  Nav,
  Container,
  NavbarToggler,
  NavLink,
} from "reactstrap";

import { UserUtils } from "../shared/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

// class Header extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isNavOpen: false,
//     };
//     this.toggleNav = this.taggleNav.bind(this);
//   }

//   taggleNav() {
//     this.setState({
//       isNavOpen: !this.state.isNavOpen,
//     });
//   }

//   logOut= () => {
//     UserUtils.clearLocalStorage()
//   }

//   render() {
//     return (
//       <>
//         {/* <Navbar light color="light" expand="md">
//           <div className="container-fluid">
//             <NavbarToggler onClick={this.toggleNav} />
//             <NavbarBrand href="/">Heamo Support</NavbarBrand>
//             <Collapse isOpen={this.state.isNavOpen} navbar>
//               <Nav className="container-fluid" navbar>
//                 <NavItem>
//                   <NavLink className="nav-link" to="/index">
//                     <FontAwesomeIcon icon={faHome} /> Home
//                   </NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink className="nav-link" to="/profile">
//                     <FontAwesomeIcon icon={faBars} /> Profile
//                   </NavLink>
//                 </NavItem>
//               </Nav>
//               <Nav navbar>
//                 <NavItem>
//                   <a className='btn btn-sm' href='/login' onClick={this.logOut}>
//                     <FontAwesomeIcon icon={faSignOutAlt} />
//                     LOGOUT
//                   </a>
//                 </NavItem>
//               </Nav>
//             </Collapse>
//           </div>
//         </Navbar> */}

//       </>
//     );
//   }
// }

// export default Header;

function AdminNavbar(props) {
  const [collapseOpen, setcollapseOpen] = React.useState(false);
  const [color, setcolor] = React.useState("navbar-transparent");
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setcolor("bg-white");
    } else {
      setcolor("navbar-transparent");
    }
  };
  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setcolor("navbar-transparent");
    } else {
      setcolor("bg-white");
    }
    setcollapseOpen(!collapseOpen);
  };

  const logOut = () => {
    UserUtils.clearLocalStorage();
  };

  return (
    <>
      <Navbar className={classNames("navbar-absolute", color)} expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened,
              })}
            >
              <NavbarToggler onClick={props.toggleSidebar}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </NavbarToggler>
            </div>
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              {props.brandText}
            </NavbarBrand>
          </div>
          <NavbarToggler onClick={toggleCollapse}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="photo">
                    <img
                      alt="..."
                      src={require("../../assets/img/anime3.png").default}
                    />
                  </div>
                  <b className="caret d-none d-lg-block d-xl-block" />
                  <p className="d-lg-none">Log out</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Profile</DropdownItem>
                  </NavLink>
                  <DropdownItem divider tag="li" />
                  <NavLink tag="li">
                    <DropdownItem className="nav-item" onClick={logOut} href="/login">
                      Logout
                    </DropdownItem>
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className="separator d-lg-none" />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
