-- StatSamarth AI: PostgreSQL Database Schema
-- Tailored for MoSPI Official Statistical System & iGOT Karmayogi FRAC Alignment

-- 1. Users table (ISS Officers, MoSPI field directors, and analysts)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    apar_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. FRAC Competencies (Framework of Roles, Activities, and Competencies)
-- Categories: 'Domain', 'Behavioral', 'Technical'
-- Levels: 1 (Basic Awareness) to 5 (Expert / Strategic Mastery)
CREATE TABLE IF NOT EXISTS frac_competencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competency_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Domain', 'Behavioral', 'Technical')),
    required_level INT NOT NULL CHECK (required_level BETWEEN 1 AND 5),
    description TEXT NOT NULL
);

-- 3. User Competency Scores (Tracks current assessed level vs required FRAC benchmark)
CREATE TABLE IF NOT EXISTS user_competency_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES frac_competencies(id) ON DELETE CASCADE,
    current_level INT NOT NULL CHECK (current_level BETWEEN 1 AND 5),
    last_assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_competency UNIQUE (user_id, competency_id)
);

-- 4. iGOT Courses (Karmayogi Bharat courses mapped to FRAC competencies)
CREATE TABLE IF NOT EXISTS igot_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    competency_id UUID NOT NULL REFERENCES frac_competencies(id) ON DELETE CASCADE,
    target_level INT NOT NULL CHECK (target_level BETWEEN 1 AND 5),
    igot_course_id VARCHAR(100) UNIQUE NOT NULL,
    duration_mins INT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.5
);

-- 5. Learning Materials (MoSPI Official Manuals: NSSO, CPI, IIP, NAS)
CREATE TABLE IF NOT EXISTS learning_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    file_path VARCHAR(500) NOT NULL,
    vector_namespace VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Quizzes (Generated MCQs with Bloom's Taxonomy & Source Citations)
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES learning_materials(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    questions_json JSONB NOT NULL,
    blooms_level VARCHAR(50) NOT NULL CHECK (blooms_level IN ('Remember', 'Apply', 'Analyze'))
);

-- 7. Quiz Attempts (Tracks assessment outcomes, score %, and competency advancement)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL,
    passed BOOLEAN NOT NULL,
    competency_delta INT DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recommended Indexes for High-Speed Queries & Analytics
CREATE INDEX IF NOT EXISTS idx_users_zone ON users(zone);
CREATE INDEX IF NOT EXISTS idx_scores_user ON user_competency_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_competency ON user_competency_scores(competency_id);
CREATE INDEX IF NOT EXISTS idx_igot_competency ON igot_courses(competency_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
