-- Glucose value must be a whole number between 40 and 600 mg/dl (assignment rule).
ALTER TABLE "readings"
ADD CONSTRAINT "readings_value_range_check"
CHECK ("value" >= 40 AND "value" <= 600);

-- Time slots are already constrained by the PostgreSQL "TimeSlot" enum
-- (MORNING, AFTER_BREAKFAST, AFTER_LUNCH, AFTER_DINNER).
-- Unique (user_id, reading_date, time_slot) was added in the init migration.
