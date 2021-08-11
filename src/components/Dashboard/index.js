import React, { Component } from "react";
import { Accordion } from "react-bootstrap";
import axios from "axios";

import {
  BASE_URL,
  GET_OLD_DONATION_REQUESTS,
  WEB_SOCKET_PATH,
  POST_DONATION_REQUEST,
} from "../shared/axiosUrls";
import Chart from "./donation_requests_chart";
import DataTable from "react-data-table-component";

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
    };
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
    console.log(arr);
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
          priority:"HIGH"
        });
      });
  };

  componentDidMount() {
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

    this.donationSocket = new WebSocket(WEB_SOCKET_PATH);

    this.donationSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      console.log(data);
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

  render() {
    const { quantity, location, blood_group, priority } = this.state;
    return (
      <div className="container-fluid">
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
            <div className="card text-center">
              <div class="card-header">Donation Requests</div>
              <div className="card-body">
                {this.state.requests.length === 0 ? (
                  "No Donation Requests"
                ) : (
                  // <Accordion>
                  //   {this.state.requests.map(function (item, i) {
                  //     return (
                  //       <Accordion.Item eventKey={i}>
                  //         <Accordion.Header>
                  //           {item.blood_group}
                  //         </Accordion.Header>
                  //         <Accordion.Body>
                  //           <p>Quantity Needed: {item.quantity}</p>
                  //           <p>Location: {item.location}</p>
                  //         </Accordion.Body>
                  //       </Accordion.Item>
                  //     );
                  //   })}
                  // </Accordion>
                  <DataTable
                    title="Donation Requests"
                    columns={columns}
                    data={this.state.requests}
                    conditionalRowStyles={conditionalRowStyles}
                    pagination={true}
                    paginationRowsPerPageOptions={[5,10]}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <div class="card-header">Donation Requests Summary</div>
            <div className="card-body">
              <Chart data={[{ data: this.state.stats }]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
