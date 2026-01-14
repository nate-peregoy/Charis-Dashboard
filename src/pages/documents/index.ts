/**
 * GET /api/documents - List all documents with optional filtering
 * POST /api/documents - Create a new document
 */

import type { APIRoute } from 'astro';
import { listRecords, createRecord, TABLES } from '../../../lib/airtable';
import type { Document, ApiResponse, CreateDocumentRequest } from '../../../types';

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
    const category = url.searchParams.get('category');
    const accessLevel = url.searchParams.get('accessLevel');
    const maxRecords = url.searchParams.get('maxRecords');

    // Build filter formula
    let filterParts: string[] = [];
    if (category) {
      filterParts.push(`{category} = "${category}"`);
    }
    if (accessLevel) {
      filterParts.push(`{accessLevel} = "${accessLevel}"`);
    }

    const filterByFormula = filterParts.length > 0 
      ? `AND(${filterParts.join(', ')})` 
      : undefined;

    // Fetch documents from Airtable
    const result = await listRecords<Document>(TABLES.DOCUMENTS, {
      maxRecords: maxRecords ? parseInt(maxRecords) : 100,
      filterByFormula,
      sort: [{ field: 'uploadDate', direction: 'desc' }],
    });

    // Transform Airtable records to Document objects
    const documents = result.records.map(record => ({
      id: record.id,
      ...record.fields,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: documents,
      } as ApiResponse<Document[]>),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching documents:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch documents',
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
    const body: CreateDocumentRequest = await request.json();
    const { document } = body;

    // Validate required fields
    if (!document.title || !document.fileUrl || !document.fileName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: title, fileUrl, fileName',
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Set default values
    const documentData: Document = {
      ...document,
      category: document.category || 'other',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: userId,
      accessLevel: document.accessLevel || 'board',
    };

    // Create document in Airtable
    const result = await createRecord<Document>(TABLES.DOCUMENTS, documentData);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: result.id,
          ...result.fields,
        },
        message: 'Document created successfully',
      } as ApiResponse<Document>),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating document:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create document',
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
