import React, { PureComponent } from "react";
import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";

import { UserUtils } from "../shared/user";
const chartOptions = {
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  tooltips: {
    backgroundColor: "#f5f5f5",
    titleFontColor: "#333",
    bodyFontColor: "#666",
    bodySpacing: 4,
    xPadding: 12,
    mode: "nearest",
    intersect: 0,
    position: "nearest",
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
          color: "rgba(225,78,202,0.1)",
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 60,
          suggestedMax: 120,
          padding: 20,
          fontColor: "#9e9e9e",
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          drawBorder: false,
          color: "rgba(225,78,202,0.1)",
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#9e9e9e",
        },
      },
    ],
  },
};

export default class DonationRequestsChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        labels: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        datasets: [
          {
            label: "Requests",
            fill: true,
            borderColor: "#d048b6",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: this.props.data,
            is_admin: UserUtils.isAdmin(),
          },
        ],
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {

      let  chartData  = {...this.state.chartData};
      chartData.datasets[0].data = this.props.data;
      this.setState({ chartData });
    }
  }
  
  checkIsAdmin = () => {
    let permission = UserUtils.isAdmin()
    this.setState({
      is_admin: permission
    });
  };

  componentDidMount() {
    this.checkIsAdmin();
  }
  render() {
    const { chartData, is_admin } =this.state 
    return (
      <>
        <Card className="card-chart">
          <CardHeader>
            {is_admin===true ? (
              <h5 className="card-category">Pending Donation Requests</h5>
            ) : (
              <h5 className="card-category">Donation Requests</h5>
            )}
            <CardTitle tag="h3">
              <i className="tim-icons icon-bell-55 text-info" />{" "}
              {chartData.datasets[0].data.reduce((a, b) => a + b, 0)}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="chart-area">
              {chartData.datasets[0].data.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <></>
              )}
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
}