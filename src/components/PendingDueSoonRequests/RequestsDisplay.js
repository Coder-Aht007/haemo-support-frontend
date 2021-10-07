import React, { useContext, useEffect, useState } from "react";
import { RequestsContext } from "./RequestsContext";
import axios from "axios";
import { BASE_URL, PENDING_DUE_SOON_REQUESTS } from "../shared/axiosUrls";
import { Card, CardBody, CardHeader, Table } from "reactstrap";

export const RequestsDisplay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useContext(RequestsContext);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(BASE_URL + PENDING_DUE_SOON_REQUESTS)
      .then((res) => res.data)
      .then(setRequests)
      .finally(() => setIsLoading(false));
  }, [setRequests]);

  const notifyUser = () => {};
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
                <CardBody>
                  <Table>
                    <thead className="text-primary">
                      <tr>
                        <th>Blood Group</th>
                        <th>Priority</th>
                        <th>Location</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => {
                        return (
                          <tr>
                            <td>{req.blood_group}</td>
                            <td>{req.priority}</td>
                            <td>{req.location}</td>
                            <td>
                              <button
                                class="btn btn-sm"
                                onClick={() => notifyUser()}
                              >
                                Notify users
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
