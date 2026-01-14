/**
 * Airtable Configuration and Helper Functions
 * 
 * This module provides helper functions to interact with Airtable
 * for the Charis Foundation Dashboard backend.
 */

// Airtable Configuration
// TODO: Add these to your .env file
// AIRTABLE_BASE_ID=your_base_id
// AIRTABLE_API_KEY=your_api_key

export const AIRTABLE_CONFIG = {
  baseId: import.meta.env.AIRTABLE_BASE_ID || '',
  apiKey: import.meta.env.AIRTABLE_API_KEY || '',
};

// Table IDs - Update these after creating your Airtable base
export const TABLES = {
  GRANTS: 'tblGrants',
  PARTNERS: 'tblPartners', 
  MEETINGS: 'tblMeetings',
  DOCUMENTS: 'tblDocuments',
  BOARD_MEMBERS: 'tblBoardMembers',
};

/**
 * Generic Airtable fetch helper
 */
export async function airtableRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}`;
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Airtable API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * List records from a table
 */
export async function listRecords<T = any>(
  tableId: string,
  params?: {
    maxRecords?: number;
    filterByFormula?: string;
    sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
    view?: string;
  }
): Promise<{ records: Array<{ id: string; fields: T; createdTime: string }> }> {
  const queryParams = new URLSearchParams();
  
  if (params?.maxRecords) {
    queryParams.append('maxRecords', params.maxRecords.toString());
  }
  if (params?.filterByFormula) {
    queryParams.append('filterByFormula', params.filterByFormula);
  }
  if (params?.view) {
    queryParams.append('view', params.view);
  }
  if (params?.sort) {
    params.sort.forEach((s, i) => {
      queryParams.append(`sort[${i}][field]`, s.field);
      queryParams.append(`sort[${i}][direction]`, s.direction);
    });
  }

  const query = queryParams.toString();
  const endpoint = `/${tableId}${query ? `?${query}` : ''}`;
  
  return airtableRequest(endpoint);
}

/**
 * Get a single record by ID
 */
export async function getRecord<T = any>(
  tableId: string, 
  recordId: string
): Promise<{ id: string; fields: T; createdTime: string }> {
  return airtableRequest(`/${tableId}/${recordId}`);
}

/**
 * Create a new record
 */
export async function createRecord<T = any>(
  tableId: string, 
  fields: T
): Promise<{ id: string; fields: T; createdTime: string }> {
  return airtableRequest(`/${tableId}`, {
    method: 'POST',
    body: JSON.stringify({ fields }),
  });
}

/**
 * Update a record
 */
export async function updateRecord<T = any>(
  tableId: string, 
  recordId: string, 
  fields: Partial<T>
): Promise<{ id: string; fields: T; createdTime: string }> {
  return airtableRequest(`/${tableId}/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  });
}

/**
 * Delete a record
 */
export async function deleteRecord(
  tableId: string, 
  recordId: string
): Promise<{ deleted: boolean; id: string }> {
  return airtableRequest(`/${tableId}/${recordId}`, {
    method: 'DELETE',
  });
}

/**
 * Search records by text (simple implementation)
 */
export async function searchRecords<T = any>(
  tableId: string,
  searchTerm: string,
  searchFields: string[]
): Promise<{ records: Array<{ id: string; fields: T; createdTime: string }> }> {
  // Build an OR formula for multiple fields
  const formulaParts = searchFields.map(
    field => `FIND(LOWER("${searchTerm}"), LOWER({${field}}))`
  );
  const filterByFormula = `OR(${formulaParts.join(', ')})`;
  
  return listRecords(tableId, { filterByFormula });
}
