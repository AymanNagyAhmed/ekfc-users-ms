import { ConflictException } from '@nestjs/common';

/**
 * Custom exception for resource conflict errors
 * Used when an operation conflicts with existing resource state
 * Logs error details to console for debugging
 */
export class ResourceConflictException extends ConflictException {
  constructor(resource: string = 'Resource', details?: any) {
    const message = `${resource} already exists.`;
    super(message);

    // Log error details to console
    console.error('Resource Conflict Error:', {
      resource,
      message,
      details,
      timestamp: new Date().toISOString(),
      stack: this.stack
    });
  }
} 