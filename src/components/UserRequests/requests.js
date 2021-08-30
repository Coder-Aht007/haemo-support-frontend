import React, { Component } from "react";
import axios from "axios";
import { Table } from "reactstrap";
import {
  BASE_URL,
  GET_USER_DONATION_REQUESTS,
  DELETE_REQUEST,
  EDIT_REQUEST,
} from "../shared/axiosUrls";
import swal from "sweetalert";
import { Modal, ModalHeader, ModalBody, Button, Form } from "reactstrap";
export default class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedRequests: [],
      approvedRequests: [],
      pendingRequests: [],
      showModal: false,
      quantity: 1,
      location: "",
      blood_group: "",
      priority: "",
      to_edit_id: null,
    };
    this.deleteRequest = this.deleteRequest.bind(this);
  }

  setShow = (value) => {
    this.setState({
      showModal: value,
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClose = () => {
    this.setShow(false);
    this.setState({
      quantity: 1,
      location: "",
      blood_group: "",
      priority: "",
      to_edit_id: null,
    });
  };

  handleShow = (req) => {
    this.setState({
      to_edit_id: req.id,
      quantity: req.quantity,
      location: req.location,
      blood_group: req.blood_group,
      priority: req.priority,
    });

    this.setShow(true);
  };

  editRequestSubmit = (e) => {
    e.preventDefault();
    console.log("here");

    const id = this.state.to_edit_id;
    if (id) {
      const data = {
        quantity: this.state.quantity,
        location: this.state.location,
        priority: this.state.priority,
        blood_group: this.state.blood_group,
      };
      this.editRequest(id, data);
      this.handleClose();
    }
  };

  async editRequest(id, data) {
    const config = {
      method: "patch",
      url: BASE_URL + EDIT_REQUEST + id + "/",
      data: data,
    };
    axios(config)
      .then((res) => {
        const data = res.data;
        let pendingRequests = [...this.state.pendingRequests]
        let objIndex = pendingRequests.findIndex((obj => obj.id === data.id));
        pendingRequests[objIndex] = data
        this.setState({
          pendingRequests:pendingRequests
        })
        alert("Request Edited");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async deleteRequest(id) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const url = BASE_URL + DELETE_REQUEST + id + "/";
        const config = {
          method: "delete",
          url: url,
        };
        axios(config)
          .then((res) => {
            console.log(res)
            if(res.status === 204)
            {
              alert("Request Deleted");
            }
            let pendingRequests = [...this.state.pendingRequests]
            let objIndex = pendingRequests.findIndex((obj => obj.id === id));
            pendingRequests.splice(objIndex,1)
            this.setState({
              pendingRequests:pendingRequests
            })
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  calculateRequestStats = (data) => {
    let completedRequests = data.filter((obj) => {
      return obj.is_complete === true;
    });
    data = data.filter((el) => !completedRequests.includes(el));
    let approvedRequests = data.filter((obj) => {
      return obj.is_approved === true;
    });
    let pendingRequests = data.filter((el) => !approvedRequests.includes(el));
    this.setState({
      completedRequests: completedRequests,
      pendingRequests: pendingRequests,
      approvedRequests: approvedRequests,
    });
  };
  componentDidMount() {
    //first filter out completed requests... then filter approved and not approved
    axios
      .get(BASE_URL + GET_USER_DONATION_REQUESTS)
      .then((res) => {
        let data = res.data;
        this.calculateRequestStats(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    const closeBtn = (
      <button className="close" onClick={this.handleClose}>
        &times;
      </button>
    );
    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row mt-5 mb-3">
            <div className="col-md-12 col-12">
              <div className="card text-center ">
                <div className="card-header">
                  <div className="card-title">My Requests</div>
                </div>
                <div className="card-body">
                  <div className="card-body">
                    {this.state.pendingRequests.length === 0 &&
                    this.state.approvedRequests.length === 0 &&
                    this.state.completedRequests.length === 0 ? (
                      "No Donation Requests"
                    ) : (
                      <>
                        <div className="table-full-width">
                          <Table>
                            <thead className="text-primary">
                              <tr id="tableHeader">
                                <th>Blood Group</th>
                                <th>Location</th>
                                <th>Quantity Needed</th>
                                <th>Edit</th>
                                <th>Delete</th>
                              </tr>
                            </thead>
                            {this.state.pendingRequests.length > 0 ? (
                              <tbody>
                                <tr id='pendingRequests'>
                                  <th colSpan="5">Pending Requests</th>
                                </tr>
                                {this.state.pendingRequests.map((req) => {
                                  return (
                                    <tr key={req.id}>
                                      <td>{req.blood_group}</td>
                                      <td>{req.location}</td>
                                      <td>{req.quantity}</td>
                                      <td>
                                        <button
                                          className="btn btn-sm"
                                          onClick={() => this.handleShow(req)}
                                        >
                                          EDIT
                                        </button>
                                      </td>
                                      <td>
                                        <button
                                          className="btn btn-sm"
                                          onClick={() =>
                                            this.deleteRequest(req.id)
                                          }
                                        >
                                          DELETE
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            ) : (
                              <></>
                            )}
                            {this.state.approvedRequests.length > 0 ? (
                              <tbody>
                                <tr id='approvedRequests'>
                                  <th colSpan="5">Approved Requests</th>
                                </tr>
                                {this.state.approvedRequests.map((req) => {
                                  return (
                                    <tr key={req.id}>
                                      <td>{req.blood_group}</td>
                                      <td>{req.location}</td>
                                      <td>{req.quantity}</td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            ) : (
                              <></>
                            )}
                            {this.state.completedRequests.length > 0 ? (
                              <tbody>
                                <tr id="completedRequests">
                                  <th colSpan="5">Completed Requests</th>
                                </tr>
                                {this.state.completedRequests.map((req) => {
                                  return (
                                    <tr key={req.id}>
                                      <td>{req.blood_group}</td>
                                      <td>{req.location}</td>
                                      <td>{req.quantity}</td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            ) : (
                              <></>
                            )}
                          </Table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          backdrop="static"
          isOpen={this.state.showModal}
          toggle={() => this.setShow(!this.state.showModal)}
        >
          <ModalHeader
            toggle={() => this.setShow(!this.state.showModal)}
            close={closeBtn}
          >
            "Edit Request"
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <Form onSubmit={this.editRequestSubmit}>
                <div className="form-group offset-3 col-6">
                  <label htmlFor="blood_group">Blood Group</label>
                  <select
                    className="form-control text-center"
                    name="blood_group"
                    id="blood_group"
                    value={this.state.blood_group}
                    onChange={this.onChange}
                    style={{ color: "#BA4A00" }}
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

                <div className="form-group offset-3 col-6">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    className="form-control text-center"
                    style={{ color: "#BA4A00" }}
                    type="number"
                    name="quantity"
                    id="quantity"
                    min="1"
                    max="10"
                    onChange={this.onChange}
                    value={this.state.quantity}
                    required
                  />
                </div>

                <div className="form-group offset-3 col-6">
                  <label htmlFor="priority">Priority</label>
                  <select
                    className="form-control text-center"
                    name="priority"
                    style={{ color: "#BA4A00" }}
                    id="priority"
                    value={this.state.priority}
                    onChange={this.onChange}
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div className="form-group offset-3 col-6">
                  <label htmlFor="location">Location</label>
                  <input
                    className="form-control text-center"
                    type="text"
                    name="location"
                    style={{ color: "#BA4A00" }}
                    id="location"
                    minLength="10"
                    onChange={this.onChange}
                    value={this.state.location}
                    required
                  />
                </div>
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
