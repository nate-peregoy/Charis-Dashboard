/**
 * GET /api/documents/[id] - Get a single document by ID
 * PUT /api/documents/[id] - Update a document
 * DELETE /api/documents/[id] - Delete a document
 */

import type { APIRoute } from 'astro';
import { getRecord, updateRecord, deleteRecord, TABLES } from '../../../lib/airtable';
import type { Document, ApiResponse, UpdateDocumentRequest } from '../../../types';

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
          error: 'Document ID is required',
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch document from Airtable
    const result = await getRecord<Document>(TABLES.DOCUMENTS, id);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: result.id,
          ...result.fields,
        },
      } as ApiResponse<Document>),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching document:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch document',
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
          error: 'Document ID is required',
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: UpdateDocumentRequest = await request.json();
    const { document } = body;

    // Add last modified timestamp
    const documentData = {
      ...document,
      lastModified: new Date().toISOString(),
    };

    // Update document in Airtable
    const result = await updateRecord<Document>(TABLES.DOCUMENTS, id, documentData);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: result.id,
          ...result.fields,
        },
        message: 'Document updated successfully',
      } as ApiResponse<Document>),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating document:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update document',
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
          error: 'Document ID is required',
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete document from Airtable
    await deleteRecord(TABLES.DOCUMENTS, id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Document deleted successfully',
      } as ApiResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error deleting document:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete document',
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
