// components/ReportDashboard.tsx
import React from 'react';
import Card from '@/components/Card';
import ProjectReports from '@/components/ProjectReports';

interface ReportDashboardProps {
  projectId: number;
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ projectId }) => {
  return (
    <div>
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
        {/* Add project overview metrics */}
      </Card>
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Task Completion</h2>
        {/* Add task completion metrics */}
      </Card>
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Issue Tracking</h2>
        {/* Add issue tracking metrics */}
      </Card>
      <ProjectReports projectId={projectId} />
    </div>
  );
};

export default ReportDashboard;