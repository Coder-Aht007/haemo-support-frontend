import React, { Component } from "react";
import axios from "axios";
import {
  BASE_URL,
  GET_HEALTH_PROFILE,
  GET_USER_BASIC_DATA,
} from "../shared/axiosUrls";

export default class profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      date_of_birth: "",
      phone_number: "",
      blood_group: "",
      healthProfile: {},
    };
  }

  renderIllnessItem(illness) {
    return (
      <>
        <p>{illness.name} </p>
      </>
    );
  }

  componentDidMount() {
    const user_data_request = axios.get(BASE_URL + GET_USER_BASIC_DATA);
    const user_profile_request = axios.get(BASE_URL + GET_HEALTH_PROFILE);
    axios
      .all([user_data_request, user_profile_request])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          this.setState({
            username: responseOne.data.username,
            email: responseOne.data.email,
            date_of_birth: responseOne.data.date_of_birth,
            phone_number: responseOne.data.phone_number,
            blood_group: responseOne.data.blood_group,
            healthProfile: responseTwo.data,
          });
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  }
  render() {
    return (
      <>
        <div className="row gutters-sm mt-5">
          <div className="offset-1 col-md-3 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center mb-4">
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar7.png"
                    alt="User"
                    className="rounded-circle"
                    width="150"
                  />
                  <div className="mt-3">
                    <h4>{this.state.username}</h4>
                    <p className="text-secondary mb-1">{this.state.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-5 col-lg-6">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">User Name</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.username}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Phone</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.phone_number}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Date of Birth</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        className="form-control"
                        type="date"
                        name="date_of_birth"
                        onChange={this.onChange}
                        value={this.state.date_of_birth}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-9 text-secondary">
                      <input
                        type="button"
                        className="btn btn-primary px-4"
                        value="Save Changes"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-sm-12 offset-4 col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="d-flex align-items-center mb-3">
                  Illness Record
                </h5>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
