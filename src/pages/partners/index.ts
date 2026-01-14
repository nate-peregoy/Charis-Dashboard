/**
 * GET /api/partners - List all partners with optional filtering
 * POST /api/partners - Create a new partner
 */

import type { APIRoute } from 'astro';
import { listRecords, createRecord, TABLES } from '../../../lib/airtable';
import type { Partner, ApiResponse, CreatePartnerRequest } from '../../../types';

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
    const maxRecords = url.searchParams.get('maxRecords');

    // Build filter formula
    let filterByFormula: string | undefined;
    if (status) {
      filterByFormula = `{status} = "${status}"`;
    }

    // Fetch partners from Airtable
    const result = await listRecords<Partner>(TABLES.PARTNERS, {
      maxRecords: maxRecords ? parseInt(maxRecords) : 100,
      filterByFormula,
      sort: [{ field: 'organizationName', direction: 'asc' }],
    });

    // Transform Airtable records to Partner objects
    const partners = result.records.map(record => ({
      id: record.id,
      ...record.fields,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: partners,
      } as ApiResponse<Partner[]>),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching partners:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch partners',
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
    const body: CreatePartnerRequest = await request.json();
    const { partner } = body;

    // Validate required fields
    if (!partner.organizationName || !partner.contactName || !partner.contactEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: organizationName, contactName, contactEmail',
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Set default values
    const partnerData: Partner = {
      ...partner,
      status: partner.status || 'pending',
      totalFundingReceived: partner.totalFundingReceived || 0,
      activeGrants: partner.activeGrants || 0,
      partnershipStartDate: partner.partnershipStartDate || new Date().toISOString().split('T')[0],
    };

    // Create partner in Airtable
    const result = await createRecord<Partner>(TABLES.PARTNERS, partnerData);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: result.id,
          ...result.fields,
        },
        message: 'Partner created successfully',
      } as ApiResponse<Partner>),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating partner:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create partner',
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
