import React, { Component } from "react";
import axios from "axios";
import {
  BASE_URL,
  GET_OLD_DONATION_REQUESTS,
  WEB_SOCKET_PATH,
  POST_DONATION_REQUEST,
  APPROVE_DONATION_REQUESTS,
} from "../shared/axiosUrls";
import Chart from "./donation_requests_chart";
import jwt_decode from "jwt-decode";
import { Card, CardBody, Table } from "reactstrap";

import { UserUtils } from "../shared/user";
import DataTable, { createTheme } from "react-data-table-component";
import swal from "sweetalert";

const token = UserUtils.getAccessToken()
const columns = [
  {
    name: "Blood Group",
    selector: (row) => row["blood_group"],
    sortable: true,
  },
  {
    name: "Quantity Needed",
    selector: (row) => row["quantity"],
    sortable: true,
    right: true,
  },
  {
    name: "Location",
    selector: (row) => row["location"],
    sortable: true,
    right: true,
  },
  {
    name: "Priority",
    selector: (row) => row["priority"],
    sortable: true,
    right: true,
  },
];

const conditionalRowStyles = [
  {
    when: (row) => row["priority"] === "HIGH",
    style: {
      backgroundColor: "#F7BEC0",
      color: "black",
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
  {
    when: (row) => row["priority"] === "MEDIUM",
    style: {
      backgroundColor: "#FFFFE0",
      color: "black",
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
];

createTheme("solarized", {
  text: {
    primary: "white",
    secondary: "#525f7f",
  },
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

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      quantity: 1,
      location: "",
      blood_group: "A+",
      priority: "HIGH",
      stats: [],
      is_admin: null,
      to_approve_requests: null,
    };
    // eslint-disable-next-line
    let donationSocket = null;
  }

  calculateDonationRequestsStats = async () => {
    const reqs = [...this.state.requests];
    let arr = [];
    let count = 0;
    count = reqs.reduce(
      (acc, cur) => (cur.blood_group === "A+" ? acc + cur.quantity : acc),
      0
    );
    arr.push(count);
    count = reqs.reduce(
      (acc, cur) => (cur.blood_group === "A-" ? acc + cur.quantity : acc),
      0
    );
    arr.push(count);
    count = reqs.reduce(
      (acc, cur) => (cur.blood_group === "B+" ? acc + cur.quantity : acc),
      0
    );
    arr.push(count);
    count = reqs.reduce(
      (acc, cur) => (cur.blood_group === "B-" ? acc + cur.quantity : acc),
      0
    );
    arr.push(count);
    count = reqs.reduce(
      (acc, cur) => (cur.blood_group === "O+" ? acc + cur.quantity : acc),
      0
    );
    arr.push(count);
    count = reqs.reduce(
      (acc, cur) => (cur.blood_group === "O-" ? acc + cur.quantity : acc),
      0
    );
    arr.push(count);
    count = reqs.reduce(
      (acc, cur) => (cur.blood_group === "AB+" ? acc + cur.quantity : acc),
      0
    );
    arr.push(count);
    count = reqs.reduce(
      (acc, cur) => (cur.blood_group === "AB-" ? acc + cur.quantity : acc),
      0
    );
    arr.push(count);
    this.setState({
      stats: arr,
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const data = {
      quantity: this.state.quantity,
      blood_group: this.state.blood_group,
      location: this.state.location,
      priority: this.state.priority,
    };
    // if (this.donationSocket && this.donationSocket.readyState === WebSocket.OPEN) {
    //   this.donationSocket.send(
    //     JSON.stringify({
    //       request: request,
    //     })
    //   );
    // } else {
    //   console.warn("websocket is not connected");
    // }
    // this.setState({
    //   quantity: 0,
    //   location: "",
    //   blood_group: "A+",
    // });
    const config = {
      method: "post",
      url: BASE_URL + POST_DONATION_REQUEST,
      data: data,
    };
    axios(config)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({
          quantity: 0,
          location: "",
          blood_group: "A+",
          priority: "HIGH",
        });
      });
  };

  approveRequests = () => {
    if (this.state.to_approve_requests) {
      swal({
        title: "Are you sure?",
        text: "You want to approve these requests....?",
        icon: "warning",
        buttons: true,
      }).then((willDelete) => {
        if (willDelete) {
          let req = [...this.state.to_approve_requests];
          const ids = req.map((obj) => obj.id);
          const data = {
            ids,
          };
          const config = {
            method: "put",
            url: BASE_URL + APPROVE_DONATION_REQUESTS,
            data: data,
          };
          axios(config)
            .then((res) => {
              const data = res.data;
              let currentData = [...this.state.requests]
              currentData = currentData.filter((el1) => !data.find(el2=> el2.id ===el1.id));
              this.setState({
                requests: currentData
              })
              this.calculateDonationRequestsStats()
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };
  checkIsAdmin = () => {
    let decodedToken = jwt_decode(UserUtils.getAccessToken());
    this.setState({
      is_admin: decodedToken.is_admin,
    });
  };

  componentDidMount() {
    this.checkIsAdmin();
    axios
      .get(BASE_URL + GET_OLD_DONATION_REQUESTS)
      .then((res) => {
        const reqs = res.data;
        this.setState({
          requests: reqs,
        });
        this.calculateDonationRequestsStats();
      })
      .catch((err) => {
        console.log(err);
      });

    this.donationSocket = new WebSocket(WEB_SOCKET_PATH+ "?token=" + token);

    this.donationSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      let updated_requests = [...this.state.requests];
      updated_requests.push(data);
      this.setState({
        requests: updated_requests,
      });
      this.calculateDonationRequestsStats();
    };

    this.donationSocket.onclose = (e) => {
      console.error("Chat socket closed unexpectedly");
    };
  }
  handleChange = (state) => {
    this.setState({
      to_approve_requests: state.selectedRows,
    });
  };
  render() {
    const { quantity, location, blood_group, priority, is_admin ,stats } = this.state;
    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-12">
              <Chart data={stats} />
            </div>
          </div>
          {is_admin ? (
            <div className="row">
              <div className="col-12 col-md-12">
                <Card>
                  <CardBody>
                    <DataTable
                      title="Pending Donation Requests"
                      columns={columns}
                      data={this.state.requests}
                      conditionalRowStyles={conditionalRowStyles}
                      pagination={true}
                      paginationRowsPerPageOptions={[5, 10]}
                      theme="solarized"
                      selectableRows // add for checkbox selection
                      Clicked
                      onSelectedRowsChange={this.handleChange}
                    />
                    <button
                      className="btn btn-sm text-center"
                      onClick={this.approveRequests}
                    >
                      Approve
                    </button>
                  </CardBody>
                </Card>
              </div>
            </div>
          ) : (
            <div className="row mt-5 mb-3">
              <div className="col-md-6 col-12">
                <div className="card text-center">
                  <div class="card-header">Make A Request</div>
                  <div className="card-body">
                    <form onSubmit={this.onSubmit}>
                      <div className="form-group offset-3 col-6">
                        <label htmlFor="blood_group">Blood Group</label>
                        <select
                          className="form-control text-center"
                          name="blood_group"
                          id="blood_group"
                          value={blood_group}
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

                      <div className="form-group offset-3 col-6">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                          className="form-control text-center"
                          type="number"
                          name="quantity"
                          id="quantity"
                          min="1"
                          max="10"
                          onChange={this.onChange}
                          value={quantity}
                          required
                        />
                      </div>

                      <div className="form-group offset-3 col-6">
                        <label htmlFor="priority">Priority</label>
                        <select
                          className="form-control text-center"
                          name="priority"
                          id="priority"
                          value={priority}
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
                          id="location"
                          minLength="10"
                          onChange={this.onChange}
                          value={location}
                          required
                        />
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
              </div>
              <div className="col-md-6 col-12">
                <div className="card text-center card-tasks">
                  <div class="card-header">
                    {this.state.is_admin ? (
                      <div className="card-title">
                        Pending Donation Requests
                      </div>
                    ) : (
                      <div className="card-title">Donation Requests</div>
                    )}
                  </div>
                  <div className="card-body">
                    {this.state.requests.length === 0 ? (
                      "No Donation Requests"
                    ) : (
                      <>
                        <div className="table-full-width table-responsive">
                          <Table>
                            <thead className="text-primary">
                              <tr>
                                <th>Blood Group</th>
                                <th>Location</th>
                                <th>Quantity Needed</th>
                                <th>Priority</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.requests.map((req) => {
                                return (
                                  <tr>
                                    <td>{req.blood_group}</td>
                                    <td>{req.location}</td>
                                    <td>{req.quantity}</td>
                                    <td>{req.priority}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}