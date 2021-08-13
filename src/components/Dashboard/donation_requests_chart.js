import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

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

export default class DonationRequestsChart extends Component {
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
          },
        ],
      },
    };
    // this.state={
    //   chart : {
    //     data: (canvas) => {
    //       let ctx = canvas.getContext("2d");

    //       let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    //       gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
    //       gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
    //       gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

    //       return {
    //         labels: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    //         datasets: [
    //           {
    //             label: "Requests",
    //             fill: true,
    //             backgroundColor: gradientStroke,
    //             hoverBackgroundColor: gradientStroke,
    //             borderColor: "#d048b6",
    //             borderWidth: 2,
    //             borderDash: [],
    //             borderDashOffset: 0.0,
    //             data: []
    //           },
    //         ],
    //       };
    //     },
    //     options: {
    //       maintainAspectRatio: false,
    //       legend: {
    //         display: false,
    //       },
    //       tooltips: {
    //         backgroundColor: "#f5f5f5",
    //         titleFontColor: "#333",
    //         bodyFontColor: "#666",
    //         bodySpacing: 4,
    //         xPadding: 12,
    //         mode: "nearest",
    //         intersect: 0,
    //         position: "nearest",
    //       },
    //       responsive: true,
    //       scales: {
    //         yAxes: [
    //           {
    //             gridLines: {
    //               drawBorder: false,
    //               color: "rgba(225,78,202,0.1)",
    //               zeroLineColor: "transparent",
    //             },
    //             ticks: {
    //               suggestedMin: 60,
    //               suggestedMax: 120,
    //               padding: 20,
    //               fontColor: "#9e9e9e",
    //             },
    //           },
    //         ],
    //         xAxes: [
    //           {
    //             gridLines: {
    //               drawBorder: false,
    //               color: "rgba(225,78,202,0.1)",
    //               zeroLineColor: "transparent",
    //             },
    //             ticks: {
    //               padding: 20,
    //               fontColor: "#9e9e9e",
    //             },
    //           },
    //         ],
    //       },
    //     },
    //   }
    // }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      console.log(this.props.data);
      let { chartData } = this.state;
      chartData.datasets[0].data = this.props.data;
      this.setState({ chartData });
    }
  }

  render() {
    return (
      <>
        <Card className="card-chart">
          <CardHeader>
            <h5 className="card-category">Donation Requests</h5>
            <CardTitle tag="h3">
              <i className="tim-icons icon-bell-55 text-info" />{" "}
              {this.state.chartData.datasets[0].data.reduce((a, b) => a + b, 0)}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="chart-area">
              {this.state.chartData.datasets[0].data.length > 0 ? (
                <Line data={this.state.chartData} options={chartOptions} />
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
