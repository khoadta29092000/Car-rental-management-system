import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = (props: any) => {
  let { data, total } = props;

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar",

      },
      xaxis: {
        categories: [
          `Tổng doanh thu từ hợp đồng là: ${total} ₫`,
        ]
      },
      color: ["#818CF8", "#3B82F6", "#0000FF", "#FFFF00", "#FF00FF"],
      // tooltip: {
      //   enabled: false,
      // },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val.toLocaleString() + " ₫";
        },
      },
    },
    plotOptions: {
      bar: {

      },
    },

    series: [
      {
        data: data,
      },
    ],
  });

  useEffect(() => {
    setChartData((prevState) => ({
      ...prevState,
      series: data,
      options: {
        ...prevState.options,
        xaxis: {
          categories: [`Tổng doanh thu từ hợp đồng là: ${total} ₫`],
        },
      },
    }));
  }, [data, total]);

  return (
    <>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={280}
      />
    </>
  );
};

export default BarChart;
