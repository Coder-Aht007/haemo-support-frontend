import axios from "axios";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

import { UserUtils } from "../shared/user";
import { BASE_URL, REGISTER_URL } from "../shared/axiosUrls";
import { toast } from "react-toastify";

class login extends Component {
  constructor(props) {
    super(props);
    this.loggedIn = UserUtils.isLogin();
    this.state = {
      username: "",
      email: "",
      password: "",
      date_of_birth: "",
      phone_number: "",
      blood_group: "",
      password_confirm: "",
      redirect: false,
      error: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.passwordValidate = this.passwordValidate.bind(this);
    this.SignUp = this.SignUp.bind(this);
  }
  async SignUp(data) {
    const config = {
      method: "post",
      url: BASE_URL + REGISTER_URL,
      data: data,
    };
    axios(config)
      .then((res) => {
        this.props.history.push("/login");
      })
      .catch((err) => {
        toast(err.response.status + ": " +Object.values(err.response.data)[0]);
      });
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  passwordValidate() {
    if (this.state.password !== this.state.password_confirm) {
      this.setState({
        error: "Passwords Do not match",
      });
    } else {
      this.setState({
        error: "",
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    let bg = null;
    if (this.state.blood_group !== "") {
      bg = this.state.blood_group;
    }
    const data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      date_of_birth: this.state.date_of_birth,
      phone_number: this.state.phone_number,
      blood_group: bg,
    };
    this.SignUp(data);
  }
  render() {
    if (this.loggedIn) {
      return <Redirect to="/index" />;
    }
    const {
      username,
      password,
      date_of_birth,
      password_confirm,
      email,
      blood_group,
      phone_number,
      error,
    } = this.state;
    return (
      <div className="row">
        <div className="mt-5 mb-5 offset-md-4 col-md-4 offset-2 col-8 card">
          <h2>User Signup</h2>
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
              <label htmlFor="email">Email</label>
              <input
                className="form-control text-center"
                type="email"
                name="email"
                onChange={this.onChange}
                value={email}
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
                onKeyUp={this.passwordValidate}
                minLength="4"
                maxLength="20"
                value={password}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password_confirm">Confirm Password</label>
              <input
                className="form-control text-center"
                type="password"
                name="password_confirm"
                onChange={this.onChange}
                onKeyUp={this.passwordValidate}
                minLength="4"
                maxLength="20"
                value={password_confirm}
                required
              />
            </div>
            <span className="text-center text-danger">{error}</span>
            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                className="form-control text-center"
                type="tel"
                name="phone_number"
                onChange={this.onChange}
                placeholder="+923104756081"
                pattern="^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$"
                value={phone_number}
                required
              />
              <small>Format: +929999999999</small>
            </div>
            <div className="form-group">
              <label htmlFor="date_of_birth">Date Of Birth</label>
              <input
                className="form-control text-center"
                type="date"
                name="date_of_birth"
                onChange={this.onChange}
                value={date_of_birth}
              />
            </div>
            <div>
              <label htmlFor="blood_group">Blood Group</label>
              <select
                className="form-control text-center"
                name="blood_group"
                value={blood_group}
                onChange={this.onChange}
              >
                <option label=" "></option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="form-group">
              <button
                type="submit"
                id="btnSubmit"
                className="btn btn-primary mb-2 mt-2"
                disabled={this.state.error !== ""}
              >
                Submit
              </button>
            </div>
            <div class="text-center">
              Already Have an Account: <Link to="/login">Login</Link> Instead
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(login);
