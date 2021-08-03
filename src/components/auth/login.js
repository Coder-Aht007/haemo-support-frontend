import React, { Component } from "react";
import { withRouter } from "react-router";
import axios from "axios";
import { Redirect } from "react-router-dom";

import UserUtils from "../shared/user";

class login extends Component {
  constructor(props) {
    super(props);
    this.loggedIn = UserUtils.getName() != null && UserUtils.getName() != "";
    this.state = {
      username: "",
      password: "",
      redirect: false,
      error: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  async Login(data) {
    var config = {
      method: "post",
      url: "http://127.0.0.1:8000/auth/login",
      data: data,
    };
    axios(config)
      .then((res) => {
        console.log(res);
        UserUtils.setToken(res.data.access, res.data.refresh);
        UserUtils.setName(data.username);
        this.props.history.push("/index");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSubmit(e) {
    e.preventDefault();
    var data = {
      username: this.state.username,
      password: this.state.password,
    };
    this.Login(data);
  }
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
