import React, { Component } from "react";
import axios from "axios";
import {
  BASE_URL,
  GET_OLD_DONATION_REQUESTS,
  WEB_SOCKET_PATH,
  POST_DONATION_REQUEST,
  UPDATE_DELETE_DONATION_REQUEST,
  DELETE_REQUEST,
} from "../shared/axiosUrls";
import Chart from "./donation_requests_chart";

import { Card, CardBody, CardHeader, Table } from "reactstrap";

import { UserUtils } from "../shared/user";
import DataTable, { createTheme } from "react-data-table-component";
import swal from "sweetalert";
import { Offcanvas, Col, Form as ReactForm, Row } from "react-bootstrap";
import memoize from "memoize-one";
import styled from "styled-components";

const token = UserUtils.getAccessToken();

const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Filter By Blood Group"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton className='btn' type="button" onClick={onClear}>
      X
    </ClearButton>
  </>
);

const conditionalRowStyles = [
  {
    when: (row) => row["priority"] === 1,
    style: {
      backgroundColor: "#F7BEC0",
      color: "black",
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
  {
    when: (row) => row["priority"] === 2,
    style: {
      backgroundColor: "#FFFFE0",
      color: "black",
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
];
const columns = memoize((handleAction) => [
  {
    name: "Blood Group",
    selector: (row) => row["blood_group"],
  },
  {
    name: "Priority",
    selector: (row) =>{
      if(row["priority"]===1)
      {
        return "HIGH"
      }
      else if(row["priority"]===2)
      {
        return "MEDIUM"
      }
      else
      {
        return "LOW"
      }
      
    },
    sortable: true,
  },
  {
    name: "Details",
    sortable: false,
    cell: (row) => (
      <button className="btn btn-sm " onClick={() => handleAction(row)}>
        Details
      </button>
    ),
  },
]);

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
      priority: 1,
      stats: [],
      is_admin: UserUtils.getIsAdmin(),
      to_modify_request: null,
      show: false,
      perPage: 5,
      reqCount: 0,
      nextReqLink: null,
      previousReqLink: null,
      loading: false,
      resetPaginationToggle: false,
      filterText: "",
    };
    // eslint-disable-next-line
    let donationSocket = null;
  }

  setResetPaginationToggle = (value) => {
    this.setState({
      resetPaginationToggle: value,
    });
  };
  setFilterText = async (value) => {
    await this.setState({
      filterText: value,
    });
    this.fetchDataTableData(1);
  };
  setLoading = (value) => {
    this.setState({
      loading: value,
    });
  };
  populateDataInOffCanvas = (data) => {
    this.setState({
      quantity: data.quantity,
      location: data.location,
      blood_group: data.blood_group,
      priority: data.priority,
      to_modify_request: data.id,
    });
    this.setShow();
  };

  handleSort = (column, sortDirection) => {

    this.fetchDataTableData(1, sortDirection);
  };

  calculateDonationRequestsStats = () => {
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

  handleClose = () => {
    this.setState({
      show: false,
      quantity: 1,
      blood_group: "",
      location: "",
      priority: 1,
    });
  };

  setShow = () => {
    this.setState({
      show: true,
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
          priority: 1,
        });
      });
  };

  rejectRequest = () => {
    if (this.state.to_modify_request) {
      swal({
        title: "Are you sure?",
        text: "You want to reject this request....?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willReject) => {
        if (willReject) {
          if (willReject) {
            const id = this.state.to_modify_request;
            const config = {
              method: "delete",
              url: BASE_URL + DELETE_REQUEST + id + "/",
            };
            axios(config)
              .then((res) => {
                if (res.status === 204) {
                  let currentData = [...this.state.requests];
                  currentData = currentData.filter((el) => el.id !== id);
                  this.setState({
                    requests: currentData,
                    to_modify_request: null,
                    show: false,
                  });
                  this.calculateDonationRequestsStats();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
    }
  };

  approveRequest = () => {
    if (this.state.to_modify_request) {
      const id = this.state.to_modify_request;
      const data = {
        is_approved: true,
      };
      const config = {
        method: "patch",
        url: BASE_URL + UPDATE_DELETE_DONATION_REQUEST + id + "/",
        data: data,
      };
      axios(config)
        .then((res) => {
          if (res.status === 200) {
            const data = res.data;
            let currentData = [...this.state.requests];
            currentData = currentData.filter((el1) => el1.id !== data.id);
            this.setState({
              requests: currentData,
              quantity: 1,
              blood_group: "",
              location: "",
              priority: 1,
              show: false,
            });
            this.calculateDonationRequestsStats();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  checkIsAdmin = () => {
    let permission = UserUtils.getIsAdmin();
    this.setState({
      is_admin: permission,
    });
  };

  handlePerPageRowsChange = (newPerPage, page) => {
    this.setLoading(true);
    if (this.state.filterText !== "") {
      axios
        .get(
          BASE_URL +
            GET_OLD_DONATION_REQUESTS +
            `?page=${page}&size=${newPerPage}&search_term=${this.state.filterText}`
        )
        .then((res) => {
          const reqs = res.data;
          this.setState({
            requests: reqs.results,
            reqCount: reqs.count,
            nextReqLink: reqs.next,
            previousReqLink: reqs.previous,
            loading: false,
          });
          this.calculateDonationRequestsStats();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(
          BASE_URL +
            GET_OLD_DONATION_REQUESTS +
            `?page=${page}&size=${newPerPage}`
        )
        .then((res) => {
          const reqs = res.data;
          this.setState({
            requests: reqs.results,
            reqCount: reqs.count,
            nextReqLink: reqs.next,
            previousReqLink: reqs.previous,
            loading: false,
          });
          this.calculateDonationRequestsStats();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  fetchDataTableData = (page, sortOrder) => {
    this.setLoading(true);
    if (this.state.filterText !== "") {
      const url =
        sortOrder === undefined
          ? BASE_URL +
            GET_OLD_DONATION_REQUESTS +
            `?page=${page}&size=${this.state.perPage}&search_term=${this.state.filterText}`
          : BASE_URL +
            GET_OLD_DONATION_REQUESTS +
            `?page=${page}&size=${this.state.perPage}&search_term=${this.state.filterText}&sortOrder=${sortOrder} `;
      axios
        .get(url)
        .then((res) => {
          const reqs = res.data;
          this.setState({
            requests: reqs.results,
            reqCount: reqs.count,
            nextReqLink: reqs.next,
            previousReqLink: reqs.previous,
            loading: false,
          });
          this.calculateDonationRequestsStats();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const url =
        sortOrder === undefined
          ? BASE_URL +
            GET_OLD_DONATION_REQUESTS +
            `?page=${page}&size=${this.state.perPage}`
          : BASE_URL +
            GET_OLD_DONATION_REQUESTS +
            `?page=${page}&size=${this.state.perPage}&sortOrder=${sortOrder} `;
      axios
        .get(url)
        .then((res) => {
          const reqs = res.data;
          this.setState({
            requests: reqs.results,
            reqCount: reqs.count,
            nextReqLink: reqs.next,
            previousReqLink: reqs.previous,
            loading: false,
          });
          this.calculateDonationRequestsStats();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handlePageChange = (page) => {
    this.fetchDataTableData(page);
  };

  componentDidMount() {
    this.checkIsAdmin();
    this.fetchDataTableData(1);
    this.donationSocket = new WebSocket(WEB_SOCKET_PATH + "?token=" + token);

    this.donationSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.is_approved === false && data.is_complete === false) {
        if (this.state.is_admin === true) {
          let updated_requests = [...this.state.requests];
          updated_requests.push(data);
          this.setState({
            requests: updated_requests,
          });
          this.calculateDonationRequestsStats();
        }
      } else if (data.is_approved === true) {
        if (this.state.is_admin === false) {
          let updated_requests = [...this.state.requests];
          updated_requests.push(data);
          this.setState({
            requests: updated_requests,
          });
          this.calculateDonationRequestsStats();
        }
      }
    };

    this.donationSocket.onclose = (e) => {
      console.error("Chat socket closed unexpectedly");
    };
  }
  render() {
    const {
      quantity,
      location,
      blood_group,
      priority,
      is_admin,
      stats,
      requests,
    } = this.state;

    const subHeaderComponentMemo = memoize(() => {
      const handleClear = () => {
        if (this.state.filterText) {
          this.setResetPaginationToggle(!this.state.resetPaginationToggle);
          this.setFilterText("");
        }
      };

      return (
        <FilterComponent
          onFilter={(e) => this.setFilterText(e.target.value)}
          onClear={handleClear}
          filterText={this.state.filterText}
        />
      );
    }, [this.state.filterText, this.state.resetPaginationToggle]);

    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-12">
              <Chart data={stats} />
            </div>
          </div>
          {is_admin && is_admin === true ? (
            <div className="row">
              <div className="col-12 col-md-12">
                <Card>
                  <CardBody>
                    <DataTable
                      title="Pending Donation Requests"
                      columns={columns(this.populateDataInOffCanvas)}
                      data={requests}
                      conditionalRowStyles={conditionalRowStyles}
                      pagination={true}
                      paginationServer
                      paginationRowsPerPageOptions={[5, 10]}
                      paginationPerPage={5}
                      paginationTotalRows={this.state.reqCount}
                      theme="solarized"
                      progressPending={this.state.loading}
                      onChangePage={this.fetchDataTableData}
                      onChangeRowsPerPage={this.handlePerPageRowsChange}
                      subHeader
                      subHeaderComponent={subHeaderComponentMemo()}
                      paginationResetDefaultPage={
                        this.state.resetPaginationToggle
                      }
                      persistTableHead
                      onSort={this.handleSort}
                      sortServer
                    />
                  </CardBody>
                </Card>
              </div>
            </div>
          ) : (
            <div className="row mt-5 mb-3">
              <div className="col-md-6 col-12">
                <div className="card text-center">
                  <div className="card-header">Make A Request</div>
                  <div className="card-body">
                    <form onSubmit={this.onSubmit}>
                    <div className="form-group offset-md-2 col-md-8 col-12">
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

                      <div className="form-group offset-md-2 col-md-8 col-12">
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

                      <div className="form-group offset-md-2 col-md-8 col-12">
                        <label htmlFor="priority">Priority</label>
                        <select
                          className="form-control text-center"
                          name="priority"
                          id="priority"
                          value={priority}
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
                  <div className="card-header">
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
                              {requests.map((req) => {
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
        <Offcanvas
          show={this.state.show}
          onHide={this.handleClose}
          placement="end"
        >
          <Card>
            <CardHeader className="mt-5 text-center h1">
              Request Details
            </CardHeader>
            <Offcanvas.Body>
              <CardBody>
                <ReactForm.Group as={Row} className="mb-3">
                  <ReactForm.Label column sm="6">
                    Blood Group:
                  </ReactForm.Label>
                  <Col sm="10">
                    <ReactForm.Control
                      plaintext
                      readOnly
                      value={this.state.blood_group}
                      className="text-center"
                    />
                  </Col>
                </ReactForm.Group>
                <ReactForm.Group as={Row} className="mb-3">
                  <ReactForm.Label column sm="6">
                    Quantity:
                  </ReactForm.Label>
                  <Col sm="10">
                    <ReactForm.Control
                      plaintext
                      readOnly
                      value={this.state.quantity}
                      className="text-center"
                    />
                  </Col>
                </ReactForm.Group>
                <ReactForm.Group as={Row} className="mb-3">
                  <ReactForm.Label column sm="6">
                    Location:
                  </ReactForm.Label>
                  <Col sm="10">
                    <ReactForm.Control
                      plaintext
                      readOnly
                      value={this.state.location}
                      className="text-center"
                    />
                  </Col>
                </ReactForm.Group>
                <ReactForm.Group as={Row} className="mb-3">
                  <ReactForm.Label column sm="6">
                    Priority:
                  </ReactForm.Label>
                  <Col sm="10">
                    <ReactForm.Control
                      plaintext
                      readOnly
                      value={this.state.priority}
                      className="text-center"
                    />
                  </Col>
                </ReactForm.Group>

                <ReactForm.Group as={Row} className="mb-3">
                  <div className="col text-center">
                    <button
                      className="btn btn-sm btn-danger text-center"
                      type="button"
                      onClick={this.rejectRequest}
                    >
                      Reject
                    </button>{" "}
                    <button
                      className="btn btn-sm text-center"
                      type="button"
                      onClick={this.approveRequest}
                    >
                      Accept
                    </button>
                  </div>
                </ReactForm.Group>
              </CardBody>
            </Offcanvas.Body>
          </Card>
        </Offcanvas>
      </div>
    );
  }
}
