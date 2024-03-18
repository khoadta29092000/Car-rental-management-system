import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface ChartProps {
  data: number[];
  labels: string[];
}

const DonutChartComponent: React.FC<ChartProps> = ({ data, labels }) => {

  const [series, setSeries] = useState(data);
  const [options, setOptions] = useState({
    chart: {
      id: "basic-donut",
    },
    colors: ["#818CF8", "#3B82F6", "#0000FF", "#FFFF00", "#FF00FF"],
    labels: labels,
    tooltip: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  useEffect(() => {
    setSeries(data);
    setOptions((options) => ({
      ...options,
      labels: data.map((value, index) => `${labels[index]}: ${value} xe`),
    }));
  }, [data]);

  return (
    <div className="flex justify-center items-center">
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        width={480}
      />
    </div>
  );
};

export default DonutChartComponent;
