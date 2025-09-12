import Chart from "chart.js/auto";
import { Pie } from 'react-chartjs-2';
import { useState } from 'react';


const mesoChart = (chartData) => {

    

    return (
        <div>
            <Pie data={chartData}/>
        </div>
    );

}

export default mesoChart;