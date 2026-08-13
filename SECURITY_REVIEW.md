# Security Review & Checklist: Mental Arithmetic Trainer

## Focus: Child Safety & Data Protection

### 1. Data Minimization & Privacy (Child Safety)
- [x] **No PII Stored for Children**: The `children` table only stores `name` (nickname/first name), `avatar` (emoji/preset), `level`, and `xp`. No emails, physical addresses, or full names are collected or stored for children.
- [x] **Data Purpose Limitation**: Only data strictly necessary for gamification (XP, streak) and learning progress (accuracy, response time) is retained.

### 2. Authentication & Authorization
- [x] **Parent Authentication**: Handled securely via Supabase Auth.
- [x] **Parent-Child Isolation**: Parents can only access children linked to their `parent_id`. 
- [x] **Tenant Isolation**: RLS (Row Level Security) ensures parents cannot view other parents' children, practice sessions, or profiles.

### 3. Database Security (Supabase RLS)
- [x] **Profiles RLS**: `auth.uid() = id` ensures users can only read/update their own profiles.
- [x] **Children RLS**: `auth.uid() = parent_id` restricts child management to the verified parent.
- [x] **Practice Sessions RLS**: Policies enforce that session data is only accessible if the parent owns the linked child profile.
- [x] **Vulnerability Fixed - Client-Side Score Manipulation**: Previously, the client could theoretically send `UPDATE children SET xp = 999999`. 
  - **Fix Implemented**: Direct `UPDATE` access to sensitive gamification columns has been restricted. XP and Level calculations are now moved to a secure, server-side Postgres Function (`submit_practice_session`) running as `SECURITY DEFINER`.

### 4. API & Environment Security
- [x] **No Secrets Exposed**: Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are exposed to the client. The Anon key is safe for public distribution as all access is gated by RLS and Auth tokens. No service role keys are present in the frontend.

### 5. Application Security (XSS & SQLi)
- [x] **SQL Injection Prevention**: Using the Supabase JS SDK ensures all queries use parameterized statements over the PostgREST API, eliminating SQL injection vectors.
- [x] **XSS Prevention**: React automatically escapes variables embedded in JSX (`{variable}`), preventing DOM-based Cross-Site Scripting (XSS). No `dangerouslySetInnerHTML` is used for user-generated content.

## Remediation Actions Taken
1. Created `00002_security_update.sql` to implement a secure Remote Procedure Call (RPC) for session submission.
2. Moved XP, Score, and Level calculation logic entirely to the database layer to prevent client-side cheating.
3. Updated the frontend `PracticeService` to use the secure RPC endpoint.
