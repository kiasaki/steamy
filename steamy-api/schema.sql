DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS environments CASCADE;
DROP TABLE IF EXISTS builds CASCADE;
DROP TABLE IF EXISTS hosts CASCADE;
DROP TABLE IF EXISTS deployments CASCADE;

CREATE TABLE users (
    id uuid NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    api_token text NOT NULL,
    deleted bool NOT NULL DEFAULT false,
    created timestamp NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT users_id UNIQUE (id),
    CONSTRAINT users_email UNIQUE (email)
);

CREATE TABLE projects (
    id uuid NOT NULL,
    title text NOT NULL,
    script_env text NOT NULL,
    script_build text NOT NULL,
    script_deploy text NOT NULL,
    created timestamp NOT NULL,
    updated timestamp NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT projects_id UNIQUE (id)
);

CREATE TABLE environments (
    id uuid NOT NULL,
    project_id uuid NOT NULL REFERENCES projects (id),
    title text NOT NULL,
    priority text NOT NULL,
    script_env text NOT NULL,
    script_deploy text NOT NULL,
    hosts text[] NOT NULL,
    groups text[] NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT environments_id UNIQUE (id)
);

CREATE TABLE builds (
    id uuid NOT NULL,
    version text NOT NULL,
    project_id uuid NOT NULL REFERENCES projects (id),
    status text NOT NULL,
    repo_url text,
    repo_name text,
    repo_branch text,
    repo_commit text,
    publisher text,
    created timestamp NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT builds_id UNIQUE (id),
    CHECK (status IN ('waiting', 'running', 'failed', 'succeeded'))
);

CREATE TABLE hosts (
    id uuid NOT NULL,
    hostname text NOT NULL,
    groups text[] NOT NULL,
    ip text NOT NULL,
    status text NOT NULL,
    created timestamp NOT NULL,
    updated timestamp NOT NULL,
    CHECK (status IN ('active', 'inactive', 'missing', 'deleted')),
    PRIMARY KEY (id),
    CONSTRAINT hosts_id UNIQUE (id)
);

CREATE TABLE deployments (
    id uuid NOT NULL,
    build_id uuid NOT NULL REFERENCES builds (id),
    project_id uuid NOT NULL REFERENCES projects (id),
    environment_id uuid NOT NULL REFERENCES environments (id),
    status text NOT NULL,
    kind text NOT NULL,
    created timestamp NOT NULL,
    updated timestamp NOT NULL,
    CHECK (kind IN ('regular', 'hotfix', 'rollback')),
    CHECK (status IN ('running', 'failing', 'failed', 'succeeded')),
    PRIMARY KEY (id),
    CONSTRAINT deployments_id UNIQUE (id)
);

INSERT INTO users (
    id, email, password, api_token, deleted, created
) VALUES (
    'f8afe41c-03af-4441-b89b-bf6544d4aebb',
    'admin@localhost',
    '$2a$12$folUR3dCx0w3wsQFb83LUOTMtY7zJgYq9w3QIKGgJP1MOYkqC1drS', -- deployinate
    '1c24720446c14ee4a143ce7818edbc35',
    false,
    '2016-01-01 00:00:00'
);
