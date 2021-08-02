import React,{Component} from 'react'
import { Navbar,Nav,NavbarToggler,Collapse,NavItem } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

class Header extends Component{
    constructor(props) {
        super(props);
        this.state={
            isNavOpen:false,
        }
        this.toggleNav=this.taggleNav.bind(this);
    }

    taggleNav()
    {
        this.setState({
            isNavOpen:!this.state.isNavOpen
        })
    }

    render() {
        return(
            <div>
                <Navbar light color="light" expand="md">
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNav} />
                        {/* <NavbarBrand className="mr-auto" href="/"><img src='assets/images/logo.png' height="30" width="41" alt='Haemo Support' /></NavbarBrand> */}
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link"  to='/index'><FontAwesomeIcon icon={faHome} /> Home</NavLink>
                            </NavItem>
                            </Nav>
                            {/* <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Button onClick={this.toggleModal}><span className="fa fa-sign-in" >LOGIN</span></Button>
                                </NavItem>
                            </Nav> */}
                        </Collapse>
                    </div>
                </Navbar>
            </div>
        );
    }
}

export default Header;