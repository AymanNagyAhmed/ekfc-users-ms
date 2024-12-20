/**
 * Database configuration settings and validation
 */
export const databaseConfig = {
  type: process.env.DB_TYPE || 'postgresql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'chemist_db',
  
  /**
   * Constructs database URL from environment variables
   * @returns Formatted database URL string
   */
  getDatabaseUrl(): string {
    return
      `${this.type}://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}?schema=public`;
  },

  /**
   * Validates database configuration
   * @throws Error if required configuration is missing
   */
  validate(): void {
    const required = ['type', 'host', 'port', 'username', 'password', 'database'];
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required database configuration: ${missing.join(', ')}`);
    }
  }
};
