"use client";

import { useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MemberReportChart() {
  const chartRef = useRef<ChartJS<"bar">>(null);
  const [chartData] = useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      barThickness: number;
      borderRadius: number;
    }>;
  }>({
    labels: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    datasets: [
      {
        label: "신규",
        data: [120, 150, 180, 220, 190, 250, 210, 240, 200, 230, 260, 280],
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        borderWidth: 0,
        barThickness: 32,
        borderRadius: 0,
      },
    ],
  });

  const data = chartData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#3b82f6",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: function (context: Array<{ label: string }>) {
            return context[0].label;
          },
          label: function (context: { parsed: { y: number | null } }) {
            return `신규: ${context.parsed.y ?? 0}명`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "#E5E7EB",
          lineWidth: 1,
          borderDash: [5, 5],
        },
        border: {
          display: true,
          color: "#E5E7EB",
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
      },
      y: {
        min: 0,
        max: 300,
        ticks: {
          stepSize: 50,
          color: "#9CA3AF",
          font: {
            size: 12,
          },
          callback: function (tickValue: string | number) {
            return tickValue;
          },
        },
        grid: {
          display: true,
          color: "#E5E7EB",
          lineWidth: 1,
          drawBorder: true,
          borderDash: [5, 5],
        },
        border: {
          display: true,
          color: "#E5E7EB",
        },
      },
    },
    elements: {
      bar: {
        borderSkipped: false,
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 0,
        left: 0,
        right: 10,
      },
    },
  };

  return (
    <div className="flex flex-1 flex-col items-start self-stretch">
      <div className="flex h-[300px] w-full items-end justify-center">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
      <div className="flex items-center justify-center self-stretch pt-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2" style={{ backgroundColor: "#3b82f6" }} />
          <span className="text-xs text-gray-3">신규</span>
        </div>
      </div>
    </div>
  );
}
