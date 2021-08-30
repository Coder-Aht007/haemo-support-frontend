import React, { Component } from "react";
import axios from "axios";

import {
  BASE_URL,
  GET_HEALTH_PROFILE,
  GET_USER_BASIC_DATA,
  EDIT_USER_DATA,
  DELETE_ILLNESS,
  EDIT_ILLNESS,
  ADD_ILLNESS,
} from "../shared/axiosUrls";
import swal from "sweetalert";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Progress,
  Tooltip,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardText,
} from "reactstrap";

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
      illness_id_to_edit: null,
      illness_name: "",
      date_occured: "",
      date_cured: "",
      prog: 0,
      tooltipOpen: false,
      id:null,
    };
    this.editProfile = this.editProfile.bind(this);
    this.getHealthProfileData = this.getHealthProfileData.bind(this);
    this.getUserProfileData = this.getUserProfileData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addIllness = this.addIllness.bind(this);
    this.deleteIllness = this.deleteIllness.bind(this);
    this.editIllness = this.editIllness.bind(this);
  }

  setTooltipOpen = (value) => {
    this.setState({
      tooltipOpen: value,
    });
  };
  toggle = () => this.setTooltipOpen(!this.state.tooltipOpen);

  calculateProgress = () => {
    let prog = 0;
    if (
      this.state.blood_group !== "" &&
      this.state.blood_group !== null &&
      this.state.healthProfile &&
      this.state.healthProfile.illnesses.length > 0
    ) {
      prog = 100;
    } else if (
      this.state.blood_group !== "" &&
      this.state.blood_group !== null
    ) {
      prog = 80;
    } else {
      prog = 50;
    }
    this.setState({
      prog: prog,
    });
  };

  setShow = (value) => {
    this.setState({
      showModal: value,
    });
  };

  editIllnessSubmit = (e) => {
    e.preventDefault();
    const id = this.state.illness_id_to_edit;
    if (id) {
      const data = {
        name: this.state.illness_name,
        date_occured: this.state.date_occured,
        date_cured: this.state.date_cured,
      };
      if (data.name !== "" && data.date_cured !== "" && data.date_occured !== "")
        this.editIllness(id, data);
      this.handleClose();
    } else {
      const data = {
        name: this.state.illness_name,
        date_occured: this.state.date_occured,
        date_cured: this.state.date_cured,
      };
      this.addIllness(data);
      this.handleClose();
    }
  };

  handleClose = () => {
    this.setShow(false);
    this.setState({
      illness_id_to_edit: null,
      illness_name: "",
      date_occured: "",
      date_cured: "",
    });
  };
  handleShow = (illness) => {
    this.setState({
      illness_name: illness.name,
      illness_id_to_edit: illness.id,
      date_occured: illness.date_occured,
      date_cured: illness.date_cured,
    });

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
        console.log(response)
        this.setState({
          username: response.data.username,
          email: response.data.email,
          date_of_birth: response.data.date_of_birth,
          phone_number: response.data.phone_number,
          blood_group: response.data.blood_group,
          id:response.data.id
        });
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  async editProfile(data) {
    const config = {
      method: "patch",
      url: BASE_URL + EDIT_USER_DATA + this.state.id + '/',
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
        this.calculateProgress();
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
            this.calculateProgress();
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
      data: data,
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

  async addIllness(data) {
    const config = {
      method: "post",
      url: BASE_URL + ADD_ILLNESS,
      data: data,
    };
    axios(config)
      .then((res) => {
        const response = res.data;
        console.log(res.data);
        this.setState({
          healthProfile: response,
        });
        this.calculateProgress();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSubmit(e) {
    e.preventDefault();
    let bg = null;
    if (this.state.blood_group !== "") {
      bg = this.state.blood_group;
    }
    const data = {
      date_of_birth: this.state.date_of_birth,
      phone_number: this.state.phone_number,
      blood_group: bg,
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
          this.setState({
            username: responseOne.data.username,
            email: responseOne.data.email,
            date_of_birth: responseOne.data.date_of_birth,
            phone_number: responseOne.data.phone_number,
            blood_group: responseOne.data.blood_group,
            healthProfile: responseTwo.data,
            id:responseOne.data.id
          });
          this.calculateProgress();
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
    const closeBtn = (
      <button className="close" onClick={this.handleClose}>
        &times;
      </button>
    );
    return (
      <div className="content">
        <Progress animated striped id="progressHover" value={this.state.prog} />
        <Tooltip
          placement="bottom"
          isOpen={this.state.tooltipOpen}
          target="progressHover"
          toggle={this.toggle}
        >
          Your Profile Progress
        </Tooltip>
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile</h5>
              </CardHeader>
              <CardBody>
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
                          <option value="">Not Chosen</option>
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
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar7.png"
                      alt="User"
                      className="rounded-circle"
                      width="150"
                    />
                    <h5 className="title">{this.state.username}</h5>
                  </a>
                  <p className="description">{this.state.email}</p>
                  <p className="description">
                    Times Donated: {this.state.healthProfile.times_donated}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-3 text-center">Illness Record</h5>
                <table className="table">
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
                <div className="col text-center">
                  <button
                    className="btn btn-sm"
                    onClick={() => this.setShow(true)}
                  >
                    Add Illness
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Modal
          backdrop="static"
          isOpen={this.state.showModal}
          toggle={() => this.setShow(!this.state.showModal)}
        >
          <ModalHeader
            toggle={() => this.setShow(!this.state.showModal)}
            close={closeBtn}
          >
            {this.state.illness_id_to_edit ? "Edit Illness" : "Add Illness"}
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <Form onSubmit={this.editIllnessSubmit}>
                <FormGroup>
                  <Label for="illness_name">Name</Label>
                  <Input
                    style={{ color: "#BA4A00  " }}
                    className="text-center"
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
                    style={{ color: "#BA4A00 " }}
                    className="text-center"
                    type="date"
                    name="date_occured"
                    value={this.state.date_occured}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="date_cured">Date Cured</Label>
                  <Input
                    style={{ color: "#BA4A00" }}
                    className="text-center"
                    type="date"
                    name="date_cured"
                    value={this.state.date_cured}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <div className="col text-center">
                  <Button
                    className="text-center"
                    color="primary"
                    onClick={this.handleClose}
                  >
                    Close
                  </Button>{" "}
                  <Button className="text-center" color="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
