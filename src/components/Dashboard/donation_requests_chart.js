import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
export default class DonationRequestsChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // series: [
      //   {
      //     data: this.props.data,
      //   },
      // ],
      options: {
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            },
          },
        },
        colors: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        xaxis: {
          categories: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
          labels: {
            style: {
              colors: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
              fontSize: "12px",
            },
          },
          title: {
            text: "Blood Group",
            offsetX: 0,
            offsetY: 0,
            style: {
              color: undefined,
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-title",
            },
          },
        },
        yaxis: {
          title: {
            text: "Quantity Needed",
            rotate: -90,
            offsetX: 0,
            offsetY: 0,
            style: {
              color: undefined,
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-title",
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.props.data}
          type="bar"
          height={350}
        />
      </div>
    );
  }
}
