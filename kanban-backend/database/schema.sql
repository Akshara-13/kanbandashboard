
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ORGANIZATIONS
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
TENANTS
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE RESTRICT,

    UNIQUE (organization_id, slug),
    UNIQUE (organization_id, id)
);

CREATE INDEX idx_tenants_organization
ON tenants(organization_id);

USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

MEMBERSHIPS
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE (tenant_id, user_id),
    UNIQUE (tenant_id, id),

    CHECK (role IN ('owner', 'admin', 'member', 'viewer'))
);

CREATE INDEX idx_memberships_user
ON memberships(user_id);

CREATE INDEX idx_memberships_tenant_role
ON memberships(tenant_id, role);

BOARDS
CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    FOREIGN KEY (tenant_id, created_by)
        REFERENCES memberships(tenant_id, id)
        ON DELETE SET NULL (created_by),

    UNIQUE (tenant_id, id)
);

CREATE INDEX idx_boards_tenant
ON boards(tenant_id);

KANBAN COLUMNS
CREATE TABLE kanban_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    board_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (tenant_id, board_id)
        REFERENCES boards(tenant_id, id)
        ON DELETE CASCADE,

    UNIQUE (tenant_id, board_id, id),
    UNIQUE (tenant_id, board_id, position)
);

CREATE INDEX idx_columns_board_position
ON kanban_columns(tenant_id, board_id, position);

TASKS
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    board_id UUID NOT NULL,
    column_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to UUID,
    created_by UUID NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    position INTEGER NOT NULL DEFAULT 0,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (tenant_id, board_id, column_id)
        REFERENCES kanban_columns(tenant_id, board_id, id)
        ON DELETE CASCADE,

    FOREIGN KEY (tenant_id, assigned_to)
        REFERENCES memberships(tenant_id, id)
        ON DELETE SET NULL (assigned_to),

    FOREIGN KEY (tenant_id, created_by)
        REFERENCES memberships(tenant_id, id)
        ON DELETE RESTRICT,

    UNIQUE (tenant_id, id),

    CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

CREATE INDEX idx_tasks_tenant_board
ON tasks(tenant_id, board_id);

CREATE INDEX idx_tasks_column_position
ON tasks(tenant_id, column_id, position);

CREATE INDEX idx_tasks_assigned_to
ON tasks(tenant_id, assigned_to);

CREATE INDEX idx_tasks_due_date
ON tasks(tenant_id, due_date)
WHERE due_date IS NOT NULL;

ACTIVITY LOGS
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    actor_membership_id UUID,
    board_id UUID,
    task_id UUID,
    action VARCHAR(100) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    FOREIGN KEY (tenant_id, actor_membership_id)
        REFERENCES memberships(tenant_id, id)
        ON DELETE SET NULL (actor_membership_id),

    FOREIGN KEY (tenant_id, board_id)
        REFERENCES boards(tenant_id, id)
        ON DELETE SET NULL (board_id),

    FOREIGN KEY (tenant_id, task_id)
        REFERENCES tasks(tenant_id, id)
        ON DELETE SET NULL (task_id)
);

CREATE INDEX idx_activity_tenant_created
ON activity_logs(tenant_id, created_at DESC);

CREATE INDEX idx_activity_task
ON activity_logs(tenant_id, task_id, created_at DESC);

CREATE INDEX idx_activity_actor
ON activity_logs(tenant_id, actor_membership_id);
