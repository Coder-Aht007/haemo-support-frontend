import React, { Component } from "react";
import axios from "axios";
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

import { UserUtils } from "../shared/user";
import { Redirect, withRouter } from "react-router-dom";
import memoize from "memoize-one";
import DataTable, { createTheme } from "react-data-table-component";
import { toast } from "react-toastify";

createTheme("solarized", {
  background: {
    default: "primary",
  },
  context: {
    background: "#cb4b16",
    text: "#FFFFFF",
  },
  divider: {
    default: "#073642",
  },
  action: {
    button: "rgba(0,0,0,.54)",
    hover: "rgba(0,0,0,.08)",
    disabled: "rgba(0,0,0,.12)",
  },
});

const requestColumns = memoize(
  (handleShow, deleteRequest, showComments, completeRequest) => [
    {
      name: "Blood Group",
      selector: (row) => row["blood_group"],
    },
    {
      name: "Priority",
      selector: (row) => {
        if (row["priority"] === 1) {
          return "HIGH";
        } else if (row["priority"] === 2) {
          return "MEDIUM";
        } else {
          return "LOW";
        }
      },
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row["location"],
    },
    {
      name: "Quantity Needed",
      selector: (row) => row["quantity"],
    },
    {
      name: "Edit",
      sortable: false,

      cell: (row) =>
        row["status"] === 1 ? (
          <button className="btn btn-sm " onClick={() => handleShow(row)}>
            Edit
          </button>
        ) : (
          <></>
        ),
    },
    {
      name: "Delete",
      sortable: false,
      cell: (row) =>
        row["status"] === 1 ? (
          <button className="btn btn-sm " onClick={() => deleteRequest(row.id)}>
            Delete
          </button>
        ) : (
          <></>
        ),
    },
    {
      name: "Extras",
      sortable: false,
      cell: (row) =>
        row["status"] === 0 ? (
          <button
            className="btn btn-sm "
            onClick={() => showComments(row.comments)}
          >
            Comments
          </button>
        ) : row["status"] === 3 ? (
          <button
            className="btn btn-sm "
            onClick={() => completeRequest(row.id)}
          >
            Approve
          </button>
        ) : (
          <></>
        ),
    },
  ]
);

class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_admin: UserUtils.isAdmin(),
      requests: [],
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
        if (res.status === 200) {
          const data = res.data;
          let requests = [...this.state.requests];
          let objIndex = requests.findIndex((obj) => obj.id === data.id);
          requests[objIndex] = data;
          this.setState({
            requests: requests,
          });
          toast("Request Edited");
        }
      })
      .catch((err) => {
        toast(err.response.status + ": " + Object.values(err.response.data)[0]);
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
              toast("Request Deleted");
            }
            let requests = [...this.state.requests];
            let objToRemoveIndex = requests.findIndex((obj) => obj.id === id);
            requests.splice(objToRemoveIndex, 1);
            this.setState({
              requests: requests,
            });
          })
          .catch((err) => {
            toast(
              err.response.status + ": " + Object.values(err.response.data)[0]
            );
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
        if (res.status === 200) {
          toast("Request marked completed");
          const completedRequest = res.data;
          let requests = [...this.state.requests];
          let completedRequestIndex = requests.findIndex(
            (obj) => obj.id === completedRequest.id
          );
          // change the status to completed
          requests[completedRequestIndex].status = 4;
          this.setState({
            requests: requests,
          });
        }
      })
      .catch((err) => {
        toast(err.response.status + ": " + Object.values(err.response.data)[0]);
      });
  };

  componentDidMount() {
    if (!this.state.is_admin) {
      axios
        .get(BASE_URL + GET_USER_DONATION_REQUESTS)
        .then((res) => {
          if (res.status === 200) {
            let data = res.data.results;
            console.log(data);
            this.setState({
              requests: data,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  render() {
    if (this.state.is_admin) {
      return <Redirect to="/index" />;
    }
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
                  <DataTable
                    title="My Requests"
                    columns={requestColumns(
                      this.handleShow,
                      this.deleteRequest,
                      this.showComments,
                      this.completeRequest
                    )}
                    data={this.state.requests}
                    pagination={true}
                    paginationRowsPerPageOptions={[5, 10]}
                    paginationPerPage={5}
                    theme="solarized"
                  />
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

export default withRouter(Requests);
