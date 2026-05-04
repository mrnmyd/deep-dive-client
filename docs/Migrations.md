# DeepDive — Storage Schema Migrations

All localStorage data exported by DeepDive carries a `schemaVersion` integer. On import, `src/features/preptracker/utils/migrations.ts` runs a step ladder that brings older backups up to the current schema before any keys are written. Backups newer than the running app are rejected with a clear error.

The current schema version is defined as `SCHEMA_VERSION` in `src/features/preptracker/utils/storage.ts`.

| From | To  | Purpose                                 | Fields touched                                                                                                                                                                                                                 |
| ---- | --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | 2   | Add Reader/session/notes infrastructure | Adds `lastReadTopicId` (undefined) to `pt_settings`. Seeds empty `pt_active_session` (null) and `pt_topic_notes` (`{}`) when missing. Leaves `pt_topic_progress`, `pt_problem_status`, `pt_daily_log`, `pt_streaks` untouched. |

## Adding a new migration step

1. Bump `SCHEMA_VERSION` in `utils/storage.ts`.
2. Add a step to `migrationLadder` in `utils/migrations.ts` keyed `{ from: previous, to: new, run: ... }`.
3. The step's `run(data)` receives a copy of the v_previous-shaped data record and must return a v_new-shaped record. Keep migrations idempotent — running them twice should be a no-op.
4. Update this table.

## Validation rules

- An imported file must have `app === "DeepDive"`, a string `exportedAt`, an object `data`, and an optional numeric `schemaVersion`.
- A missing `schemaVersion` is treated as version 1 to support the v1 export format that predates the field.
- A `schemaVersion > SCHEMA_VERSION` is rejected.
- A failed migration leaves localStorage untouched.

## Test fixtures

Place sample exports under `docs/_fixtures/` and reference them from the import flow when validating new migrations. The Phase F.9.2 task in `docs/Build_Tracker.md` tracks this.
