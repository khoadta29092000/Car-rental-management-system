import ReactApexChart from "react-apexcharts";

const PieChart = (props: any) => {
    let { data, total } = props;
    let labels = ["Doanh thu", "Chi phí"]
    const chartOptions = {
        chart: {
            id: "basic-donut",
        },
        colors: ["#818CF8", "#3B82F6", "#0000FF", "#FFFF00", "#FF00FF"],
        labels: labels,
        // tooltip: {
        //     enabled: false,
        // },
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
    };
    return (
        <ReactApexChart options={chartOptions} series={data} type="pie" height={250} />
    );
};

export default PieChart;