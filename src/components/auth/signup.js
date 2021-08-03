import axios from "axios";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class login extends Component {
  constructor(props) {
    super(props);
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
    var config = {
      method: "post",
      url: "http://127.0.0.1:8000/auth/register",
      data: data,
    };
    axios(config)
      .then((res) => {
        this.props.history.push("/login");
      })
      .catch((err) => {
        console.log(err);
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
      document.getElementById("btnSubmit").disabled = true;
    } else {
      this.setState({
        error: "",
      });
      document.getElementById("btnSubmit").disabled = false;
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      date_of_birth: this.state.date_of_birth,
      phone_number: this.state.phone_number,
      blood_group: this.state.blood_group,
    };
    this.SignUp(data);
  }
  render() {
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
        <div className="mt-5 mb-5 offset-4 col-4 card ">
          <h2>User Signup</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
                type="tel"
                name="phone_number"
                onChange={this.onChange}
                placeholder="1234-9999999"
                pattern="[0-9]{4}-[0-9]{7}"
                value={phone_number}
                required
              />
                <small>Format: 1234-9999999</small>
            </div>
            <div className="form-group">
              <label htmlFor="date_of_birth">Date Of Birth</label>
              <input
                className="form-control"
                type="date"
                name="date_of_birth"
                onChange={this.onChange}
                value={date_of_birth}
              />
            </div>
            <div>
              <label htmlFor="blood_group">Blood Group</label>
              <select
                className="form-control"
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
              >
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
