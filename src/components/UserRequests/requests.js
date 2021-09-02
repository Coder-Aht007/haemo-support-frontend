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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
export default class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedRequests: [],
      approvedRequests: [],
      pendingRequests: [],
      rejectedRequests: [],
      inProgressRequests: [],
      showModal: false,
      quantity: 1,
      location: "",
      blood_group: "",
      priority: 1,
      to_edit_id: null,
      description: "",
      selectedFile: null,
      imageURL: null,
    };
    this.deleteRequest = this.deleteRequest.bind(this);
  }

  setShow = (value) => {
    this.setState({
      showModal: value,
    });
  };

  onChange = (e) => {
    if (e.target.id === "selectedFile") {
      this.setState({
        [e.target.id]: e.target.files[0],
        imageURL: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  handleClose = () => {
    this.setShow(false);
    this.setState({
      quantity: 1,
      location: "",
      blood_group: "",
      priority: 1,
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
      description: req.description,
      imageURL: req.document,
    });

    this.setShow(true);
  };

  showComments = (comment) => {
    swal({
      title: "Comments",
      text: comment,
      icon: "info",
    });
  };
  editRequestSubmit = (e) => {
    e.preventDefault();

    const id = this.state.to_edit_id;
    if (id) {
      const formData = new FormData();
      formData.append("quantity", this.state.quantity);
      formData.append("blood_group", this.state.blood_group);
      formData.append("location", this.state.location);
      formData.append("priority", this.state.priority);
      formData.append("description", this.state.description);
      if (this.state.selectedFile !== null) {
        formData.append(
          "document",
          this.state.selectedFile,
          this.state.selectedFile.name
        );
      }
      this.editRequest(id, formData);
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
        let pendingRequests = [...this.state.pendingRequests];
        let objIndex = pendingRequests.findIndex((obj) => obj.id === data.id);
        pendingRequests[objIndex] = data;
        this.setState({
          pendingRequests: pendingRequests,
        });
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
            if (res.status === 204) {
              alert("Request Deleted");
            }
            let pendingRequests = [...this.state.pendingRequests];
            let objToRemoveIndex = pendingRequests.findIndex(
              (obj) => obj.id === id
            );
            pendingRequests.splice(objToRemoveIndex, 1);
            this.setState({
              pendingRequests: pendingRequests,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
  completeRequest = async (id) => {
    const url = BASE_URL + EDIT_REQUEST + id + "/";
    const data = {
      is_complete: true,
    };
    const config = {
      method: "patch",
      url: url,
      data: data,
    };
    axios(config)
      .then((res) => {
        const completedRequest = res.data;
        let inProgressRequests = [...this.state.inProgressRequests];
        let completedRequests = [...this.state.completedRequests];
        let completedRequestIndex = inProgressRequests.findIndex(
          (obj) => obj.id === completedRequest.id
        );
        const completed = inProgressRequests.splice(completedRequestIndex, 1);
        completedRequests.push(completed[0]);
        this.setState({
          completedRequests: completedRequests,
          inProgressRequests: inProgressRequests,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  calculateRequestStats = (data) => {
    let completedRequests = data.filter((obj) => {
      return obj.is_complete === true;
    });
    data = data.filter((el) => !completedRequests.includes(el));
    let inProgressRequests = data.filter((obj) => {
      return obj.in_progress === true;
    });
    data = data.filter((el) => !inProgressRequests.includes(el));
    let approvedRequests = data.filter((obj) => {
      return obj.is_approved === true;
    });
    let rejectedRequests = data.filter((obj) => {
      return obj.is_rejected === true;
    });
    let pendingRequests = data.filter((el) => !rejectedRequests.includes(el));
    this.setState({
      completedRequests: completedRequests,
      pendingRequests: pendingRequests,
      approvedRequests: approvedRequests,
      rejectedRequests: rejectedRequests,
      inProgressRequests: inProgressRequests,
    });
  };
  componentDidMount() {
    //first filter out completed requests... then filter approved and not approved
    axios
      .get(BASE_URL + GET_USER_DONATION_REQUESTS)
      .then((res) => {
        let data = res.data.results;
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
                    this.state.completedRequests.length === 0 &&
                    this.state.rejectedRequests.length === 0 &&
                    this.state.inProgressRequests ? (
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
                                <th>Extras</th>
                              </tr>
                            </thead>
                            {this.state.pendingRequests.length > 0 ? (
                              <tbody>
                                <tr id="pendingRequests">
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
                                      <td></td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            ) : (
                              <></>
                            )}
                            {this.state.inProgressRequests.length > 0 ? (
                              <tbody>
                                <tr id="inProgressRequests">
                                  <th colSpan="5">In Progress Requests</th>
                                </tr>
                                {this.state.inProgressRequests.map((req) => {
                                  return (
                                    <tr key={req.id}>
                                      <td>{req.blood_group}</td>
                                      <td>{req.location}</td>
                                      <td>{req.quantity}</td>
                                      <td></td>
                                      <td></td>
                                      <td>
                                        <button
                                          className="btn btn-sm"
                                          onClick={() =>
                                            this.completeRequest(req.id)
                                          }
                                        >
                                          Approve
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
                                <tr id="approvedRequests">
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
                                      <td></td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            ) : (
                              <></>
                            )}
                            {this.state.rejectedRequests.length > 0 ? (
                              <tbody>
                                <tr id="rejectedRequests">
                                  <th colSpan="5">Rejected Requests</th>
                                </tr>
                                {this.state.rejectedRequests.map((req) => {
                                  return (
                                    <tr key={req.id}>
                                      <td>{req.blood_group}</td>
                                      <td>{req.location}</td>
                                      <td>{req.quantity}</td>
                                      <td></td>
                                      <td></td>
                                      <td>
                                        <button
                                          className="btn btn-sm"
                                          onClick={() =>
                                            this.showComments(req.comments)
                                          }
                                        >
                                          Details
                                        </button>
                                      </td>
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
          isOpen={this.state.showModal}
          toggle={() => this.setShow(!this.state.showModal)}
        >
          <ModalHeader
            toggle={() => this.setShow(!this.state.showModal)}
            close={closeBtn}
          >
            Edit Request
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <Form onSubmit={this.editRequestSubmit}>
                <div className="form-group offset-md-2 col-md-8 col-12">
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
                <div className="form-group offset-md-2 col-md-8 col-12">
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
                <div className="form-group offset-md-2 col-md-8 col-12">
                  <label htmlFor="priority">Priority</label>
                  <select
                    className="form-control text-center"
                    name="priority"
                    style={{ color: "#BA4A00" }}
                    id="priority"
                    value={this.state.priority}
                    onChange={this.onChange}
                  >
                    <option value={1}>HIGH</option>
                    <option value={2}>MEDIUM</option>
                    <option value={3}>LOW</option>
                  </select>
                </div>

                <div className="form-group offset-md-2 col-md-8 col-12">
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
                <div className="form-group offset-md-2 col-md-8 col-12">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control text-center"
                    style={{ color: "#BA4A00" }}
                    name="description"
                    id="description"
                    onChange={this.onChange}
                    value={this.state.description}
                    required
                  />
                </div>

                <div className="form-group offset-md-2 col-md-8 col-12">
                  <a
                    href={this.state.imageURL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={this.state.imageURL} alt="" />
                  </a>

                  <label
                    htmlFor="selectedFile"
                    className="text-center custom-file-upload col-12"
                  >
                    <input
                      name="selectedFile"
                      id="selectedFile"
                      type="file"
                      onChange={this.onChange}
                      accept=".jpeg, .jpg, .png"
                    />
                    <FontAwesomeIcon icon={faUpload} /> Upload Document
                  </label>
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
