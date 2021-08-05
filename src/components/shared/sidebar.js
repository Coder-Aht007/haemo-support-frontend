import React from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";

import {
  FiHome,
  FiArrowLeftCircle,
  FiArrowRightCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

//import sidebar css from react-pro-sidebar module and our custom css
import "react-pro-sidebar/dist/css/styles.css";
import "./sidebar.css";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuCollapse: false,
    };
  }
  setMenuCollapse = (value) => {
    this.setState({
      menuCollapse: value,
    });
  };
  menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    this.state.menuCollapse ? this.setMenuCollapse(false) : this.setMenuCollapse(true);
  };

  render(){
      return(
        <>
        <div id="sidebar">
          {/* collapsed props to change menu size using menucollapse state */}
          <ProSidebar collapsed={this.state.menuCollapse}>
            <SidebarHeader>
              <div className="logotext">
                {/* small and big change using menucollapse state */}
                <p>{this.state.menuCollapse ? "" : "Haemo"}</p>
              </div>
              <div className="closemenu" onClick={this.menuIconClick}>
                {/* changing menu collapse icon on click */}
                {this.state.menuCollapse ? <FiArrowRightCircle /> : <FiArrowLeftCircle />}
              </div>
            </SidebarHeader>
            <SidebarContent>
              <Menu iconShape="square">
                <MenuItem active={true} icon={<FiHome />}>
                  Home
                  <Link to='/index' />
                </MenuItem>
              </Menu>
            </SidebarContent>
          </ProSidebar>
        </div>
      </>
      );
  }

}

export default Sidebar;
