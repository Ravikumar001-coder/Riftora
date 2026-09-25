import React from 'react';
import { PlatformHealthDashboard } from '@/features/organizations/components/PlatformHealthDashboard';
import { UserAcquisitionFunnel } from '@/features/organizations/components/UserAcquisitionFunnel';
import { PlatformRevenueDashboard } from '@/features/organizations/components/PlatformRevenueDashboard';

export default function SuperAdminDashboardPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Administration</h1>
                <p className="text-slate-400">
                    System health, user acquisition, and global revenue metrics.
                </p>
            </div>
            
            {/* FR-17-021: Platform Health Dashboard */}
            <PlatformHealthDashboard />
            
            {/* FR-17-022: User Acquisition Funnel */}
            <div className="pt-8 border-t border-slate-800">
                <UserAcquisitionFunnel />
            </div>
            
            {/* FR-17-023: Revenue Dashboard */}
            <div className="pt-8 border-t border-slate-800">
                <PlatformRevenueDashboard />
            </div>
        </div>
    );
}
