import React, { Component } from "react";
import axios from "axios";
import {
  BASE_URL,
  GET_OLD_DONATION_REQUESTS,
  WEB_SOCKET_PATH,
  POST_DONATION_REQUEST,
} from "../shared/axiosUrls";
import Chart from "./donation_requests_chart";

import { UserUtils } from "../shared/user";
import DataTable, { createTheme } from "react-data-table-component";
import swal from "sweetalert";
import { Offcanvas, OffcanvasHeader, OffcanvasTitle } from "react-bootstrap";
import memoize from "memoize-one";
import styled from "styled-components";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const token = UserUtils.getAccessToken();

const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  height: 34px;
  width: 25px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectField = styled.select`
  height: 32px;
  width: 170px;
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
    <SelectField
      id="search"
      type="text"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    >
      <option value=""></option>
      <option value="a_positive">A+</option>
      <option value="a_negative">A-</option>
      <option value="b_positive">B+</option>
      <option value="b_negative">B-</option>
      <option value="o_positive">O+</option>
      <option value="o_negative">O-</option>
      <option value="ab_positive">AB+</option>
      <option value="ab_negative">AB-</option>
    </SelectField>
    <ClearButton className="btn" type="button" onClick={onClear}>
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
const adminColumns = memoize((handleAction) => [
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
    name: "Details",
    sortable: false,
    cell: (row) => (
      <button className="btn btn-sm " onClick={() => handleAction(row)}>
        Details
      </button>
    ),
  },
]);

const userColumns = memoize((handleAction) => [
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
    name: "Donate",
    sortable: false,
    cell: (row) => (
      <button className="btn btn-sm " onClick={() => handleAction(row)}>
        Donate
      </button>
    ),
  },
]);

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

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      quantity: 1,
      location: "",
      description: "",
      blood_group: "A+",
      priority: 1,
      selectedFile: null,
      stats: [],
      is_admin: UserUtils.isAdmin(),
      to_modify_request: null,
      show: false,
      perPage: 5,
      reqCount: 0,
      nextReqLink: null,
      previousReqLink: null,
      loading: false,
      resetPaginationToggle: false,
      filterText: "",
      reasonToReject: "",
      showModal: false,
      showPostRequestModal: false,
      imageURL: null,
    };
    // eslint-disable-next-line
    let donationSocket = null;
  }

  setResetPaginationToggle = (value) => {
    this.setState({
      resetPaginationToggle: value,
    });
  };
  setShowPostRequestModal = (value) => {
    if (value) {
      this.setState({
        showPostRequestModal: value,
      });
    } else {
      this.setState({
        blood_group: "A+",
        quantity: 1,
        priority: "HIGH",
        location: "",
        description: "",
        selectedFile: null,
        imageURL: null,
        showPostRequestModal: value,
      });
    }
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
      description: data.description,
      imageURL: data.document,
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
    this.setState({
      show: false,
      quantity: 1,
      blood_group: "",
      location: "",
      priority: 1,
    });
  };

  handleModalClose = () => {
    this.setState({
      showModal: false,
      reasonToReject: "",
    });
  };

  setShow = () => {
    this.setState({
      show: true,
    });
  };

  setShowModal = (value) => {
    this.setState({
      showModal: value,
      show: false,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
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

    axios
      .post(BASE_URL + POST_DONATION_REQUEST, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({
          quantity: 1,
          location: "",
          blood_group: "A+",
          priority: 1,
          description: "",
          showPostRequestModal: false,
        });
      });
  };

  rejectRequest = (e) => {
    e.preventDefault();
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
            const data = {
              is_rejected: true,
              comments: this.state.reasonToReject,
            };
            const id = this.state.to_modify_request;
            const config = {
              method: "patch",
              url: BASE_URL + "/donations/" + id + "/reject/",
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
                    showModal: false,
                    reasonToReject: "",
                  });
                  this.calculateDonationRequestsStats();
                }
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                this.setState({
                  quantity: 1,
                  blood_group: "",
                  location: "",
                  priority: 1,
                  showModal: false,
                  reasonToReject: "",
                });
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
        url: BASE_URL + "/donations/" + id + "/approve/",
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
    let permission = UserUtils.isAdmin();
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
            `?page=${page}&size=${newPerPage}&search_slug=${this.state.filterText}`
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
            `?page=${page}&size=${this.state.perPage}&search_slug=${this.state.filterText}`
          : sortOrder === "asc"
          ? BASE_URL +
            GET_OLD_DONATION_REQUESTS +
            `?page=${page}&size=${this.state.perPage}&search_slug=${this.state.filterText}&ordering=priority`
          : BASE_URL +
            GET_OLD_DONATION_REQUESTS +
            `?page=${page}&size=${this.state.perPage}&search_slug=${this.state.filterText}&ordering=-priority`;
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
          : sortOrder === "asc"
          ? BASE_URL +
            GET_OLD_DONATION_REQUESTS +
            `?page=${page}&size=${this.state.perPage}&ordering=priority`
          : BASE_URL +
          GET_OLD_DONATION_REQUESTS +
          `?page=${page}&size=${this.state.perPage}&ordering=-priority`;

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
      data["document"] = BASE_URL + data["document"];
      if (
        data.is_approved === false &&
        data.is_complete === false &&
        data.is_rejected === false
      ) {
        if (this.state.is_admin === true) {
          let updated_requests = [...this.state.requests];
          updated_requests.push(data);
          this.setState({
            requests: updated_requests,
          });
          this.calculateDonationRequestsStats();
        }
      } else if (data.is_approved === true) {
        if (
          this.state.is_admin === false &&
          data.username !== UserUtils.getUserName()
        ) {
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
    const closeBtn = (
      <button className="close" onClick={this.handleModalClose}>
        &times;
      </button>
    );
    const closeRequestModal = (
      <button
        className="close"
        onClick={() => this.setShowPostRequestModal(false)}
      >
        &times;
      </button>
    );
    const {
      quantity,
      location,
      blood_group,
      priority,
      is_admin,
      stats,
      requests,
      description,
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
    }, [this.state.filterText, this.state.resetPaginationToggle])();

    const userDataTable = (
      <DataTable
        title="Donation Requests"
        columns={userColumns()}
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
        subHeaderComponent={subHeaderComponentMemo}
        paginationResetDefaultPage={this.state.resetPaginationToggle}
        persistTableHead
        onSort={this.handleSort}
        sortServer
      />
    );
    return (
      <div className="content">
        <div className="container-fluid">
          {is_admin && is_admin === true ? (
            <div className="row">
              <div className="col-12 col-md-12">
                <Card>
                  <CardBody>
                    <DataTable
                      title="Pending Donation Requests"
                      columns={adminColumns(this.populateDataInOffCanvas)}
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
                      subHeaderComponent={subHeaderComponentMemo}
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
              <div className="col-md-4 col-12">
                <div className="card text-center">
                  <div className="card-header">
                    <h3>Hello, {UserUtils.getUserName()}! </h3>
                  </div>
                  <div className="card-body">
                    <h4>
                      Help Us Save Lives.... Donate{" "}
                      <span style={{ color: "red" }}>Blood</span>
                    </h4>
                    <h4>
                      Need <span style={{ color: "red" }}>Blood</span>....?
                    </h4>
                    <button
                      className="btn"
                      onClick={() => {
                        this.setShowPostRequestModal(true);
                      }}
                    >
                      Post A Donation Request
                    </button>
                  </div>
                </div>
                <div className="card text-center">
                  <div className="card-header">
                    <h3>Some other Component</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-8 col-12">
                <Card>
                  <CardBody>
                    <Chart data={stats} />
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-12 col-md-12">
              {is_admin ? <Chart data={stats} /> : userDataTable}
            </div>
          </div>
        </div>
        <Offcanvas
          show={this.state.show}
          onHide={this.handleClose}
          placement="end"
        >
          <OffcanvasHeader>
            <OffcanvasTitle>
              <h3 className="text-center">Request Details</h3>
            </OffcanvasTitle>
          </OffcanvasHeader>
          <Offcanvas.Body>
            <div className="row">
              <div className="col-md-5" style={{ fontSize: "large" }}>
                Blood Group:
              </div>
              <div className="col-md-5" style={{ fontSize: "large" }}>
                {this.state.blood_group}
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-5" style={{ fontSize: "large" }}>
                Priority:
              </div>
              <div className="col-md-5" style={{ fontSize: "large" }}>
                {this.state.priority}
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-5" style={{ fontSize: "large" }}>
                Location:
              </div>
              <div className="col-md-5" style={{ fontSize: "large" }}>
                {this.state.location}
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-5" style={{ fontSize: "large" }}>
                Description:
              </div>
              <div className="col-md-5" style={{ fontSize: "large" }}>
                {this.state.description}
              </div>
            </div>
            {this.state.imageURL ? (
              <div className="row mt-5">
                <div className="col-md-5" style={{ fontSize: "large" }}>
                  Image:
                </div>
                <div className="col-md-5" style={{ fontSize: "large" }}>
                  <a
                    href={this.state.imageURL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Click Here
                  </a>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="col text-center mt-5">
              <button
                className="btn btn-danger text-center"
                type="button"
                onClick={this.setShowModal}
              >
                Reject
              </button>{" "}
              <button
                className="btn text-center"
                type="button"
                onClick={this.approveRequest}
              >
                Accept
              </button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
        <Modal
          isOpen={this.state.showModal}
          toggle={() => this.setShowModal(!this.state.showModal)}
        >
          <ModalHeader
            toggle={() => this.setShowModal(!this.state.showModal)}
            close={closeBtn}
          >
            Reason to Reject
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <Form onSubmit={this.rejectRequest}>
                <FormGroup>
                  <Label for="reasonToReject">Reason to Reject</Label>
                  <Input
                    style={{ color: "#BA4A00  " }}
                    className="text-center"
                    type="text"
                    id="reasonToReject"
                    name="reasonToReject"
                    placeholder="Reason to Reject"
                    value={this.state.reasonToReject}
                    onChange={this.onChange}
                  />
                </FormGroup>

                <div className="col text-center">
                  <Button
                    className="text-center"
                    color="primary"
                    onClick={this.handleModalClose}
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
        <Modal
          isOpen={this.state.showPostRequestModal}
          toggle={() =>
            this.setShowPostRequestModal(!this.state.showPostRequestModal)
          }
        >
          <ModalHeader
            toggle={() =>
              this.setShowPostRequestModal(!this.state.showPostRequestModal)
            }
            close={closeRequestModal}
          >
            Make A Request
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <form onSubmit={this.onSubmit}>
                <div className="form-group offset-md-2 col-md-8 col-12">
                  <label htmlFor="blood_group">Blood Group</label>
                  <select
                    style={{ color: "#BA4A00" }}
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
                    style={{ color: "#BA4A00" }}
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
                    style={{ color: "#BA4A00" }}
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
                    style={{ color: "#BA4A00" }}
                    type="text"
                    name="location"
                    id="location"
                    minLength="10"
                    onChange={this.onChange}
                    value={location}
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
                    value={description}
                    required
                  />
                </div>

                <div className="form-group offset-md-2 col-md-8 col-12">
                  <a
                    href={this.state.imageURL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={this.state.imageURL}
                      alt=""
                      onClick={this.state.imageURL}
                    />
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

                <div className="form-group text-center">
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
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
