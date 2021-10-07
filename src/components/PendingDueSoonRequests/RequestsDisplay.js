import React, { useContext, useEffect, useState } from "react";
import { RequestsContext } from "./RequestsContext";
import axios from "axios";
import {
  BASE_URL,
  NOTIFY_PENDING_Due_SOON_REQUESTS,
  PENDING_DUE_SOON_REQUESTS,
} from "../shared/axiosUrls";
import { Card, CardBody, CardHeader, Table } from "reactstrap";
import { toast } from "react-toastify";

export const RequestsDisplay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [requests, setRequests] = useContext(RequestsContext);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(BASE_URL + PENDING_DUE_SOON_REQUESTS)
      .then((res) => {
        if (res.data.length > 0) {
          setRequests(res.data);
          setButtonDisabled(false);
        }
      })
      .finally(() => setIsLoading(false));
  }, [setRequests]);

  const notifyUsersAction = () => {
    axios
      .get(BASE_URL + NOTIFY_PENDING_Due_SOON_REQUESTS)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Users Notified Successfully");
        }
      })
      .catch((err) => {
        toast.error(
          err.response.status + ": " + Object.values(err.response.data)[0]
        );
      });
  };

  return (
    <div className="content">
      <div className="container-fluid">
        {isLoading ? (
          <></>
        ) : (
          <div className="row">
            <div className="col-12 ">
              <Card>
                <CardHeader>
                  <h4 className="mb-0">
                    Remind Users For Soon Due Pending Requests
                  </h4>
                </CardHeader>
                <CardBody className="text-center">
                  <Table>
                    <thead className="text-primary">
                      <tr>
                        <th>Blood Group</th>
                        <th>Priority</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => {
                        return (
                          <tr>
                            <td>{req.blood_group}</td>
                            <td>{req.priority}</td>
                            <td>{req.location}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <button
                    class="btn btn-sm"
                    onClick={notifyUsersAction}
                    disabled={buttonDisabled}
                  >
                    Notify users
                  </button>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
