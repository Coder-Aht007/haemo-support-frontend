import React, { Component } from "react";

export default class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      date_of_birth: "",
      phone_number: "",
      blood_group: "",
      password_confirm:"",
      redirect: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state)
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
    } = this.state;
    return (
      <div className="row">
        <div className="mt-5 mb-5 offset-4 col-4 card ">
          <h2>User Signup</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label for="username">Username</label>
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
              <label for="email">Email</label>
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
              <label for="password">Password</label>
              <input
                className="form-control"
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
              <label for="password_confirm">Confirm Password</label>
              <input
                className="form-control"
                type="password"
                name="password_confirm"
                onChange={this.onChange}
                minLength="4"
                maxLength="20"
                value={password_confirm}
                required
              />
            </div>
            <div className="form-group">
              <label for="phone_number">Phone Number</label>
              <input
                className="form-control"
                type="text"
                name="phone_number"
                onChange={this.onChange}
                minLength="4"
                maxLength="20"
                value={phone_number}
                required
              />
            </div>
            <div className="form-group">
              <label for="date_of_birth">Date Of Birth</label>
              <input
                className="form-control"
                type="date"
                name="date_of_birth"
                onChange={this.onChange}
                value={date_of_birth}
              />
            </div>
            <div>
              <label for="blood_group"></label>
              <select
                class="form-control"
                name="blood_group"
                value={blood_group}
                onChange={this.onChange}
              >
                <option label=" "></option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value='B-'>B-</option>
                <option value='O+'>O+</option>
                <option value='O-'>O-</option>
                <option value='AB+'>AB+</option>
                <option value='AB-'>AB-</option>
              </select>
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
