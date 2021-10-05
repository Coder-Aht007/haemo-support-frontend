import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Button, Collapse } from "react-bootstrap";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { ADD_BULK_USERS, BASE_URL, UPLOAD_CSV } from "../shared/axiosUrls";
import { UserUtils } from "../shared/user";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_admin: UserUtils.isAdmin(),
      data: [],
      errors: [],
      collapseOpen: false,
    };
  }

  setCollapseOpen = (value) => {
    this.setState({
      collapseOpen: value,
    });
  };
  onChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file, file.name);
    axios
      .post(BASE_URL + UPLOAD_CSV, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        const parsedData = res.data;
        this.setState({
          data: parsedData.data,
          errors: parsedData.errors,
        });
      })
      .catch((err) => {
        toast(err.response.status + ": " + Object.values(err.response.data)[0]);
      });
  };

  parseBulKUserCreationErrors = (errors) => {
    let errorsList = [];
    errors.forEach((item, index) => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          errorsList.push(`Row ${index + 1} has error: ${item[key]}`);
        }
      }
    });

    this.setState({
      errors: [...this.state.errors, ...errorsList],
    });
  };

  submitBulkUserData = () => {
    const data = this.state.data;
    const config = {
      method: "post",
      url: BASE_URL + ADD_BULK_USERS,
      data: data,
    };
    axios(config)
      .then((res) => {
        if (res.status === 201) {
          toast("Users Added and Ceredentials Emailed to them");
        } else {
          toast("Error Adding users");
        }
      })
      .catch((err) => {
        const errorsArr = err.response.data;
        this.parseBulKUserCreationErrors(errorsArr);
        toast.error("Error adding User... See Errors Tab for more Info...");
      });
  };

  renderRecord(record) {
    return (
      <>
        <tr key={record.username}>
          <td>{record.username}</td>
          <td>{record.email}</td>
          <td>{record.date_of_birth}</td>
          <td>{record.phone_number}</td>
          <td>{record.blood_group}</td>
        </tr>
      </>
    );
  }

  render() {
    if (!this.state.is_admin) {
      return <Redirect to="/index" />;
    }
    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center">
              <h3>Upload A CSV File</h3>
            </div>
            <div className="col-12 text-center">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group offset-md-3 col-md-6 col-12">
                  <label
                    htmlFor="selectedFile"
                    className="text-center custom-file-upload col-12 text-primary"
                  >
                    <input
                      name="selectedFile"
                      id="selectedFile"
                      type="file"
                      onChange={this.onChange}
                      accept=".csv"
                    />
                    <FontAwesomeIcon icon={faUpload} /> Upload Document
                  </label>
                </div>
              </form>
            </div>
          </div>
          {this.state.data.length > 0 ? (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="mb-3 text-center">User Record</h5>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Username</th>
                          <th scope="col">Email</th>
                          <th scope="col">Date Of Birth</th>
                          <th scope="col">Phone Number</th>
                          <th scope="col">Blood Group</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.data.map((record) => {
                          return this.renderRecord(record);
                        })}
                      </tbody>
                    </table>
                    <div className="col text-center">
                      <button
                        className="btn btn-sm"
                        onClick={this.submitBulkUserData}
                      >
                        Add All Records
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {this.state.errors.length > 0 ? (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 class="mb-0">
                      <Button
                        onClick={() =>
                          this.setCollapseOpen(!this.state.collapseOpen)
                        }
                        aria-controls="errors"
                        aria-expanded={this.state.collapseOpen}
                        className="btn btn-link col-12"
                      >
                        Errors
                        <span class="badge">{this.state.errors.length}</span>
                      </Button>
                    </h5>
                  </div>
                  <div className="card-body">
                    <Collapse in={this.state.collapseOpen}>
                      <div id="errors" className="text-danger">
                        {this.state.errors.map((err) => {
                          return <div>{err}</div>;
                        })}
                      </div>
                    </Collapse>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}
