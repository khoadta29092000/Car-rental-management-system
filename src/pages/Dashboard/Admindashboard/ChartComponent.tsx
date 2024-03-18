import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = (props : any) => {
  const { data } = props;
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-line",
      },
      xaxis: {
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
    },
    series: [
      {
        data: data,
      },
    ],
  });

  useEffect(() => {
    setLoading(true); // hiển thị loading
    setChartData((prevState) => ({
      ...prevState,
      series: data,
    }));
  }, [data]);

  useEffect(() => {
    if (loading) {
      setLoading(false); // ẩn loading khi dữ liệu sẵn sàng
    }
  }, [loading]);

  return (
    <>
      {loading ? (
        <p>Loading...</p> // hiển thị thông báo đợi tải
      ) : (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={350}
        />
      )}
    </>
  );
};

export default LineChart;