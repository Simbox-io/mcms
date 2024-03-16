// components/ProjectReports.tsx
import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import Chart from 'react-apexcharts';
import CustomDatePicker from './DatePicker';
import { ApexOptions } from 'apexcharts';

interface ProjectReportsProps {
  projectId: number;
}

interface ReportData {
  date: string;
  completedTasks: number;
  totalTasks: number;
  openIssues: number;
  closedIssues: number;
  commitCount: number;
  memberContributions: { [key: string]: number };
}

const ProjectReports: React.FC<ProjectReportsProps> = ({ projectId }) => {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(
          `/api/projects/${projectId}/reports?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        if (response.ok) {
          const data = await response.json();
          setReportData(data);
        } else {
          console.error('Error fetching report data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReportData();
  }, [projectId, startDate, endDate]);

  const taskCompletionData: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    series: [
      {
        name: 'Completed Tasks',
        data: reportData.map((data) => data.completedTasks),
      },
      {
        name: 'Total Tasks',
        data: reportData.map((data) => data.totalTasks),
      },
    ],
    xaxis: {
      categories: reportData.map((data) => format(new Date(data.date), 'MMM d, yyyy')),
    },
  };

  const issueStatusData: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
    },
    series: [
      {
        name: 'Open Issues',
        data: reportData.map((data) => data.openIssues),
      },
      {
        name: 'Closed Issues',
        data: reportData.map((data) => data.closedIssues),
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: reportData.map((data) => format(new Date(data.date), 'MMM d, yyyy')),
    },
  };

  const commitCountData: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
    },
    series: [
      {
        name: 'Commit Count',
        data: reportData.map((data) => data.commitCount),
      },
    ],
    xaxis: {
      categories: reportData.map((data) => format(new Date(data.date), 'MMM d, yyyy')),
    },
  };

  const memberContributionData: ApexOptions = {
    chart: {
      type: 'pie',
      height: 350,
    },
    series: Object.values(
      reportData.reduce((acc, curr) => {
        Object.entries(curr.memberContributions).forEach(([member, count]) => {
          if (!acc[member]) {
            acc[member] = 0;
          }
          acc[member] += count;
        });
        return acc;
      }, {} as { [key: string]: number })
    ),
    labels: Object.keys(
      reportData.reduce((acc, curr) => {
        Object.entries(curr.memberContributions).forEach(([member, count]) => {
          if (!acc[member]) {
            acc[member] = 0;
          }
          acc[member] += count;
        });
        return acc;
      }, {} as { [key: string]: number })
    ),
  };
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEndDate(date);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Project Reports</h2>
      <div className="mb-4">
        <div className="flex items-center mb-4">
          <CustomDatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="mr-2"
          />
          <span className="mr-2">to</span>
          <CustomDatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Task Completion Rate</h3>
        <Chart options={taskCompletionData} series={taskCompletionData.series} type="line" height={350} />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Issue Status</h3>
        <Chart options={issueStatusData} series={issueStatusData.series} type="bar" height={350} />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Commit Count</h3>
        <Chart options={commitCountData} series={commitCountData.series} type="area" height={350} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Member Contributions</h3>
        <Chart options={memberContributionData} series={memberContributionData.series} type="pie" height={350} />
      </div>
    </div>
  </div>
  );
};

export default ProjectReports;