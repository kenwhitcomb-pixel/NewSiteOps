# Health History Tracker - Data Model, RLS, and Backend Contracts

## 1) Authentication and tenancy baseline

- Authentication is required for all pages and data operations.
- Every tenant-owned record belongs to an `Account`.
- Every tenant-owned record carries `allowed_user_ids` and must enforce RLS with membership checks against that field.
- Because RLS cannot join across entities, `allowed_user_ids` is denormalized and synced from `AccountMember`.

## 2) Entity creation order

1. `Account`
2. `AccountMember`
3. `UserProfile`
4. `Provider`
5. `Facility`
6. `Condition`
7. `Medication`
8. `MedicationDoseHistory`
9. `MedicationIntakeLog`
10. `Appointment`
11. `Document`
12. `SurgeryProcedure`
13. `AllergyAdverseReaction`
14. `VoiceTranscriptLog`

## 3) Shared tenant-owned fields

Add the following to all tenant-owned health entities:

- `account` (relation to Account, required)
- `allowed_user_ids` (list of text, required)
- `created_by` (relation to User, required)
- `updated_by` (relation to User, required)
- `created_at` (datetime, auto)
- `updated_at` (datetime, auto)
- `deleted_at` (datetime, optional)

Tenant-owned entities:
`Provider`, `Facility`, `Condition`, `Medication`, `MedicationDoseHistory`, `MedicationIntakeLog`, `Appointment`, `Document`, `SurgeryProcedure`, `AllergyAdverseReaction`, `VoiceTranscriptLog`

## 4) Entity definitions

### Account
- `account_name` (text, required)
- `account_type` (enum: Individual, Household, Organization, required, default Individual)
- `status` (enum: Active, Suspended, required, default Active)
- `allowed_user_ids` (list of text, required)
- `created_by` (relation to User, required)
- `updated_by` (relation to User, required)
- `created_at` (datetime, auto)
- `updated_at` (datetime, auto)

### AccountMember
- `account` (relation to Account, required)
- `user` (relation to User, required)
- `role` (enum: AccountOwner, AccountAdmin, Member, Caregiver, Viewer, required)
- `status` (enum: Invited, Active, Removed, required, default Invited)
- `invite_token` (text, optional)
- `joined_at` (datetime, optional)
- `created_by` (relation to User, required)
- `updated_by` (relation to User, required)
- `created_at` (datetime, auto)
- `updated_at` (datetime, auto)

### UserProfile
- `user` (relation to User, required, unique)
- `first_name` (text, required)
- `last_name` (text, required)
- `dob` (date, optional)
- `phone` (text, optional)
- `emergency_contact_name` (text, optional)
- `emergency_contact_phone` (text, optional)
- `preferred_pharmacy` (text, optional)
- `audio_prompts_enabled` (boolean, default false)
- `voice_input_enabled` (boolean, default true)
- `confirm_before_save` (boolean, default true)
- `created_at` (datetime, auto)
- `updated_at` (datetime, auto)

### Provider
- `provider_name` (text, required)
- `specialty` (text, optional)
- `organization` (text, optional)
- `role_type` (enum: PCP, Specialist, Dentist, Therapist, Other, required, default Other)
- `is_primary_care` (boolean, default false)
- `phone` (text, optional)
- `fax` (text, optional)
- `email` (text, optional)
- `address` (text, optional)
- `portal_url` (text, optional)
- `notes` (long text, optional)

### Facility
- `facility_name` (text, required)
- `facility_type` (enum: Hospital, Clinic, Imaging, Lab, Other, required, default Other)
- `phone` (text, optional)
- `address` (text, optional)
- `notes` (long text, optional)

### Condition
- `condition_name` (text, required)
- `status` (enum: Active, Resolved, required, default Active)
- `onset_date` (date, optional)
- `diagnosis_date` (date, optional)
- `severity` (enum: Mild, Moderate, Severe, optional)
- `notes` (long text, optional)
- `related_providers` (relation to Provider, many, optional)

### Medication
- `medication_name` (text, required)
- `generic_name` (text, optional)
- `form` (text, optional)
- `route` (enum: Oral, IM, IV, Topical, Inhaled, Other, optional)
- `status` (enum: Active, Paused, Discontinued, required, default Active)
- `start_date` (date, optional)
- `end_date` (date, optional)
- `prescribing_provider` (relation to Provider, optional)
- `indication_condition` (relation to Condition, optional)
- `notes` (long text, optional)

### MedicationDoseHistory
- `medication` (relation to Medication, required)
- `dose_amount` (number, required)
- `dose_unit` (enum: mg, mcg, g, ml, units, other, required)
- `frequency_text` (text, optional)
- `times_per_day` (number, optional)
- `schedule_times` (text, optional)
- `instructions` (long text, optional)
- `effective_start_date` (date, required)
- `effective_end_date` (date, optional)
- `change_reason` (text, optional)
- `is_confirmed` (boolean, default false)
- `confirmed_at` (datetime, optional)

### MedicationIntakeLog
- `medication` (relation to Medication, required)
- `taken_at` (datetime, required)
- `taken_dose_amount` (number, optional)
- `taken_dose_unit` (enum: mg, mcg, g, ml, units, other, optional)
- `source` (enum: Manual, Voice, Reminder, required, default Manual)
- `notes` (long text, optional)

### Appointment
- `appointment_datetime` (datetime, required)
- `provider` (relation to Provider, optional)
- `facility` (relation to Facility, optional)
- `reason_for_visit` (text, optional)
- `prep_questions` (long text, optional)
- `outcome_summary` (long text, optional)
- `follow_up_actions` (long text, optional)
- `next_steps_date` (date, optional)
- `documents` (relation to Document, many, optional)

### Document
- `file` (file upload, required)
- `doc_type` (enum: Lab, Imaging, AfterVisitSummary, Referral, Discharge, Other, required, default Other)
- `doc_date` (date, optional)
- `linked_appointment` (relation to Appointment, optional)
- `linked_provider` (relation to Provider, optional)
- `linked_condition` (relation to Condition, optional)
- `notes` (long text, optional)
- `tags` (list of text, optional)

### SurgeryProcedure
- `procedure_name` (text, required)
- `procedure_date` (date, required)
- `surgeon_provider` (relation to Provider, optional)
- `facility` (relation to Facility, optional)
- `outcome` (text, optional)
- `complications` (long text, optional)
- `notes` (long text, optional)
- `documents` (relation to Document, many, optional)

### AllergyAdverseReaction
- `substance` (text, required)
- `reaction` (text, optional)
- `severity` (enum: Mild, Moderate, Severe, required, default Moderate)
- `date_noted` (date, optional)
- `critical_flag` (boolean, default false)
- `notes` (long text, optional)

### VoiceTranscriptLog
- `captured_at` (datetime, required)
- `mode` (enum: VoiceInput, AudioPrompt, required)
- `transcript_text` (long text, required)
- `parsed_result_json` (long text, optional)
- `confidence_score` (number, optional)
- `linked_record_type` (enum: Medication, Appointment, Condition, Other, required)
- `linked_medication` (relation to Medication, optional)
- `linked_appointment` (relation to Appointment, optional)
- `linked_condition` (relation to Condition, optional)
- `status` (enum: Draft, Confirmed, Rejected, required, default Draft)

## 5) Role model

Account-scoped roles in `AccountMember`:
- `AccountOwner`
- `AccountAdmin`
- `Member`
- `Caregiver`
- `Viewer`

Role intent:
- `AccountOwner`: full control incl. member management
- `AccountAdmin`: manage data + members, cannot transfer ownership
- `Member`: CRUD on health data, no member management
- `Caregiver`: create/update health data, no delete, no member management
- `Viewer`: read-only

## 6) RLS policy templates

### Tenant-owned entities
For each of:
`Provider`, `Facility`, `Condition`, `Medication`, `MedicationDoseHistory`, `MedicationIntakeLog`, `Appointment`, `Document`, `SurgeryProcedure`, `AllergyAdverseReaction`, `VoiceTranscriptLog`

- create: current user id in `data.allowed_user_ids`
- read: current user id in `data.allowed_user_ids`
- update: current user id in `data.allowed_user_ids`
- delete: current user id in `data.allowed_user_ids`

### Account
- create: `true`
- read: current user id in `data.allowed_user_ids`
- update: current user id in `data.allowed_user_ids`
- delete: `false`

### UserProfile
- create/read/update: `data.user.id == current_user.id`
- delete: `false`

### AccountMember
- Managed by backend functions only.
- Direct client CRUD should be blocked/locked down.

## 7) Account context on user

Persist active account on authenticated user:
- `user.data.active_account_id` (text)

## 8) Membership synchronization contract

### Function: `sync_allowed_users(account)`

Triggered whenever membership is activated, removed, or role changed.

Behavior:
1. Require authenticated caller and active `AccountOwner`/`AccountAdmin` membership in account.
2. Get active members for account.
3. Build `allowed_user_ids = unique(member.user.id[])`.
4. Update `Account.allowed_user_ids`.
5. Update all tenant-owned records under that account with same `allowed_user_ids` (bulk update preferred).
6. Return counts.

## 9) Required backend functions

### `accept_invite(invite_token)`
- Validates invited member token.
- Converts invite to active member for current user.
- Promotes to owner if no owner exists.
- Calls `sync_allowed_users`.
- Sets `active_account_id` if missing.

### `change_member_role(account, target_user, new_role)`
- Caller must be `AccountOwner`.
- Prevent demotion of last owner.
- Save role and sync allowed users.

### `remove_member(account, target_user)`
- Caller must be `AccountOwner` or `AccountAdmin`.
- Admin cannot remove owner.
- Cannot remove last owner.
- Mark target as removed.
- Sync allowed users.
- Clear target active account if needed.

### `set_active_account(account)`
- Caller must have active membership in account.
- Writes `current_user.data.active_account_id`.
- Returns role.

### `get_my_accounts()`
- Returns active memberships with account metadata and role.

### Optional: `ensure_default_active_account()`
- If no active account, chooses first active membership.

## 10) UI guard requirement

On all list pages, enforce client filter:
- `record.account.id == user.data.active_account_id`

RLS still enforces membership through `allowed_user_ids`.

## 11) Voice + audio requirements (MVP)

Voice input flows:
- Add Medication
- Add Appointment
- Add Condition

Flow:
1. Record audio
2. Transcribe
3. Parse fields
4. Show review card
5. User confirms
6. Save

If `audio_prompts_enabled = true`, use TTS prompts and readback.

For voice-created medication dosing records:
- `MedicationDoseHistory.is_confirmed = false` until user confirms.

## 12) Export requirements

- Emergency Summary export to PDF.
- Full account export to JSON/CSV.
