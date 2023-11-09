import pg, { Pool, QueryResult, PoolConfig } from 'pg';

export default class PoolRequest {
  private _pool: Pool | null = null;

  connect(options: PoolConfig): void {
    this._pool = new pg.Pool(options);
  }

  close(): Promise<void> {
    return this._pool?.end() ?? Promise.resolve();
  }

  query(sql: string, params?: unknown[]): Promise<QueryResult> {
    return this._pool?.query(sql, params) ?? Promise.reject(new Error('Connection pool is not initialized.'));
  }
}

const pool = new PoolRequest();
pool.connect({
  host: process.env.DATABASE_host,
  port: Number(process.env.DATABASE_port),
  database: process.env.DATABASE_database,
  user: process.env.DATABASE_user,
  password: process.env.DATABASE_password,
});
export { pool };
