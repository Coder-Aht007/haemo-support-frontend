import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// reactstrap components
import { Nav } from "reactstrap";
import { BackgroundColorContext } from "../../contexts/BackgroundColorContext";
import Dashboard from "../Dashboard/index";
import Profile from "../profile/profile";
import AddBulkUsers from "../AddBulkUser/index";
import Requests from "../UserRequests/requests";
import { UserUtils } from "./user";

var ps;

export const routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    showToAdmin: true,
    showToUser: true,
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "tim-icons icon-single-02",
    component: Profile,
    showToAdmin: true,
    showToUser: true,
  },
  {
    path: "/requests",
    name: "My Requests",
    icon: "tim-icons icon-atom",
    component: Requests,
    showToAdmin: false,
    showToUser: true,
  },
  {
    path: "/addusers",
    name: "Add Users",
    icon: "fa fa-users",
    component: AddBulkUsers,
    showToAdmin: true,
    showToUser: false,
  },
];

function Sidebar(props) {
  const location = useLocation();
  const sidebarRef = React.useRef(null);
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebarRef.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  const { logo } = props;
  let logoImg = null;
  let logoText = null;
  if (logo !== undefined) {
    logoImg = (
      <Link
        to={logo.innerLink}
        className="simple-text logo-mini"
        onClick={props.toggleSidebar}
      >
        <div className="logo-img">
          <img src={logo.imgSrc} alt="react-logo" />
        </div>
      </Link>
    );
    logoText = (
      <Link
        to={logo.innerLink}
        className="simple-text logo-normal"
        onClick={props.toggleSidebar}
      >
        {logo.text}
      </Link>
    );
  }
  return (
    <BackgroundColorContext.Consumer>
      {({ color }) => (
        <div className="sidebar" data={color}>
          <div className="sidebar-wrapper" ref={sidebarRef}>
            {logoImg !== null || logoText !== null ? (
              <div className="logo">
                {logoImg}
                {logoText}
              </div>
            ) : null}
            <Nav>
              {routes.map((prop, key) => {
                if (UserUtils.isAdmin()) {
                  if (prop.showToAdmin) {
                    return (
                      <li
                        className={
                          activeRoute(prop.path) +
                          (prop.pro ? " active-pro" : "")
                        }
                        key={key}
                      >
                        <NavLink
                          to={prop.path}
                          className="nav-link"
                          activeClassName="active"
                        >
                          <i className={prop.icon} />
                          <p>{prop.name}</p>
                        </NavLink>
                      </li>
                    );
                  }
                  return <></>;
                } else if (prop.showToUser) {
                  return (
                    <li
                      className={
                        activeRoute(prop.path) + (prop.pro ? " active-pro" : "")
                      }
                      key={key}
                    >
                      <NavLink
                        to={prop.path}
                        className="nav-link"
                        activeClassName="active"
                      >
                        <i className={prop.icon} />
                        <p>{prop.name}</p>
                      </NavLink>
                    </li>
                  );
                } else {
                  return <></>;
                }
              })}
            </Nav>
          </div>
        </div>
      )}
    </BackgroundColorContext.Consumer>
  );
}

Sidebar.propTypes = {
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the text of the logo
    text: PropTypes.node,
    // the image src of the logo
    imgSrc: PropTypes.string,
  }),
};

export default Sidebar;

// icon: "tim-icons icon-puzzle-10",
