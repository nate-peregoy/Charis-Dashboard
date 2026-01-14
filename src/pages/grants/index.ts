/**
 * GET /api/grants - List all grants with optional filtering
 * POST /api/grants - Create a new grant
 */

import type { APIRoute } from 'astro';
import { listRecords, createRecord, TABLES } from '../../../lib/airtable';
import type { Grant, ApiResponse, CreateGrantRequest } from '../../../types';

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
    const programCategory = url.searchParams.get('programCategory');
    const maxRecords = url.searchParams.get('maxRecords');

    // Build filter formula
    let filterParts: string[] = [];
    if (status) {
      filterParts.push(`{status} = "${status}"`);
    }
    if (programCategory) {
      filterParts.push(`{programCategory} = "${programCategory}"`);
    }

    const filterByFormula = filterParts.length > 0 
      ? `AND(${filterParts.join(', ')})` 
      : undefined;

    // Fetch grants from Airtable
    const result = await listRecords<Grant>(TABLES.GRANTS, {
      maxRecords: maxRecords ? parseInt(maxRecords) : 100,
      filterByFormula,
      sort: [{ field: 'applicationDate', direction: 'desc' }],
    });

    // Transform Airtable records to Grant objects
    const grants = result.records.map(record => ({
      id: record.id,
      ...record.fields,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: grants,
      } as ApiResponse<Grant[]>),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching grants:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch grants',
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
    const body: CreateGrantRequest = await request.json();
    const { grant } = body;

    // Validate required fields
    if (!grant.organizationName || !grant.programCategory || !grant.amountRequested) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: organizationName, programCategory, amountRequested',
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Set default values
    const grantData: Grant = {
      ...grant,
      status: grant.status || 'pending',
      applicationDate: grant.applicationDate || new Date().toISOString().split('T')[0],
    };

    // Create grant in Airtable
    const result = await createRecord<Grant>(TABLES.GRANTS, grantData);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: result.id,
          ...result.fields,
        },
        message: 'Grant created successfully',
      } as ApiResponse<Grant>),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating grant:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create grant',
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
