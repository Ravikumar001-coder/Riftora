import React from 'react';
import { SponsorList } from '@/features/sponsors/components/SponsorList';

// Mocking orgId for the sponsors page. In a real application, this would come from the auth context.
const MOCK_ORG_ID = 'e9e8f7a6-b5c4-d3e2-f1a0-9876543210ab';

export default function SponsorsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <SponsorList orgId={MOCK_ORG_ID} />
        </div>
    );
}
