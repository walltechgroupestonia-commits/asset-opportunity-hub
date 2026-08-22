CREATE TABLE IF NOT EXISTS engine_cases (
    id UUID PRIMARY KEY,
    jurisdiction_code VARCHAR(8) NOT NULL,
    case_type VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    title TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS engine_cases_jurisdiction_idx
    ON engine_cases (jurisdiction_code);

CREATE INDEX IF NOT EXISTS engine_cases_status_idx
    ON engine_cases (status);

CREATE INDEX IF NOT EXISTS engine_cases_created_at_idx
    ON engine_cases (created_at DESC);
