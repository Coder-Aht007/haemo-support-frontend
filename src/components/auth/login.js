import React, { Component } from "react";

export default class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          username: "",
          password:"",
          redirect:false
        };
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
      }
    
      onChange = (e) =>{
        this.setState({
          [e.target.name]: e.target.value,
        });
      }

  
  onSubmit(e) {
    e.preventDefault()
    alert(
      "USERNAME:" + this.state.username + "Password:" + this.state.password
    );
  }
  render() {
    const {username, password } = this.state;
    return (
        <div className='row'>
        <div className="mt-5 mb-5 offset-4 col-4 card ">
          <h2>User Login</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label for='username'>Username</label>
              <input
                className="form-control"
                type="text"
                name="username"
                minLength='5'
                onChange={this.onChange}
                value={username}
                required
              />
            </div>
            <div className="form-group">
              <label for='password'>Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                onChange={this.onChange}
                minLength='4'
                maxLength='20'
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
