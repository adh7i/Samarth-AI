-- ====================================================================
-- StatSamarth AI: PostgreSQL Database Schema
-- Dedicated for Ministry of Statistics and Programme Implementation (MoSPI)
-- Integrated with iGOT Karmayogi FRAC Framework
-- ====================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables in reverse dependency order if resetting
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS learning_materials CASCADE;
DROP TABLE IF EXISTS igot_courses CASCADE;
DROP TABLE IF EXISTS user_competency_scores CASCADE;
DROP TABLE IF EXISTS frac_competencies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- --------------------------------------------------------------------
-- 1. Users Table
-- Represents Indian Statistical Service (ISS) Officers, SSS, and MoSPI Leadership
-- --------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    department VARCHAR(255) NOT NULL,
    apar_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 2. FRAC Competencies Table
-- Official MoSPI Framework of Roles, Activities, and Competencies
-- Categories: 'Domain', 'Behavioral', 'Technical'
-- Required Level: 1 (Basic Awareness) to 5 (Strategic/Expert Mastery)
-- --------------------------------------------------------------------
CREATE TABLE frac_competencies (
    id VARCHAR(64) PRIMARY KEY,
    competency_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Domain', 'Behavioral', 'Technical')),
    required_level INT NOT NULL CHECK (required_level BETWEEN 1 AND 5),
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL
);

-- --------------------------------------------------------------------
-- 3. User Competency Scores Table
-- Assessed level tracking against the required FRAC benchmark
-- --------------------------------------------------------------------
CREATE TABLE user_competency_scores (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency_id VARCHAR(64) NOT NULL REFERENCES frac_competencies(id) ON DELETE CASCADE,
    current_level INT NOT NULL CHECK (current_level BETWEEN 1 AND 5),
    last_assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_competency UNIQUE (user_id, competency_id)
);

-- --------------------------------------------------------------------
-- 4. iGOT Courses Table
-- Karmayogi Bharat capacity-building courses mapped to FRAC competencies
-- --------------------------------------------------------------------
CREATE TABLE igot_courses (
    id VARCHAR(64) PRIMARY KEY,
    course_title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    competency_id VARCHAR(64) NOT NULL REFERENCES frac_competencies(id) ON DELETE CASCADE,
    target_level INT NOT NULL CHECK (target_level BETWEEN 1 AND 5),
    igot_course_id VARCHAR(100) UNIQUE NOT NULL,
    duration_mins INT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.50
);

-- --------------------------------------------------------------------
-- 5. Learning Materials Table
-- MoSPI Official Survey Manuals, Methodologies, and Classification Guides
-- --------------------------------------------------------------------
CREATE TABLE learning_materials (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    uploaded_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    file_path VARCHAR(500) NOT NULL,
    vector_namespace VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    page_count INT DEFAULT 1,
    file_size VARCHAR(50) DEFAULT '1.0 MB',
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 6. Quizzes Table
-- RAG-generated assessments aligned with Bloom's Taxonomy
-- Blooms Level: 'Remember', 'Apply', 'Analyze'
-- --------------------------------------------------------------------
CREATE TABLE quizzes (
    id VARCHAR(64) PRIMARY KEY,
    material_id VARCHAR(64) REFERENCES learning_materials(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    questions_json JSONB NOT NULL,
    blooms_level VARCHAR(50) NOT NULL CHECK (blooms_level IN ('Remember', 'Apply', 'Analyze')),
    time_limit_mins INT DEFAULT 15,
    pass_percentage INT DEFAULT 70,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 7. Quiz Attempts Table
-- Audit trail of officer assessments, scores %, and competency level advancement
-- --------------------------------------------------------------------
CREATE TABLE quiz_attempts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id VARCHAR(64) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL,
    passed BOOLEAN NOT NULL,
    competency_delta INT DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- Indexes for High-Performance Querying & Zonal Analytics
-- --------------------------------------------------------------------
CREATE INDEX idx_users_zone ON users(zone);
CREATE INDEX idx_scores_user ON user_competency_scores(user_id);
CREATE INDEX idx_scores_competency ON user_competency_scores(competency_id);
CREATE INDEX idx_igot_competency ON igot_courses(competency_id);
CREATE INDEX idx_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_materials_namespace ON learning_materials(vector_namespace);
