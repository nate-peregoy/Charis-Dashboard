/**
 * GET /api/dashboard/stats - Get dashboard statistics and recent activity
 * 
 * This endpoint aggregates data from all tables to provide:
 * - Total grants count and funding amounts
 * - Grant status breakdown
 * - Active partners count
 * - Upcoming meetings count
 * - Recent documents count
 * - Grants by program category
 * - Recent activity feed
 */

import type { APIRoute } from 'astro';
import { listRecords, TABLES } from '../../../lib/airtable';
import type { Grant, Partner, Meeting, Document, DashboardStats, ApiResponse } from '../../../types';

export const GET: APIRoute = async ({ locals }) => {
  try {
    // Check authentication
    const { userId } = locals.auth();
    if (!userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized' 
        } as ApiResponse),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all grants
    const grantsResult = await listRecords<Grant>(TABLES.GRANTS, {
      maxRecords: 500,
    });

    // Fetch active partners
    const partnersResult = await listRecords<Partner>(TABLES.PARTNERS, {
      filterByFormula: `{status} = "active"`,
      maxRecords: 500,
    });

    // Fetch upcoming meetings
    const today = new Date().toISOString().split('T')[0];
    const upcomingMeetingsResult = await listRecords<Meeting>(TABLES.MEETINGS, {
      filterByFormula: `AND({status} = "scheduled", IS_AFTER({meetingDate}, "${today}"))`,
      maxRecords: 100,
    });

    // Fetch recent documents (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDocsResult = await listRecords<Document>(TABLES.DOCUMENTS, {
      filterByFormula: `IS_AFTER({uploadDate}, "${thirtyDaysAgo.toISOString().split('T')[0]}")`,
      maxRecords: 100,
    });

    // Calculate grant statistics
    const grants = grantsResult.records;
    const totalGrants = grants.length;
    const pendingGrants = grants.filter(g => g.fields.status === 'pending').length;
    const approvedGrants = grants.filter(g => g.fields.status === 'approved').length;
    
    const totalFundingApproved = grants
      .filter(g => g.fields.status === 'approved')
      .reduce((sum, g) => sum + (g.fields.amountApproved || 0), 0);

    // Calculate grants by program
    const grantsByProgram = {
      ministry_leadership: grants.filter(g => g.fields.programCategory === 'ministry_leadership').length,
      faith_and_work: grants.filter(g => g.fields.programCategory === 'faith_and_work').length,
      strategic_grants: grants.filter(g => g.fields.programCategory === 'strategic_grants').length,
    };

    // Build recent activity feed
    const recentActivity: DashboardStats['recentActivity'] = [];

    // Add recent grants (last 10)
    const recentGrants = grants
      .sort((a, b) => new Date(b.fields.applicationDate).getTime() - new Date(a.fields.applicationDate).getTime())
      .slice(0, 5);
    
    recentGrants.forEach(grant => {
      recentActivity.push({
        type: 'grant',
        title: `New Grant Application: ${grant.fields.organizationName}`,
        date: grant.fields.applicationDate,
        description: `${grant.fields.programCategory.replace('_', ' ')} - $${grant.fields.amountRequested.toLocaleString()}`,
      });
    });

    // Add recent meetings (next 3 upcoming)
    const upcomingMeetings = upcomingMeetingsResult.records
      .sort((a, b) => new Date(a.fields.meetingDate).getTime() - new Date(b.fields.meetingDate).getTime())
      .slice(0, 3);
    
    upcomingMeetings.forEach(meeting => {
      recentActivity.push({
        type: 'meeting',
        title: meeting.fields.title,
        date: meeting.fields.meetingDate,
        description: `${meeting.fields.meetingType} meeting at ${meeting.fields.startTime}`,
      });
    });

    // Add recent documents (last 5)
    const recentDocs = recentDocsResult.records
      .sort((a, b) => new Date(b.fields.uploadDate).getTime() - new Date(a.fields.uploadDate).getTime())
      .slice(0, 5);
    
    recentDocs.forEach(doc => {
      recentActivity.push({
        type: 'document',
        title: `New Document: ${doc.fields.title}`,
        date: doc.fields.uploadDate,
        description: `${doc.fields.category} - ${doc.fields.fileName}`,
      });
    });

    // Add recent partners (if any new ones in last 30 days)
    const recentPartners = partnersResult.records
      .filter(p => {
        const startDate = new Date(p.fields.partnershipStartDate);
        return startDate >= thirtyDaysAgo;
      })
      .slice(0, 3);
    
    recentPartners.forEach(partner => {
      recentActivity.push({
        type: 'partner',
        title: `New Partner: ${partner.fields.organizationName}`,
        date: partner.fields.partnershipStartDate,
        description: `Partnership established`,
      });
    });

    // Sort all activity by date (most recent first)
    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Build dashboard stats object
    const stats: DashboardStats = {
      totalGrants,
      pendingGrants,
      approvedGrants,
      totalFundingApproved,
      activePartners: partnersResult.records.length,
      upcomingMeetings: upcomingMeetingsResult.records.length,
      recentDocuments: recentDocsResult.records.length,
      grantsByProgram,
      recentActivity: recentActivity.slice(0, 15), // Return top 15 most recent activities
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: stats,
      } as ApiResponse<DashboardStats>),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard statistics',
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
