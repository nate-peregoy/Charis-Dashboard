/**
 * GET /api/partners/[id] - Get a single partner by ID
 * PUT /api/partners/[id] - Update a partner
 * DELETE /api/partners/[id] - Delete a partner
 */

import type { APIRoute } from 'astro';
import { getRecord, updateRecord, deleteRecord, TABLES } from '../../../lib/airtable';
import type { Partner, ApiResponse, UpdatePartnerRequest } from '../../../types';

export const GET: APIRoute = async ({ params, locals }) => {
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

    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Partner ID is required',
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch partner from Airtable
    const result = await getRecord<Partner>(TABLES.PARTNERS, id);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: result.id,
          ...result.fields,
        },
      } as ApiResponse<Partner>),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching partner:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch partner',
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
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

    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Partner ID is required',
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: UpdatePartnerRequest = await request.json();
    const { partner } = body;

    // Update partner in Airtable
    const result = await updateRecord<Partner>(TABLES.PARTNERS, id, partner);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: result.id,
          ...result.fields,
        },
        message: 'Partner updated successfully',
      } as ApiResponse<Partner>),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating partner:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update partner',
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
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

    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Partner ID is required',
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete partner from Airtable
    await deleteRecord(TABLES.PARTNERS, id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Partner deleted successfully',
      } as ApiResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error deleting partner:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete partner',
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
