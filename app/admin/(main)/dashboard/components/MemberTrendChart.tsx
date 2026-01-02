"use client";

import { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MemberTrendChart() {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [chartData] = useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      pointBackgroundColor: string;
      pointBorderColor: string;
      pointBorderWidth: number;
      pointRadius: number;
      pointHoverRadius: number;
      tension: number;
      fill: boolean;
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
        label: "누적",
        data: [
          120, 270, 450, 670, 860, 1110, 1320, 1560, 1760, 1990, 2250, 2530,
        ],
        borderColor: "#3b82f6",
        backgroundColor: "transparent",
        borderWidth: 2,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#3b82f6",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  });

  useEffect(() => {
    const chart = chartRef.current;
    if (chart && chart.ctx) {
      const ctx = chart.ctx;

      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
      gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.1)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)");

      if (chart.data.datasets[0]) {
        chart.data.datasets[0].backgroundColor = gradient;
        chart.update();
      }
    }
  }, [chartData]);

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
            return `누적: ${context.parsed.y ?? 0}명`;
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
        max: 3000,
        ticks: {
          stepSize: 500,
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
      point: {
        hoverBackgroundColor: "#FFFFFF",
        hoverBorderColor: "#3b82f6",
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
      <div className="flex h-[300px] w-full items-center justify-center">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <div className="flex items-center justify-center self-stretch pt-4">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4" style={{ backgroundColor: "#3b82f6" }} />
          <div
            className="h-2 w-2 rounded-full border"
            style={{
              borderColor: "#3b82f6",
              backgroundColor: "#FFFFFF",
              borderWidth: "1px",
            }}
          />
          <span className="text-xs text-gray-3">누적</span>
        </div>
      </div>
    </div>
  );
}
