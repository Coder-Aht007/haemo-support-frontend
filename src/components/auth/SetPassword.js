import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL, SET_PASSWORD } from "../shared/axiosUrls";

const qs = require("qs");

export default class SetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_valid_request: false,
      error: "",
      redirect: false,
      uidb64: null,
      token: null,
      password: "",
      password_confirm: "",
    };
  }

  validatePassword = () => {
    if (this.state.password !== this.state.password_confirm) {
      this.setState({
        error: "Passwords Do not match",
      });
    } else {
      this.setState({
        error: "",
      });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const data = {
      uidb64: this.state.uidb64,
      token: this.state.token,
      password: this.state.password,
    };
    console.log(data);
    const config = {
      method: "post",
      data: data,
      url: BASE_URL + SET_PASSWORD,
    };
    axios(config)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Password Set Succesfully");
          this.setState({
            redirect: true,
          });
        }
      })
      .catch((err) => {
        toast.error(
          err.response.status + ": " + Object.values(err.response.data)[0]
        );
        this.setState({
          redirect: true,
        });
      });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    const uidb64 = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).uidb64;
    const token = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).token;
    this.setState({
      uidb64: uidb64,
      token: token,
    });
    axios
      .get(BASE_URL + SET_PASSWORD + "?uidb64=" + uidb64 + "&token=" + token)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            is_valid_request: true,
          });
        }
      })
      .catch((err) => {
        toast.error(
          err.response.status + ": " + Object.values(err.response.data)[0]
        );
        this.setState({
          redirect: true,
        });
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
    const { error, password, password_confirm } = this.state;
    return (
      <>
        {this.state.is_valid_request ? (
          <div className="row">
            <div className="mt-5 mb-5 offset-md-4 col-md-4 offset-2 col-8 card">
              <h2>Set Password Form</h2>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    className="form-control text-center"
                    type="password"
                    name="password"
                    onChange={this.onChange}
                    onKeyUp={this.validatePassword}
                    minLength="7"
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
                    onKeyUp={this.validatePassword}
                    minLength="7"
                    maxLength="20"
                    value={password_confirm}
                    required
                  />
                </div>
                <span className="text-center text-danger">{error}</span>

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
              </form>
            </div>
          </div>
        ) : (
          <>{this.state.error}</>
        )}
      </>
    );
  }
}
