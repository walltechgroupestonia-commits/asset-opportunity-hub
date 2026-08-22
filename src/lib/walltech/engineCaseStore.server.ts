import { randomUUID } from "node:crypto";
import { Pool } from "pg";

export type EngineJurisdictionCode = "IT" | "EE" | "CH" | "PL";

export interface EngineCase {
  id: string;
  jurisdictionCode: EngineJurisdictionCode;
  caseType: "PROPERTY";
  status: "OPEN" | "IN_ANALYSIS" | "DECIDED" | "COMPLETED";
  title: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEngineCaseInput {
  jurisdictionCode: EngineJurisdictionCode;
  caseType?: "PROPERTY";
  title?: string | null;
  payload?: Record<string, unknown>;
}

const pool = new Pool({
  database: process.env.WALLTECH_ENGINE_DB ?? "walltech_engine",
  user: process.env.WALLTECH_ENGINE_DB_USER ?? "walltech",
  host:
    process.env.WALLTECH_ENGINE_DB_HOST ??
    "/var/run/postgresql",
});

function mapRow(row: {
  id: string;
  jurisdiction_code: EngineJurisdictionCode;
  case_type: "PROPERTY";
  status: EngineCase["status"];
  title: string | null;
  payload: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}): EngineCase {
  return {
    id: row.id,
    jurisdictionCode: row.jurisdiction_code,
    caseType: row.case_type,
    status: row.status,
    title: row.title,
    payload: row.payload,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function createEngineCase(
  input: CreateEngineCaseInput,
): Promise<EngineCase> {
  const id = randomUUID();

  const result = await pool.query(
    `
      INSERT INTO engine_cases (
        id,
        jurisdiction_code,
        case_type,
        status,
        title,
        payload
      )
      VALUES ($1, $2, $3, 'OPEN', $4, $5::jsonb)
      RETURNING *
    `,
    [
      id,
      input.jurisdictionCode,
      input.caseType ?? "PROPERTY",
      input.title ?? null,
      JSON.stringify(input.payload ?? {}),
    ],
  );

  return mapRow(result.rows[0]);
}

export async function getEngineCase(
  id: string,
): Promise<EngineCase | null> {
  const result = await pool.query(
    `
      SELECT *
      FROM engine_cases
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rowCount
    ? mapRow(result.rows[0])
    : null;
}

export async function updateEngineCasePayload(
  id: string,
  payload: Record<string, unknown>,
): Promise<EngineCase | null> {
  const result = await pool.query(
    `
      UPDATE engine_cases
      SET
        payload = $2::jsonb,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [id, JSON.stringify(payload)],
  );

  return result.rowCount
    ? mapRow(result.rows[0])
    : null;
}
