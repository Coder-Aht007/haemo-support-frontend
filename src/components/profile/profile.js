import React, { Component } from "react";
import axios from "axios";

import {
  BASE_URL,
  GET_HEALTH_PROFILE,
  GET_USER_BASIC_DATA,
  EDIT_USER_DATA,
  DELETE_ILLNESS,
  EDIT_ILLNESS,
} from "../shared/axiosUrls";
import swal from "sweetalert";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";

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
      showModal: false,
      illness_id_to_edit:null,
      illness_name:"",
      date_occured:"",
      date_cured:"",
    };
    this.editProfile = this.editProfile.bind(this);
    this.getHealthProfileData = this.getHealthProfileData.bind(this);
    this.getUserProfileData = this.getUserProfileData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteIllness = this.deleteIllness.bind(this);
    this.editIllness = this.editIllness.bind(this);
  }

  setShow = (value) => {
    this.setState({
      showModal: value,
    });
  };

  editIllnessSubmit = (e) => {
    e.preventDefault();
    const id = this.state.illness_id_to_edit
    const data= {
      name: this.state.illness_name,
      date_occured: this.state.date_occured, 
      date_cured: this.state.date_cured
    }
    this.editIllness(id,data)

  }

  handleClose = () => this.setShow(false);
  handleShow = (illness) => {
    this.setState({
      illness_name: illness.name,
      illness_id_to_edit: illness.id,
      date_occured: illness.date_occured,
      date_cured: illness.date_cured
    })

    this.setShow(true);
  };
  async getHealthProfileData() {
    axios
      .get(BASE_URL + GET_HEALTH_PROFILE)
      .then((response) => {
        this.setState({
          healthProfile: response.data,
        });
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  async getUserProfileData() {
    axios
      .get(BASE_URL + GET_USER_BASIC_DATA)
      .then((response) => {
        this.setState({
          username: response.data.username,
          email: response.data.email,
          date_of_birth: response.data.date_of_birth,
          phone_number: response.data.phone_number,
          blood_group: response.data.blood_group,
        });
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  async editProfile(data) {
    const config = {
      method: "patch",
      url: BASE_URL + EDIT_USER_DATA,
      data: data,
    };
    axios(config)
      .then((res) => {
        const response = res.data.user;
        this.setState({
          username: response.username,
          email: response.email,
          date_of_birth: response.date_of_birth,
          phone_number: response.phone_number,
          blood_group: response.blood_group,
        });
        alert("Profile Edited");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async deleteIllness(id) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const url = BASE_URL + DELETE_ILLNESS + id + "/";
        console.log(url);
        const config = {
          method: "delete",
          url: url,
        };
        axios(config)
          .then((res) => {
            const response = res.data;
            this.setState({
              healthProfile: response,
            });
            alert("Illness Deleted");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  async editIllness(id, data) {
    const config = {
      method: "patch",
      url: BASE_URL + EDIT_ILLNESS + id + "/",
      data: data
    };
    axios(config)
      .then((res) => {
        const response = res.data;
        this.setState({
          healthProfile: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSubmit(e) {
    e.preventDefault();
    const data = {
      date_of_birth: this.state.date_of_birth,
      phone_number: this.state.phone_number,
      blood_group: this.state.blood_group,
    };
    this.editProfile(data);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    const user_data_request = axios.get(BASE_URL + GET_USER_BASIC_DATA);
    const user_profile_request = axios.get(BASE_URL + GET_HEALTH_PROFILE);
    axios
      .all([user_data_request, user_profile_request])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          console.log(responseTwo);
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

  renderIllnessItem(illness) {
    return (
      <>
        <tr id={illness.id}>
          <td>{illness.name}</td>
          <td>{illness.date_occured}</td>
          <td>{illness.date_cured}</td>
          <td>
            <button
              className="btn btn-sm"
              onClick={() => this.handleShow(illness)}
            >
              EDIT
            </button>
          </td>
          <td>
            <button
              className="btn btn-sm"
              onClick={() => this.deleteIllness(illness.id)}
            >
              DELETE
            </button>
          </td>
        </tr>
      </>
    );
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
                    <p className="text-secondary mb-1">
                      Times Donated: {this.state.healthProfile.times_donated}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-5 col-lg-6">
            <div className="card">
              <div className="card-body">
                <form onSubmit={this.onSubmit}>
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
                        className="form-control"
                        type="tel"
                        name="phone_number"
                        value={this.state.phone_number}
                        onChange={this.onChange}
                        placeholder="+929999999999"
                        pattern="^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$"
                        required
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
                  <div className="row mb-3">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Blood Group</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <div>
                        <select
                          className="form-control text-center"
                          name="blood_group"
                          value={this.state.blood_group}
                          onChange={this.onChange}
                        >
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
                    </div>
                  </div>
                  <div className="row">
                    <div className="col text-center">
                      <input
                        type="submit"
                        className="btn btn-primary"
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
                <h5 className="mb-3 text-center">Illness Record</h5>
                <table className="table table-dark">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Date Occured</th>
                      <th scope="col">Date Cured</th>
                      <th scope="col">Edit</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.healthProfile.illnesses ? (
                      this.state.healthProfile.illnesses.map((illness) => {
                        return this.renderIllnessItem(illness);
                      })
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.showModal}
          toggle={() => this.setShow(!this.state.showModal)}
        >
          <ModalHeader toggle={() => this.setShow(!this.state.showModal)}>
            Edit Illness
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.editIllnessSubmit}> 
              <FormGroup>
                <Label for="illness_name">Name</Label>
                <Input
                  type="text"
                  name="illness_name"
                  placeholder="Name of the Illness"
                  value={this.state.illness_name}
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="date_occured">Date Occured</Label>
                <Input
                  type="date"
                  name="date_occured"
                  value={this.state.date_occured}
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="date_cured">Date Cured</Label>
                <Input
                  type="date"
                  name="date_cured"
                  value={this.state.date_cured}
                  onChange={this.onChange}
                />
              </FormGroup>
              <Button
              color="primary"
              type="submit"
              onClick={() => this.setShow(!this.state.showModal)}
            >
              Submit
            </Button>{" "}
            </Form>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
