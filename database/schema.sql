CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    activated_at TIMESTAMPTZ,
    deactivated_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token_hash VARCHAR(255) NOT NULL UNIQUE,
    refresh_token_hash VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_verification_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    login_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    logout_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    login_status VARCHAR(30) NOT NULL,
    failure_reason TEXT
);

CREATE TABLE security_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_description TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    head_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    "userId" BIGINT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    "employeeId" VARCHAR(50) NOT NULL UNIQUE,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    "dateOfBirth" DATE,
    gender VARCHAR(30),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    "departmentId" BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    "designationId" BIGINT REFERENCES designations(id) ON DELETE SET NULL,
    "reportingManagerId" BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    "joiningDate" DATE NOT NULL,
    "employmentType" VARCHAR(50),
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    role VARCHAR(100),
    job_location VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_employee_job_location
        CHECK (job_location IN ('Hybrid', 'Onsite', 'Remote'))
);

ALTER TABLE departments
ADD CONSTRAINT fk_department_head
FOREIGN KEY (head_id)
REFERENCES employees(id)
ON DELETE SET NULL;

CREATE TABLE employee_emergency_contacts (
    id BIGSERIAL PRIMARY KEY,
    "employeeId" BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    "contactName" VARCHAR(150) NOT NULL,
    relationship VARCHAR(100),
    phone VARCHAR(30) NOT NULL,
    "alternatePhone" VARCHAR(30),
    email VARCHAR(150),
    address TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_bank_accounts (
    id BIGSERIAL PRIMARY KEY,
    "employeeId" BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    "accountHolderName" VARCHAR(150) NOT NULL,
    "bankName" VARCHAR(150) NOT NULL,
    "accountNumber" VARCHAR(100) NOT NULL,
    "ifscCode" VARCHAR(30),
    "accountType" VARCHAR(30),
    "isPrimary" BOOLEAN NOT NULL DEFAULT FALSE,
    "isVerified" BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_history (
    id BIGSERIAL PRIMARY KEY,
    "employeeId" BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    "changeType" VARCHAR(100) NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "effectiveDate" DATE NOT NULL,
    remarks TEXT,
    "changedBy" BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_status_history (
    id BIGSERIAL PRIMARY KEY,
    "employeeId" BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    "oldStatus" VARCHAR(30),
    "newStatus" VARCHAR(30) NOT NULL,
    "effectiveDate" DATE NOT NULL,
    reason TEXT,
    "changedBy" BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branches (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_userId
ON employees("userId");

CREATE INDEX idx_employees_departmentId
ON employees("departmentId");

CREATE INDEX idx_employees_designationId
ON employees("designationId");

CREATE INDEX idx_employees_reportingManagerId
ON employees("reportingManagerId");

CREATE INDEX idx_employee_emergency_contacts_employeeId
ON employee_emergency_contacts("employeeId");

CREATE INDEX idx_employee_bank_accounts_employeeId
ON employee_bank_accounts("employeeId");

CREATE INDEX idx_employee_history_employeeId
ON employee_history("employeeId");

CREATE INDEX idx_employee_status_history_employeeId
ON employee_status_history("employeeId");

CREATE INDEX idx_branches_company_id
ON branches(company_id);

CREATE INDEX idx_users_role_id 
ON users(role_id);

CREATE INDEX idx_user_sessions_user_id 
ON user_sessions(user_id);

CREATE INDEX idx_user_sessions_expires_at 
ON user_sessions(expires_at);

CREATE INDEX idx_password_reset_tokens_user_id 
ON password_reset_tokens(user_id);

CREATE INDEX idx_password_history_user_id 
ON password_history(user_id);

CREATE INDEX idx_email_verification_tokens_user_id 
ON email_verification_tokens(user_id);

CREATE INDEX idx_login_history_user_id 
ON login_history(user_id);

CREATE INDEX idx_login_history_login_at 
ON login_history(login_at);

CREATE INDEX idx_security_history_user_id 
ON security_history(user_id);

CREATE INDEX idx_security_history_created_at 
ON security_history(created_at);
