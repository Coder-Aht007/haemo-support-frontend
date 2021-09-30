import React from "react";
import Routes from "./shared/routes";

import { Switch, useLocation } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "../components/shared/header";
import Sidebar from "../components/shared/sidebar";
import { BackgroundColorContext } from "../contexts/BackgroundColorContext";
import { routes } from "../components/shared/sidebar";
import FixedPlugin from "./FixedPlugin/FixedPlugin";
import ThemeContextWrapper from "../components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "../components/BackgroundColorWrapper/BackgroundColorWrapper";

const logo = require("../assets/img/react-logo.png").default;

var ps;

function Admin(props) {
  const location = useLocation();
  const mainPanelRef = React.useRef(null);
  const [sidebarOpened, setsidebarOpened] = React.useState(
    document.documentElement.className.indexOf("nav-open") !== -1
  );
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true,
      });
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  });
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }

    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location]);
  // this function opens and closes the sidebar on small devices
  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setsidebarOpened(!sidebarOpened);
  };
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (path.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  const hideNavigationComponents = () => {
    if (
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      location.pathname.includes("/set-password/")
    ) {
      return true;
    }
    return false;
  };

  return (
    <ThemeContextWrapper>
      <BackgroundColorWrapper>
        <BackgroundColorContext.Consumer>
          {({ color, changeColor }) => (
            <React.Fragment>
              <div className="wrapper">
                {hideNavigationComponents() ? null : (
                  <Sidebar
                    logo={{
                      innerLink: "/index",
                      text: "Haemo",
                      imgSrc: logo,
                    }}
                    toggleSidebar={toggleSidebar}
                  />
                )}
                <div className="main-panel" ref={mainPanelRef} data={color}>
                  {hideNavigationComponents() ? null : (
                    <AdminNavbar
                      brandText={getBrandText(location.pathname)}
                      toggleSidebar={toggleSidebar}
                      sidebarOpened={sidebarOpened}
                    />
                  )}
                  <Switch>
                    <Routes />
                  </Switch>
                </div>
              </div>
              {hideNavigationComponents() ? null : (
                <FixedPlugin bgColor={color} handleBgClick={changeColor} />
              )}
            </React.Fragment>
          )}
        </BackgroundColorContext.Consumer>
      </BackgroundColorWrapper>
    </ThemeContextWrapper>
  );
}

export default Admin;
