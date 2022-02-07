import React, { FC, Fragment, useContext } from "react";
import { HistoryContext } from "store/context";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { rates } from "store/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

export const RateHistory: FC = () => {
  const [history] = useContext(HistoryContext)

  const getData = () => {
    const lables: string[] = []
    const data: number[] = []
    history?.rates.forEach((e: rates) => {
      lables.push(new Date(parseInt(e.timestamp) * 1000).toDateString())
      data.push(e.value)
    })

    return { lables, data }
  }
  const historydata = getData()

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: { ticks: { maxTicksLimit: 20 } },
    },
  };

  const labels = historydata.lables;

  const data = {
    labels,
    datasets: [
      {
        label: `1 ${history?.base_currency} = ${history?.quote_currency}`,
        data: historydata.data,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  if (!history) {
    return <Fragment />
  }
  return <Line options={options} data={data} />;
}