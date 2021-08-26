import React, { Component } from "react";
import { withRouter } from "react-router";
import axios from "axios";
import { Redirect } from "react-router-dom";

import { UserUtils } from "../shared/user";
import { BASE_URL, GET_USER_BASIC_DATA, LOGIN_URL } from "../shared/axiosUrls";

class login extends Component {
  constructor(props) {
    super(props);
    this.loggedIn = UserUtils.getName() !== null && UserUtils.getName() !== "";
    this.state = {
      username: "",
      password: "",
      redirect: false,
      error: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.Login = this.Login.bind(this);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  Login(data) {
    const config = {
      method: "post",
      url: BASE_URL + LOGIN_URL,
      data: data,
    };
    axios(config)
      .then((res) => {
        UserUtils.setToken(res.data.access, res.data.refresh);
        UserUtils.setName(data.username);
        axios
          .get(BASE_URL + GET_USER_BASIC_DATA)
          .then((res) => {
            const data = res.data;
            console.log(data);
            UserUtils.setIsAdmin(data.is_admin);
          })
          .catch((err) => {})
          .finally(() => {
            if (UserUtils.getName() !== "" && UserUtils.getName()!==null && UserUtils.getIsAdmin()!==null) {
              this.props.history.push("/index");
            }
          });

      })
      .catch((err) => {
        console.log(err);
      })
  }

  onSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    this.Login(data);
  };
  render() {
    if (this.loggedIn) {
      return <Redirect to="/index" />;
    }
    const { username, password } = this.state;
    return (
      <div className="row ">
        <div className="mt-5 mb-5 offset-4 col-4 card ">
          <h2>User Login</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                className="form-control text-center"
                type="text"
                name="username"
                minLength="5"
                onChange={this.onChange}
                value={username}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control text-center"
                type="password"
                name="password"
                onChange={this.onChange}
                minLength="4"
                maxLength="20"
                value={password}
                required
              />
            </div>
            <span className='text-center'>{this.state.error}</span>
            <div className="form-group">
              <button type="submit" className="btn btn-primary mb-2 mt-2">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(login);
