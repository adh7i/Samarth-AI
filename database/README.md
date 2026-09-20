# StatSamarth AI - Database Layer

This directory contains the complete database definitions and migration assets for **StatSamarth AI**, aligned with the **iGOT Karmayogi FRAC** framework and **MoSPI** administrative requirements.

---

## 🗄️ Database Entities Overview

1. **`users`**: Official profiles of Indian Statistical Service (ISS) officers, Subordinate Statistical Service (SSS), and field directors with Cadre Role, Zone, and unique `apar_id`.
2. **`frac_competencies`**: MoSPI official competencies categorized into **Domain**, **Behavioral**, and **Technical** across levels 1 to 5.
3. **`user_competency_scores`**: Relational junction table mapping assessed level vs required FRAC benchmark for each officer.
4. **`igot_courses`**: Certified Karmayogi Bharat courses from NSSTA, ISTM, and Karmayogi Bharat mapped to FRAC competencies.
5. **`learning_materials`**: Official MoSPI statistical manuals (NSSO, CPI, IIP, NAS) with vector namespaces and metadata.
6. **`quizzes`**: Synthesized assessments categorized by Bloom's Taxonomy (`Remember`, `Apply`, `Analyze`) with source citation chunks.
7. **`quiz_attempts`**: Audit trail of attempts, percentage scores, pass/fail status, and competency delta upgrades (+1 level).

---

## 🚀 How to Deploy on PostgreSQL / Supabase / Neon

### 1. Initialize Tables
Run the DDL schema against your PostgreSQL database:
```bash
psql -U postgres -d statsamarth_db -f database/schema.sql
```

### 2. Populate Authentic MoSPI Seed Data
Load the verified ISS officers, competencies, and course catalog:
```bash
psql -U postgres -d statsamarth_db -f database/seed.sql
```

### 3. Configure Connection
Create or update your `.env` file in the project root:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/statsamarth_db
```
