import React, { Component } from "react";

import { WEB_SOCKET_PATH } from "./shared/axiosUrls";
import { Accordion } from "react-bootstrap";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      quantity: 0,
      location: "",
      blood_group: "A+",
    };
    let chatSocket = null;
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const request = {
      quantity: this.state.quantity,
      blood_group: this.state.blood_group,
      location: this.state.location,
    };
    if (this.chatSocket && this.chatSocket.readyState === WebSocket.OPEN) {
      this.chatSocket.send(
        JSON.stringify({
          request: request,
        })
      );
    } else {
      console.warn("websocket is not connected");
    }
    this.setState({
      quantity: 0,
      location: "",
      blood_group: "A+",
    });
  };

  componentDidMount() {
    this.chatSocket = new WebSocket(WEB_SOCKET_PATH);

    this.chatSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      data["utc_time"] = new Date(data["utc_time"]).toString();
      let updated_requests = [...this.state.requests];
      updated_requests.push(data);
      this.setState({
        requests: updated_requests,
      });
      console.log(this.state);
    };

    this.chatSocket.onclose = (e) => {
      console.error("Chat socket closed unexpectedly");
    };
  }

  render() {
    const { quantity, location, blood_group } = this.state;
    return (
      <div className="container-fluid">
        <div className="row mt-5">
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
                      min="0"
                      max="10"
                      onChange={this.onChange}
                      value={quantity}
                      required
                    />
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
                  <Accordion>
                    {this.state.requests.map(function (item, i) {
                      return (
                        <Accordion.Item eventKey={i}>
                          <Accordion.Header>
                            {item.request.blood_group}
                          </Accordion.Header>
                          <Accordion.Body>
                            <p>Quantity Needed: {item.request.quantity}</p>
                            <p>Location: {item.request.location}</p>
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
