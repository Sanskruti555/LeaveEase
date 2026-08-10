-- ==========================================
-- LeaveEase Enterprise Database Schema
-- Version : 1.0
-- Database : leaveease
-- ==========================================

CREATE DATABASE IF NOT EXISTS leaveease;

USE leaveease;

CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    logo_url VARCHAR(500),
    owner_user_id INT,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE companies
ADD CONSTRAINT fk_company_owner
FOREIGN KEY (owner_user_id)
REFERENCES users(user_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE TABLE company_settings (
    company_id INT PRIMARY KEY,
    timezone VARCHAR(100) NOT NULL,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE company_settings
ADD CONSTRAINT fk_company_settings_company
FOREIGN KEY (company_id)
REFERENCES companies(company_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

CREATE TABLE branches (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(company_id, name),
    UNIQUE(company_id, email)
);
ALTER TABLE branches
ADD CONSTRAINT fk_branches_company
FOREIGN KEY (company_id)
REFERENCES companies(company_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT,
    manager_id INT,
    created_by INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN','BRANCH_ADMIN' ,'MANAGER', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    is_email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN otp_code VARCHAR(6),
ADD COLUMN otp_expires_at DATETIME;

ALTER TABLE users
ADD CONSTRAINT fk_users_company
FOREIGN KEY (company_id)
REFERENCES companies(company_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE users
ADD CONSTRAINT fk_users_branch
FOREIGN KEY (branch_id)
REFERENCES branches(branch_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE users
ADD CONSTRAINT fk_users_manager
FOREIGN KEY (manager_id)
REFERENCES users(user_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE users
ADD CONSTRAINT fk_users_created_by
FOREIGN KEY (created_by)
REFERENCES users(user_id)
ON DELETE SET NULL
ON UPDATE CASCADE;



CREATE TABLE invitations (
    invitation_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    branch_id INT,
    manager_id INT,
    email VARCHAR(255) NOT NULL,
    role ENUM('BRANCH_ADMIN','MANAGER','EMPLOYEE') NOT NULL,
    invited_by INT NOT NULL,
    invitation_token VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('PENDING','ACCEPTED','EXPIRED','CANCELLED') DEFAULT 'PENDING',
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE invitations
ADD CONSTRAINT fk_invitations_company
FOREIGN KEY (company_id)
REFERENCES companies(company_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE invitations
ADD CONSTRAINT fk_invitations_branch
FOREIGN KEY (branch_id)
REFERENCES branches(branch_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE invitations
ADD CONSTRAINT fk_invitations_manager
FOREIGN KEY (manager_id)
REFERENCES users(user_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE invitations
ADD CONSTRAINT fk_invitations_invited_by
FOREIGN KEY (invited_by)
REFERENCES users(user_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

CREATE TABLE leave_types (
    leave_type_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    leave_allocation DECIMAL(5,2) NOT NULL,
    allocation_frequency ENUM('MONTHLY','YEARLY','ONE_TIME') NOT NULL,
    is_paid BOOLEAN DEFAULT TRUE,
    requires_attachment BOOLEAN DEFAULT FALSE,
    manager_approval_required BOOLEAN DEFAULT TRUE,
    carry_forward_allowed BOOLEAN DEFAULT FALSE,
    max_carry_forward_days INT DEFAULT 0,
    status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE leave_types
ADD CONSTRAINT fk_leave_types_company
FOREIGN KEY (company_id)
REFERENCES companies(company_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE leave_types
ADD CONSTRAINT fk_leave_types_created_by
FOREIGN KEY (created_by)
REFERENCES users(user_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE TABLE leave_balances (
    balance_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    cycle_start_date DATE NOT NULL,
    cycle_end_date DATE NOT NULL,
    allocated_balance DECIMAL(5,2) NOT NULL,
    used_balance DECIMAL(5,2) DEFAULT 0,
    remaining_balance DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(
        user_id,
        leave_type_id,
        cycle_start_date,
        cycle_end_date
    )
);

ALTER TABLE leave_balances
ADD CONSTRAINT fk_leave_balances_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE leave_balances
ADD CONSTRAINT fk_leave_balances_type
FOREIGN KEY (leave_type_id)
REFERENCES leave_types(leave_type_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS leave_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_type ENUM('FULL_DAY','HALF_DAY') NOT NULL,
    reason TEXT NOT NULL,
    attachment_path VARCHAR(500),
    status ENUM('PENDING','APPROVED','REJECTED','CANCELLED') DEFAULT 'PENDING',
    approved_by INT,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE leave_requests
ADD CONSTRAINT fk_leave_requests_employee
FOREIGN KEY (employee_id)
REFERENCES users(user_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE leave_requests
ADD CONSTRAINT fk_leave_requests_type
FOREIGN KEY (leave_type_id)
REFERENCES leave_types(leave_type_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE leave_requests
ADD CONSTRAINT fk_leave_requests_approved_by
FOREIGN KEY (approved_by)
REFERENCES users(user_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE notifications
ADD CONSTRAINT fk_notifications_company
FOREIGN KEY (company_id)
REFERENCES companies(company_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE notifications
ADD CONSTRAINT fk_notifications_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_id INT,
    action ENUM('CREATE','UPDATE','DELETE','LOGIN','LOGOUT') NOT NULL,
    entity_type VARCHAR(100),
    entity_id INT,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE audit_logs
ADD CONSTRAINT fk_audit_logs_company
FOREIGN KEY (company_id)
REFERENCES companies(company_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE audit_logs
ADD CONSTRAINT fk_audit_logs_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE TABLE imports (
    import_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    uploaded_by INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    import_type ENUM('MANAGER','EMPLOYEE') NOT NULL,
    total_records INT DEFAULT 0,
    successful_records INT DEFAULT 0,
    failed_records INT DEFAULT 0,
    status ENUM('PROCESSING','COMPLETED','FAILED') DEFAULT 'PROCESSING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pending_registrations (
    pending_registration_id CHAR(36) PRIMARY KEY,

    company_name VARCHAR(255) NOT NULL,
    admin_name VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    otp VARCHAR(6) NOT NULL,
    otp_expires_at DATETIME NOT NULL,

    failed_attempts INT DEFAULT 0,
    otp_resend_count INT DEFAULT 0,

    status ENUM('PENDING','VERIFIED','EXPIRED')
           DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE pending_registrations
RENAME COLUMN otp TO otp_code;

ALTER TABLE imports
ADD CONSTRAINT fk_imports_company
FOREIGN KEY (company_id)
REFERENCES companies(company_id),
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE imports
ADD CONSTRAINT fk_imports_uploaded_by
FOREIGN KEY (uploaded_by)
REFERENCES users(user_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

//SELECT DATABASE();

//SHOW TABLES;
SELECT * FROM users;
//DESCRIBE companies;

DELETE FROM pending_registrations
WHERE email = 'sanskruti.test@gmail.com';

SELECT * FROM pending_registrations;
SELECT * FROM branches;

INSERT INTO branches (
    company_id,
    name,
    email,
    phone,
    address,
    city,
    state,
    country
)
VALUES (
	'3',
    'Pune Branch',
    'pune.branch@test.com',
    '9876543210',
    'Baner',
    'Pune',
    'Maharashtra',
    'India'
);

SELECT * FROM invitations;

DELETE FROM invitations
WHERE invitation_id = 5;

SELECT * FROM leave_types;

SELECT
    company_id,
    company_name,
    status
FROM companies;

SELECT
    user_id,
    name,
    email,
    company_id,
    branch_id,
    manager_id,
    role,
    status
FROM users;

INSERT INTO leave_types (
    company_id,
    name,
    description,
    leave_allocation,
    allocation_frequency,
    is_paid,
    requires_attachment,
    manager_approval_required,
    carry_forward_allowed,
    max_carry_forward_days,
    status,
    created_by
)
VALUES (
    3,
    'Casual Leave',
    'Leave for personal or casual purposes',
    12.00,
    'YEARLY',
    TRUE,
    FALSE,
    TRUE,
    FALSE,
    0,
    'ACTIVE',
    1
);

SELECT
    leave_type_id,
    company_id,
    name,
    status
FROM leave_types;

SELECT * FROM leave_requests;

SELECT
    request_id,
    employee_id,
    status,
    approved_by,
    approved_at,
    rejection_reason
FROM leave_requests
WHERE request_id = 1;

SELECT
    request_id,
    employee_id,
    status,
    approved_by,
    approved_at,
    rejection_reason
FROM leave_requests;

SELECT
    user_id,
    name,
    email,
    company_id,
    branch_id,
    manager_id,
    role
FROM users
WHERE role = 'MANAGER';
SELECT *
FROM leave_balances;

SHOW CREATE TABLE leave_balances;

SELECT
    request_id,
    employee_id,
    leave_type_id,
    start_date,
    end_date,
    status
FROM leave_requests
ORDER BY request_id DESC;

SELECT
    balance_id,
    user_id,
    leave_type_id,
    allocated_balance,
    used_balance,
    remaining_balance
FROM leave_balances
WHERE user_id = 4
  AND leave_type_id = 1;
  
  SELECT
    request_id,
    employee_id,
    status,
    approved_by,
    approved_at
FROM leave_requests
WHERE request_id = 3;

SELECT
    request_id,
    status,
    start_date,
    end_date
FROM leave_requests
ORDER BY request_id;

SELECT
    request_id,
    status
FROM leave_requests
WHERE request_id = 4;

SELECT
    leave_type_id,
    name,
    description,
    leave_allocation,
    allocation_frequency,
    status
FROM leave_types
WHERE leave_type_id = 2;

SELECT
    leave_type_id,
    name,
    status
FROM leave_types
WHERE leave_type_id = 2;

SELECT *
FROM notifications
ORDER BY notification_id DESC;