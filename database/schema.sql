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
    "employeeCode" VARCHAR(50) NOT NULL UNIQUE,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    "personalEmail" VARCHAR(150),
    "personalMobile" VARCHAR(30),
    "emergencyContact" VARCHAR(150),
    "emergencyMobile" VARCHAR(30),
    "bloodGroup" VARCHAR(10),
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
    "role" VARCHAR(50),
    "jobLocation" VARCHAR(50) DEFAULT 'onsite',
    "deleted_at" TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
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

//Attendence module

CREATE TABLE shifts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_minutes INTEGER DEFAULT 60,
    grace_minutes INTEGER DEFAULT 15,
    working_hours DECIMAL(5,2) NOT NULL,
    is_overnight BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_shifts (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    shift_id BIGINT NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_employee_shift UNIQUE(employee_id, effective_from)
);

CREATE TABLE attendance_rules (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grace_period_minutes INTEGER DEFAULT 15,
    late_threshold_minutes INTEGER DEFAULT 30,
    early_checkout_threshold_minutes INTEGER DEFAULT 30,
    half_day_hours DECIMAL(5,2) DEFAULT 4.0,
    full_day_hours DECIMAL(5,2) DEFAULT 8.0,
    overtime_threshold_hours DECIMAL(5,2) DEFAULT 8.0,
    allow_overtime BOOLEAN DEFAULT TRUE,
    allow_half_day BOOLEAN DEFAULT TRUE,
    status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance_records (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'Present',
    working_hours DECIMAL(5,2) DEFAULT 0,
    late_minutes INTEGER DEFAULT 0,
    early_checkout_minutes INTEGER DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    is_late BOOLEAN DEFAULT FALSE,
    is_early_checkout BOOLEAN DEFAULT FALSE,
    is_half_day BOOLEAN DEFAULT FALSE,
    shift_id BIGINT REFERENCES shifts(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_employee_date UNIQUE(employee_id, attendance_date)
);

CREATE TABLE attendance_checkins (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_id BIGINT REFERENCES attendance_records(id) ON DELETE CASCADE,
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('check_in', 'check_out')),
    event_time TIMESTAMPTZ NOT NULL,
    location VARCHAR(255),
    ip_address INET,
    device_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance_corrections (
    id BIGSERIAL PRIMARY KEY,
    attendance_id BIGINT REFERENCES attendance_records(id) ON DELETE CASCADE,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    requested_check_in TIMESTAMPTZ,
    requested_check_out TIMESTAMPTZ,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE overtime_records (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_id BIGINT REFERENCES attendance_records(id) ON DELETE CASCADE,
    overtime_date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    overtime_hours DECIMAL(5,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending',
    approved_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

//leave management module schemas

CREATE TABLE leave_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20) DEFAULT '#6366c1',
    is_paid BOOLEAN DEFAULT TRUE,
    is_carry_forward BOOLEAN DEFAULT FALSE,
    max_days_per_year INTEGER,
    max_continuous_days INTEGER,
    requires_approval BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leave_policies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id BIGINT REFERENCES departments(id) ON DELETE CASCADE,
    employment_type VARCHAR(50),
    total_days INTEGER NOT NULL,
    carry_forward_limit INTEGER DEFAULT 0,
    probation_days INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leave_allocations (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id BIGINT NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    used_days DECIMAL(5,2) DEFAULT 0,
    carried_from_previous DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_employee_leave_year UNIQUE(employee_id, leave_type_id, year)
);

CREATE TABLE leave_requests (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id BIGINT NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    reason TEXT,
    status VARCHAR(30) DEFAULT 'Pending',
    applied_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    approved_date TIMESTAMPTZ,
    rejected_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    rejected_date TIMESTAMPTZ,
    rejection_reason TEXT,
    cancelled_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    cancelled_date TIMESTAMPTZ,
    attachments TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    deleted_at TIMESTAMPTZ
);


CREATE TABLE leave_history (
    id BIGSERIAL PRIMARY KEY,
    leave_request_id BIGINT REFERENCES leave_requests(id) ON DELETE CASCADE,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    old_status VARCHAR(30),
    new_status VARCHAR(30),
    remarks TEXT,
    performed_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leave_balances (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id BIGINT NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    opening_balance DECIMAL(5,2) DEFAULT 0,
    earned_balance DECIMAL(5,2) DEFAULT 0,
    used_balance DECIMAL(5,2) DEFAULT 0,
    closing_balance DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_employee_leave_balance UNIQUE(employee_id, leave_type_id, year)
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

//ATTENDANCE INDEXES

CREATE INDEX idx_attendance_records_employee_id ON attendance_records(employee_id);
CREATE INDEX idx_attendance_records_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_attendance_records_status ON attendance_records(status);
CREATE INDEX idx_attendance_records_shift_id ON attendance_records(shift_id);
CREATE INDEX idx_attendance_records_employee_date ON attendance_records(employee_id, attendance_date);
CREATE INDEX idx_attendance_checkins_employee_id ON attendance_checkins(employee_id);
CREATE INDEX idx_attendance_checkins_attendance_id ON attendance_checkins(attendance_id);
CREATE INDEX idx_attendance_checkins_event_time ON attendance_checkins(event_time);
CREATE INDEX idx_shifts_status ON shifts(status);
CREATE INDEX idx_employee_shifts_employee_id ON employee_shifts(employee_id);
CREATE INDEX idx_employee_shifts_shift_id ON employee_shifts(shift_id);
CREATE INDEX idx_employee_shifts_effective_from ON employee_shifts(effective_from);
CREATE INDEX idx_attendance_corrections_employee_id ON attendance_corrections(employee_id);
CREATE INDEX idx_attendance_corrections_attendance_id ON attendance_corrections(attendance_id);
CREATE INDEX idx_attendance_corrections_status ON attendance_corrections(status);
CREATE INDEX idx_overtime_records_employee_id ON overtime_records(employee_id);
CREATE INDEX idx_overtime_records_attendance_id ON overtime_records(attendance_id);
CREATE INDEX idx_overtime_records_status ON overtime_records(status);

//leave indexes

CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_leave_type_id ON leave_requests(leave_type_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_start_date ON leave_requests(start_date);
CREATE INDEX idx_leave_requests_end_date ON leave_requests(end_date);
CREATE INDEX idx_leave_requests_applied_date ON leave_requests(applied_date);
CREATE INDEX idx_leave_requests_deleted_at ON leave_requests(deleted_at);

CREATE INDEX idx_leave_allocations_employee_id ON leave_allocations(employee_id);
CREATE INDEX idx_leave_allocations_leave_type_id ON leave_allocations(leave_type_id);
CREATE INDEX idx_leave_allocations_year ON leave_allocations(year);

CREATE INDEX idx_leave_balances_employee_id ON leave_balances(employee_id);
CREATE INDEX idx_leave_balances_leave_type_id ON leave_balances(leave_type_id);
CREATE INDEX idx_leave_balances_year ON leave_balances(year);

CREATE INDEX idx_leave_history_leave_request_id ON leave_history(leave_request_id);
CREATE INDEX idx_leave_history_employee_id ON leave_history(employee_id);

CREATE INDEX idx_leave_policies_department_id ON leave_policies(department_id);