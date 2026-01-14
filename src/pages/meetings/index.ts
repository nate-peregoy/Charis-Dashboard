/**
 * GET /api/meetings - List all meetings with optional filtering
 * POST /api/meetings - Create a new meeting
 */

import type { APIRoute } from 'astro';
import { listRecords, createRecord, TABLES } from '../../../lib/airtable';
import type { Meeting, ApiResponse, CreateMeetingRequest } from '../../../types';

export const GET: APIRoute = async ({ request, locals }) => {
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

    // Parse query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const meetingType = url.searchParams.get('meetingType');
    const upcoming = url.searchParams.get('upcoming'); // Filter for upcoming meetings
    const maxRecords = url.searchParams.get('maxRecords');

    // Build filter formula
    let filterParts: string[] = [];
    if (status) {
      filterParts.push(`{status} = "${status}"`);
    }
    if (meetingType) {
      filterParts.push(`{meetingType} = "${meetingType}"`);
    }
    if (upcoming === 'true') {
      const today = new Date().toISOString().split('T')[0];
      filterParts.push(`IS_AFTER({meetingDate}, "${today}")`);
    }

    const filterByFormula = filterParts.length > 0 
      ? `AND(${filterParts.join(', ')})` 
      : undefined;

    // Fetch meetings from Airtable
    const result = await listRecords<Meeting>(TABLES.MEETINGS, {
      maxRecords: maxRecords ? parseInt(maxRecords) : 100,
      filterByFormula,
      sort: [{ field: 'meetingDate', direction: 'desc' }],
    });

    // Transform Airtable records to Meeting objects
    const meetings = result.records.map(record => ({
      id: record.id,
      ...record.fields,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: meetings,
      } as ApiResponse<Meeting[]>),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching meetings:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch meetings',
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
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

    // Parse request body
    const body: CreateMeetingRequest = await request.json();
    const { meeting } = body;

    // Validate required fields
    if (!meeting.title || !meeting.meetingDate || !meeting.startTime) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: title, meetingDate, startTime',
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Set default values
    const meetingData: Meeting = {
      ...meeting,
      status: meeting.status || 'scheduled',
      meetingType: meeting.meetingType || 'board',
      isVirtual: meeting.isVirtual ?? false,
      createdBy: userId,
    };

    // Create meeting in Airtable
    const result = await createRecord<Meeting>(TABLES.MEETINGS, meetingData);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: result.id,
          ...result.fields,
        },
        message: 'Meeting created successfully',
      } as ApiResponse<Meeting>),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating meeting:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create meeting',
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
