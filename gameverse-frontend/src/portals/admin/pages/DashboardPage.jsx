import React from 'react';
import { OrgAnalyticsDashboard } from '@/features/organizations/components/OrgAnalyticsDashboard';
import { EntryFeeOptimizationTool } from '@/features/organizations/components/EntryFeeOptimizationTool';
import { OrganizationStreamPerformance } from '@/features/organizations/components/OrganizationStreamPerformance';

// Mocking orgId for the dashboard. In a real application, this would come from the auth context or route params.
const MOCK_ORG_ID = 'e9e8f7a6-b5c4-d3e2-f1a0-9876543210ab';

export default function DashboardPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Organization Analytics</h1>
                <p className="text-slate-400">
                    Comprehensive overview of your organization's performance, revenue, and player engagement.
                </p>
            </div>
            
            <OrgAnalyticsDashboard orgId={MOCK_ORG_ID} />
            <EntryFeeOptimizationTool orgId={MOCK_ORG_ID} />
            
            <div className="pt-8 border-t border-slate-800">
                <OrganizationStreamPerformance orgId={MOCK_ORG_ID} />
            </div>
        </div>
    );
}
