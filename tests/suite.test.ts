import assert from "node:assert/strict";
import test from "node:test";
import { db } from "../src/lib/db.ts";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "../src/lib/auth.ts";
import { translations } from "../src/lib/translations.ts";
import { distanceInKm, getApproximateCoordinates } from "../src/lib/location.ts";

test("Location: Calculates distance from approximate postal coordinates", () => {
  const gomtiNagar = getApproximateCoordinates("226010");
  const hazratganj = getApproximateCoordinates("226001");

  assert.ok(gomtiNagar && hazratganj, "Seed hospital areas should have approximate coordinates");
  assert.ok(distanceInKm(gomtiNagar, hazratganj) > 0);
  assert.ok(distanceInKm(gomtiNagar, gomtiNagar) < 0.001);
});

test("Database: Retrieves initial facilities seeded with DEMO DATA tag", () => {
  const facilities = db.getFacilities();
  assert.ok(facilities.length >= 4, "Should have at least 4 registered hospital facilities");
  const apollo = db.getFacilityById("fac_apollo_lko");
  assert.ok(apollo, "Should find Apollo Lucknow");
  assert.equal(apollo?.isDemoData, true, "Facilities must be flagged as DEMO DATA");
  assert.ok(apollo?.resources.length > 0, "Facility must contain equipment and resource items");
});

test("Database: Retrieves blood banks and filters by blood group", () => {
  const bloodBanks = db.getBloodBanks();
  assert.ok(bloodBanks.length >= 3, "Should have at least 3 blood component banks");
  const rotary = db.getBloodBankById("bb_rotary_del");
  assert.ok(rotary, "Should find Rotary Blood Bank");
  const oNeg = rotary?.inventory.find((i) => i.bloodGroup === "O-");
  assert.ok(oNeg, "Should contain O- inventory record");
  assert.ok(typeof oNeg?.unitsAvailable === "number", "Units available should be reported numeric value");
});

test("Database & Audit: Resource update persists and logs immutable audit entry", () => {
  const user = { id: "usr_test_staff", name: "Staff Testing Operator" };
  const initialLogsCount = db.getAuditLogs().length;

  const updated = db.updateFacilityResource(
    "fac_apollo_lko",
    "res_apl_1",
    {
      status: "LIMITED",
      availableUnits: 5,
      notes: "Emergency test audit validation",
    },
    user
  );

  assert.ok(updated, "Update should return the modified facility");
  const updatedRes = updated?.resources.find((r) => r.id === "res_apl_1");
  assert.equal(updatedRes?.status, "LIMITED");
  assert.equal(updatedRes?.availableUnits, 5);
  assert.equal(updatedRes?.notes, "Emergency test audit validation");

  // Verify Audit Log
  const logs = db.getAuditLogs();
  assert.ok(logs.length > initialLogsCount, "Audit log count should have increased");
  const latestLog = logs[0];
  assert.equal(latestLog.facilityId, "fac_apollo_lko");
  assert.equal(latestLog.newStatus, "LIMITED");
  assert.equal(latestLog.changedByName, "Staff Testing Operator");
});

test("Auth: Password hashing and verification", async () => {
  const rawPass = "NationalHackathon2026!";
  const hash = await hashPassword(rawPass);
  assert.notEqual(rawPass, hash, "Hash must be distinct from plaintext");

  const valid = await verifyPassword(rawPass, hash);
  assert.equal(valid, true, "Valid password must verify successfully");

  const invalid = await verifyPassword("WrongPassword123", hash);
  assert.equal(invalid, false, "Invalid password must be rejected");
});

test("Auth: JWT Session creation and verification", async () => {
  const payload = {
    id: "usr_doc_99",
    email: "dr.singh@mediconnect.local",
    role: "ADMIN",
    name: "Dr. Singh",
    facilityId: "fac_apollo_lko",
  };

  const token = await createSessionToken(payload);
  assert.ok(typeof token === "string" && token.length > 20, "Should generate valid JWT string");

  const verified = await verifySessionToken(token);
  assert.ok(verified, "JWT token must verify correctly");
  assert.equal(verified?.email, payload.email);
  assert.equal(verified?.role, payload.role);
});

test("Auth: Password Reset Token single-use consumption", () => {
  const testEmail = "operator@hospital.org";
  const token = "mock_secret_token_12345";
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  db.createPasswordResetToken(testEmail, token, expiresAt);

  // First consumption: success
  const consumedEmail = db.verifyAndConsumeResetToken(token);
  assert.equal(consumedEmail, testEmail, "Should return matching email upon first consumption");

  // Second consumption: fails because single-use
  const reusedConsumption = db.verifyAndConsumeResetToken(token);
  assert.equal(reusedConsumption, null, "Token must be invalidated after first use");
});

test("Translations: English and Hindi completeness check", () => {
  assert.ok(translations.en.common.appName, "English appName defined");
  assert.ok(translations.hi.common.appName, "Hindi appName defined");
  assert.ok(translations.en.hero.title, "English hero title defined");
  assert.ok(translations.hi.hero.title, "Hindi hero title defined");
  assert.ok(translations.en.common.emergencyCallout, "English emergency guidance defined");
  assert.ok(translations.hi.common.emergencyCallout, "Hindi emergency guidance defined");
});
