import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  User,
  Facility,
  BloodBank,
  BloodGroup,
  BloodRequest,
  HospitalRegistration,
  AuditLog,
  SystemNotification,
  PasswordResetToken,
} from "@/types";

export interface DatabaseState {
  users: User[];
  facilities: Facility[];
  bloodBanks: BloodBank[];
  bloodRequests: BloodRequest[];
  hospitalRegistrations: HospitalRegistration[];
  auditLogs: AuditLog[];
  notifications: SystemNotification[];
  passwordResetTokens: PasswordResetToken[];
}

const DATA_FILE_PATH = process.env.MEDICONNECT_DATA_FILE
  ? path.resolve(process.env.MEDICONNECT_DATA_FILE)
  : path.join(process.cwd(), "data", "database.json");

// Initial Seed Data with strict DEMO DATA tagging
function getInitialSeed(): DatabaseState {
  const now = new Date().toISOString();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  return {
    users: [
      {
        id: "usr_admin_01",
        name: "Dr. Vikram Seth",
        email: "admin@mediconnect.local",
        // hashed version of 'Admin@123'
        passwordHash: "$2a$10$w1QO8mH4JqU6mI6wQ9O9z.y0Y4P2Vn0fCgE5r4yYn6s2k8tD7d1Ke",
        role: "ADMIN",
        phone: "+91 98765 43210",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "usr_staff_apollo",
        name: "Nurse Priya Sharma",
        email: "staff.apollo@mediconnect.local",
        // hashed version of 'Staff@123'
        passwordHash: "$2a$10$w1QO8mH4JqU6mI6wQ9O9z.y0Y4P2Vn0fCgE5r4yYn6s2k8tD7d1Ke",
        role: "FACILITY_STAFF",
        facilityId: "fac_apollo_lko",
        phone: "+91 98765 12345",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "usr_staff_max",
        name: "Dr. Arvind Mehta",
        email: "staff.max@mediconnect.local",
        passwordHash: "$2a$10$w1QO8mH4JqU6mI6wQ9O9z.y0Y4P2Vn0fCgE5r4yYn6s2k8tD7d1Ke",
        role: "FACILITY_STAFF",
        facilityId: "fac_max_del",
        phone: "+91 98111 22334",
        createdAt: now,
        updatedAt: now,
      },
    ],
    facilities: [
      {
        id: "fac_apollo_lko",
        name: "City Care Hospital",
        type: "HOSPITAL",
        address: "Gomti Nagar, Lucknow, Uttar Pradesh",
        area: "Gomti Nagar",
        city: "Lucknow",
        state: "Uttar Pradesh",
        pincode: "226010",
        phone: "+91 522 408 1234",
        emergencyPhone: "+91 522 408 1200",
        email: "emergency@citycarehospital.org",
        website: "https://citycarehospital.org",
        image: "/images/hospital-photo-1.jpg",
        distanceKm: 1.2,
        totalBeds: 330,
        dataSource: "Hospital On-Duty Administration",
        verified: true,
        isDemoData: true,
        updatedAt: twoHoursAgo,
        resources: [
          {
            id: "res_apl_1",
            facilityId: "fac_apollo_lko",
            category: "BEDS",
            name: "ICU Beds",
            status: "AVAILABLE",
            availableUnits: 8,
            totalUnits: 45,
            lastUpdated: twoHoursAgo,
            notes: "8 ICU critical care beds operational with multipara monitors.",
          },
          {
            id: "res_apl_2",
            facilityId: "fac_apollo_lko",
            category: "EQUIPMENT",
            name: "Ventilators",
            status: "AVAILABLE",
            availableUnits: 6,
            totalUnits: 30,
            lastUpdated: twoHoursAgo,
            notes: "High-end invasive ventilators functional.",
          },
          {
            id: "res_apl_3",
            facilityId: "fac_apollo_lko",
            category: "DIAGNOSTICS",
            name: "X-Ray",
            status: "AVAILABLE",
            totalUnits: 3,
            lastUpdated: twoHoursAgo,
            notes: "Digital X-Ray active 24/7.",
          },
          {
            id: "res_apl_4",
            facilityId: "fac_apollo_lko",
            category: "DIAGNOSTICS",
            name: "ECG",
            status: "AVAILABLE",
            totalUnits: 5,
            lastUpdated: twoHoursAgo,
            notes: "Emergency 12-lead ECG bedside and diagnostic available.",
          },
          {
            id: "res_apl_5",
            facilityId: "fac_apollo_lko",
            category: "BEDS",
            name: "Oxygen Beds",
            status: "AVAILABLE",
            availableUnits: 24,
            totalUnits: 120,
            lastUpdated: twoHoursAgo,
            notes: "Dedicated pipeline oxygen supply active.",
          },
          {
            id: "res_apl_6",
            facilityId: "fac_apollo_lko",
            category: "SPECIALTY",
            name: "NICU (Neonatal)",
            status: "LIMITED",
            availableUnits: 2,
            totalUnits: 15,
            lastUpdated: twoHoursAgo,
            notes: "Only 2 incubators unoccupied. Call ahead for transfer.",
          },
        ],
      },
      {
        id: "fac_kgmu_lko",
        name: "Sunrise Multispeciality Hospital",
        type: "HOSPITAL",
        address: "Hazratganj, Lucknow, Uttar Pradesh",
        area: "Hazratganj",
        city: "Lucknow",
        state: "Uttar Pradesh",
        pincode: "226001",
        phone: "+91 522 412 5678",
        emergencyPhone: "+91 522 412 5600",
        email: "emergency@sunrisehospital.org",
        website: "https://sunrisehospital.org",
        image: "/images/hospital-photo-2.jpg",
        distanceKm: 3.8,
        totalBeds: 520,
        dataSource: "Chief Medical Officer Desk",
        verified: true,
        isDemoData: true,
        updatedAt: now,
        resources: [
          {
            id: "res_kgm_1",
            facilityId: "fac_kgmu_lko",
            category: "BEDS",
            name: "ICU Beds",
            status: "LIMITED",
            availableUnits: 3,
            totalUnits: 120,
            lastUpdated: now,
            notes: "Level 1 Trauma ICU currently high occupancy.",
          },
          {
            id: "res_kgm_2",
            facilityId: "fac_kgmu_lko",
            category: "EQUIPMENT",
            name: "Ventilators",
            status: "LIMITED",
            availableUnits: 4,
            totalUnits: 80,
            lastUpdated: now,
            notes: "Trauma center ventilator reserves restricted.",
          },
          {
            id: "res_kgm_3",
            facilityId: "fac_kgmu_lko",
            category: "DIAGNOSTICS",
            name: "X-Ray",
            status: "AVAILABLE",
            totalUnits: 12,
            lastUpdated: now,
            notes: "Trauma emergency X-ray running round the clock.",
          },
          {
            id: "res_kgm_4",
            facilityId: "fac_kgmu_lko",
            category: "DIAGNOSTICS",
            name: "ECG",
            status: "AVAILABLE",
            totalUnits: 20,
            lastUpdated: now,
            notes: "Casualty ward ECG stations operational.",
          },
          {
            id: "res_kgm_5",
            facilityId: "fac_kgmu_lko",
            category: "BEDS",
            name: "Oxygen Beds",
            status: "AVAILABLE",
            availableUnits: 45,
            totalUnits: 500,
            lastUpdated: now,
            notes: "General ward oxygen manifold functioning smoothly.",
          },
        ],
      },
      {
        id: "fac_max_del",
        name: "LifeCare Hospital",
        type: "HOSPITAL",
        address: "Aliganj, Lucknow, Uttar Pradesh",
        area: "Aliganj",
        city: "Lucknow",
        state: "Uttar Pradesh",
        pincode: "226024",
        phone: "+91 522 433 2211",
        emergencyPhone: "+91 522 433 2200",
        email: "care@lifecarehospital.org",
        website: "https://lifecarehospital.org",
        image: "/images/hospital-photo-3.jpg",
        distanceKm: 5.4,
        totalBeds: 410,
        dataSource: "Hospital Operations Room",
        verified: true,
        isDemoData: true,
        updatedAt: twoHoursAgo,
        resources: [
          {
            id: "res_max_1",
            facilityId: "fac_max_del",
            category: "BEDS",
            name: "ICU Beds",
            status: "AVAILABLE",
            availableUnits: 12,
            totalUnits: 75,
            lastUpdated: twoHoursAgo,
            notes: "Cardiac & Neuro ICUs with immediate nurse staffing.",
          },
          {
            id: "res_max_2",
            facilityId: "fac_max_del",
            category: "EQUIPMENT",
            name: "Ventilators",
            status: "AVAILABLE",
            availableUnits: 9,
            totalUnits: 50,
            lastUpdated: twoHoursAgo,
            notes: "High-frequency oscillatory ventilators in standby.",
          },
          {
            id: "res_max_3",
            facilityId: "fac_max_del",
            category: "DIAGNOSTICS",
            name: "X-Ray",
            status: "AVAILABLE",
            totalUnits: 6,
            lastUpdated: twoHoursAgo,
            notes: "Portable bedside and fixed DR systems online.",
          },
          {
            id: "res_max_4",
            facilityId: "fac_max_del",
            category: "DIAGNOSTICS",
            name: "ECG",
            status: "AVAILABLE",
            totalUnits: 10,
            lastUpdated: twoHoursAgo,
            notes: "Wireless tele-ECG available in triage.",
          },
        ],
      },
      {
        id: "fac_aiims_del",
        name: "AIIMS Ansari Nagar (All India Institute of Medical Sciences)",
        type: "HOSPITAL",
        address: "Sri Aurobindo Marg, Ansari Nagar",
        area: "Ansari Nagar",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110029",
        phone: "+91 11 26588500",
        emergencyPhone: "+91 11 26593638",
        email: "emergency@aiims.edu",
        website: "https://aiims.edu",
        latitude: 28.5672,
        longitude: 77.2100,
        totalBeds: 2478,
        dataSource: "National Health Portal Feed",
        verified: true,
        isDemoData: true,
        updatedAt: yesterday,
        resources: [
          {
            id: "res_aim_1",
            facilityId: "fac_aiims_del",
            category: "BEDS",
            name: "ICU Beds",
            status: "UNAVAILABLE",
            availableUnits: 0,
            totalUnits: 150,
            lastUpdated: yesterday,
            notes: "General and emergency ICUs full. Triage redirects to Safdarjung Hospital.",
          },
          {
            id: "res_aim_2",
            facilityId: "fac_aiims_del",
            category: "EQUIPMENT",
            name: "Ventilators",
            status: "LIMITED",
            availableUnits: 1,
            totalUnits: 100,
            lastUpdated: yesterday,
            notes: "Reserve ventilator in pediatric surgical wing only.",
          },
          {
            id: "res_aim_3",
            facilityId: "fac_aiims_del",
            category: "DIAGNOSTICS",
            name: "X-Ray",
            status: "AVAILABLE",
            totalUnits: 18,
            lastUpdated: yesterday,
            notes: "24/7 emergency digital radiography.",
          },
          {
            id: "res_aim_4",
            facilityId: "fac_aiims_del",
            category: "DIAGNOSTICS",
            name: "ECG",
            status: "AVAILABLE",
            totalUnits: 25,
            lastUpdated: yesterday,
            notes: "Triage and critical resuscitation bay monitors active.",
          },
        ],
      },
      {
        id: "fac_medanta_gur",
        name: "Medanta - The Medicity",
        type: "HOSPITAL",
        address: "CH Bakhtawar Singh Road, Sector 38",
        area: "Sector 38",
        city: "Gurugram",
        state: "Haryana",
        pincode: "122001",
        phone: "+91 124 4141414",
        emergencyPhone: "+91 124 4834000",
        email: "info@medanta.org",
        website: "https://medanta.org",
        latitude: 28.4398,
        longitude: 77.0422,
        totalBeds: 1250,
        dataSource: "Medanta Command Center",
        verified: true,
        isDemoData: true,
        updatedAt: twoHoursAgo,
        resources: [
          {
            id: "res_med_1",
            facilityId: "fac_medanta_gur",
            category: "BEDS",
            name: "ICU Beds",
            status: "AVAILABLE",
            availableUnits: 18,
            totalUnits: 300,
            lastUpdated: twoHoursAgo,
            notes: "Medical, Surgical, and Critical Care beds available.",
          },
          {
            id: "res_med_2",
            facilityId: "fac_medanta_gur",
            category: "EQUIPMENT",
            name: "Ventilators",
            status: "AVAILABLE",
            availableUnits: 14,
            totalUnits: 180,
            lastUpdated: twoHoursAgo,
            notes: "Servo-u and Hamilton ventilators verified ready.",
          },
          {
            id: "res_med_3",
            facilityId: "fac_medanta_gur",
            category: "DIAGNOSTICS",
            name: "X-Ray",
            status: "AVAILABLE",
            totalUnits: 8,
            lastUpdated: twoHoursAgo,
            notes: "Diagnostic imaging suites running continuously.",
          },
          {
            id: "res_med_4",
            facilityId: "fac_medanta_gur",
            category: "DIAGNOSTICS",
            name: "ECG",
            status: "AVAILABLE",
            totalUnits: 14,
            lastUpdated: twoHoursAgo,
            notes: "Emergency cardiology team on duty.",
          },
        ],
      },
    ],
    bloodBanks: [
      {
        id: "bb_apollo_lko",
        name: "Red Cross Blood Bank",
        hospitalName: "Hazratganj, Lucknow",
        address: "Hazratganj, Lucknow, Uttar Pradesh",
        area: "Hazratganj",
        city: "Lucknow",
        state: "Uttar Pradesh",
        pincode: "226001",
        phone: "+91 522 331 1244",
        operatingHours: "24 Hours / 7 Days",
        dataSource: "State Transfusion Council",
        verified: true,
        isDemoData: true,
        updatedAt: twoHoursAgo,
        inventory: [
          { bloodGroup: "A+", status: "AVAILABLE", unitsAvailable: 15, lastUpdated: twoHoursAgo },
          { bloodGroup: "B+", status: "AVAILABLE", unitsAvailable: 8, lastUpdated: twoHoursAgo },
          { bloodGroup: "O+", status: "AVAILABLE", unitsAvailable: 12, lastUpdated: twoHoursAgo },
          { bloodGroup: "AB+", status: "AVAILABLE", unitsAvailable: 28, lastUpdated: twoHoursAgo },
          { bloodGroup: "A-", status: "LIMITED", unitsAvailable: 3, lastUpdated: twoHoursAgo },
          { bloodGroup: "B-", status: "LIMITED", unitsAvailable: 4, lastUpdated: twoHoursAgo },
          { bloodGroup: "O-", status: "LIMITED", unitsAvailable: 2, lastUpdated: twoHoursAgo },
          { bloodGroup: "AB-", status: "UNAVAILABLE", unitsAvailable: 0, lastUpdated: twoHoursAgo },
        ],
      },
      {
        id: "bb_redcross_lko",
        name: "LifeLine Blood Bank",
        hospitalName: "Aliganj, Lucknow",
        address: "Aliganj, Lucknow, Uttar Pradesh",
        area: "Aliganj",
        city: "Lucknow",
        state: "Uttar Pradesh",
        pincode: "226024",
        phone: "+91 522 441 7788",
        operatingHours: "24 Hours / 7 Days",
        dataSource: "State Voluntary Blood Donation Council",
        verified: true,
        isDemoData: true,
        updatedAt: now,
        inventory: [
          { bloodGroup: "A+", status: "AVAILABLE", unitsAvailable: 26, lastUpdated: now },
          { bloodGroup: "B+", status: "AVAILABLE", unitsAvailable: 12, lastUpdated: now },
          { bloodGroup: "O+", status: "AVAILABLE", unitsAvailable: 18, lastUpdated: now },
          { bloodGroup: "AB+", status: "AVAILABLE", unitsAvailable: 30, lastUpdated: now },
          { bloodGroup: "A-", status: "LIMITED", unitsAvailable: 4, lastUpdated: now },
          { bloodGroup: "B-", status: "LIMITED", unitsAvailable: 2, lastUpdated: now },
          { bloodGroup: "O-", status: "AVAILABLE", unitsAvailable: 5, lastUpdated: now },
          { bloodGroup: "AB-", status: "UNAVAILABLE", unitsAvailable: 0, lastUpdated: now },
        ],
      },
      {
        id: "bb_rotary_del",
        name: "Sanjeevani Blood Bank",
        hospitalName: "Indira Nagar, Lucknow",
        address: "Indira Nagar, Lucknow, Uttar Pradesh",
        area: "Indira Nagar",
        city: "Lucknow",
        state: "Uttar Pradesh",
        pincode: "226016",
        phone: "+91 522 553 1144",
        operatingHours: "24 Hours / 7 Days",
        dataSource: "Sanjeevani Blood Council",
        verified: true,
        isDemoData: true,
        updatedAt: now,
        inventory: [
          { bloodGroup: "A+", status: "AVAILABLE", unitsAvailable: 34, lastUpdated: now },
          { bloodGroup: "A-", status: "AVAILABLE", unitsAvailable: 7, lastUpdated: now },
          { bloodGroup: "B+", status: "AVAILABLE", unitsAvailable: 41, lastUpdated: now },
          { bloodGroup: "B-", status: "LIMITED", unitsAvailable: 5, lastUpdated: now },
          { bloodGroup: "AB+", status: "AVAILABLE", unitsAvailable: 14, lastUpdated: now },
          { bloodGroup: "AB-", status: "LIMITED", unitsAvailable: 3, lastUpdated: now },
          { bloodGroup: "O+", status: "AVAILABLE", unitsAvailable: 52, lastUpdated: now },
          { bloodGroup: "O-", status: "AVAILABLE", unitsAvailable: 8, lastUpdated: now },
        ],
      },
      {
        id: "bb_lion_del",
        name: "Lions Blood Bank & Diagnostic Centre",
        address: "Shivaji Enclave, Raja Garden",
        area: "Raja Garden",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110027",
        phone: "+91 11 25102000",
        operatingHours: "24 Hours / 7 Days",
        dataSource: "Lions Transfusion Committee",
        verified: true,
        isDemoData: true,
        updatedAt: twoHoursAgo,
        inventory: [
          { bloodGroup: "A+", status: "AVAILABLE", unitsAvailable: 20, lastUpdated: twoHoursAgo },
          { bloodGroup: "A-", status: "LIMITED", unitsAvailable: 2, lastUpdated: twoHoursAgo },
          { bloodGroup: "B+", status: "AVAILABLE", unitsAvailable: 28, lastUpdated: twoHoursAgo },
          { bloodGroup: "B-", status: "UNAVAILABLE", unitsAvailable: 0, lastUpdated: twoHoursAgo },
          { bloodGroup: "AB+", status: "AVAILABLE", unitsAvailable: 8, lastUpdated: twoHoursAgo },
          { bloodGroup: "AB-", status: "UNAVAILABLE", unitsAvailable: 0, lastUpdated: twoHoursAgo },
          { bloodGroup: "O+", status: "AVAILABLE", unitsAvailable: 22, lastUpdated: twoHoursAgo },
          { bloodGroup: "O-", status: "LIMITED", unitsAvailable: 1, lastUpdated: twoHoursAgo },
        ],
      },
    ],
    bloodRequests: [],
    hospitalRegistrations: [],
    auditLogs: [
      {
        id: "aud_01",
        facilityId: "fac_apollo_lko",
        facilityName: "Apollo Medics Super Speciality Hospital",
        resourceName: "ICU Beds",
        previousStatus: "LIMITED",
        newStatus: "AVAILABLE",
        previousUnits: 4,
        newUnits: 8,
        changedByUserId: "usr_staff_apollo",
        changedByName: "Nurse Priya Sharma",
        timestamp: twoHoursAgo,
        notes: "4 patients discharged from critical step-down wing.",
      },
      {
        id: "aud_02",
        facilityId: "fac_apollo_lko",
        facilityName: "Apollo Medics Super Speciality Hospital",
        resourceName: "Ventilators",
        previousStatus: "AVAILABLE",
        newStatus: "AVAILABLE",
        previousUnits: 5,
        newUnits: 6,
        changedByUserId: "usr_staff_apollo",
        changedByName: "Nurse Priya Sharma",
        timestamp: twoHoursAgo,
        notes: "Routine calibration completed on Draeger unit.",
      },
    ],
    notifications: [
      {
        id: "notif_01",
        title: "DEMO DATA: High Demand Alert for O- Negative",
        message: "O-Negative reported stock below reserve minimum across 2 facilities in Lucknow.",
        category: "ALERT",
        read: false,
        createdAt: twoHoursAgo,
      },
      {
        id: "notif_02",
        title: "Resource Audit Completed",
        message: "Apollo Medics updated ICU and ventilator availability at 11:30 AM.",
        category: "UPDATE",
        facilityId: "fac_apollo_lko",
        read: false,
        createdAt: twoHoursAgo,
      },
      {
        id: "notif_03",
        title: "Demonstration System Note",
        message: "Welcome to MediConnect National Hackathon prototype. All data is tagged DEMO DATA.",
        category: "SYSTEM",
        read: true,
        createdAt: yesterday,
      },
    ],
    passwordResetTokens: [],
  };
}

export class Database {
  private static instance: Database;
  private state: DatabaseState;

  private constructor() {
    this.ensureDataDir();
    this.state = this.loadState();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private ensureDataDir() {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadState(): DatabaseState {
    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        const state = JSON.parse(fileContent) as DatabaseState;
        return {
          ...state,
          bloodRequests: state.bloodRequests ?? [],
          hospitalRegistrations: state.hospitalRegistrations ?? [],
        };
      }
    } catch (err) {
      console.warn("Could not load database file, re-seeding default state:", err);
    }
    const seed = getInitialSeed();
    this.saveState(seed);
    return seed;
  }

  private saveState(state: DatabaseState): boolean {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(state, null, 2), "utf-8");
      return true;
    } catch (err) {
      console.error("Error writing database state to disk:", err);
      return false;
    }
  }

  // Facility APIs
  public getFacilities(): Facility[] {
    return this.state.facilities;
  }

  public getFacilityById(id: string): Facility | undefined {
    return this.state.facilities.find((f) => f.id === id);
  }

  public updateFacilityResource(
    facilityId: string,
    resourceId: string,
    updates: {
      status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE" | "UNKNOWN";
      availableUnits?: number;
      notes?: string;
    },
    user: { id: string; name: string }
  ): Facility | null {
    const facility = this.state.facilities.find((f) => f.id === facilityId);
    if (!facility) return null;

    const resource = facility.resources.find((r) => r.id === resourceId);
    if (!resource) return null;

    const prevStatus = resource.status;
    const prevUnits = resource.availableUnits;
    const now = new Date().toISOString();

    resource.status = updates.status;
    if (updates.availableUnits !== undefined) {
      resource.availableUnits = updates.availableUnits;
    }
    if (updates.notes !== undefined) {
      resource.notes = updates.notes;
    }
    resource.lastUpdated = now;
    resource.updatedByUserId = user.id;

    facility.updatedAt = now;

    // Record audit log
    const audit: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      facilityId: facility.id,
      facilityName: facility.name,
      resourceName: resource.name,
      previousStatus: prevStatus,
      newStatus: updates.status,
      previousUnits: prevUnits,
      newUnits: resource.availableUnits,
      changedByUserId: user.id,
      changedByName: user.name,
      timestamp: now,
      notes: updates.notes,
    };
    this.state.auditLogs.unshift(audit);

    // Create system notification
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: `${facility.name}: ${resource.name} Updated`,
      message: `Status changed to ${updates.status} (${resource.availableUnits ?? 0} units available) by ${user.name}.`,
      category: "UPDATE",
      facilityId: facility.id,
      read: false,
      createdAt: now,
    });

    this.saveState(this.state);
    return facility;
  }

  // Blood Bank APIs
  public getBloodBanks(): BloodBank[] {
    return this.state.bloodBanks;
  }

  public getBloodBankById(id: string): BloodBank | undefined {
    return this.state.bloodBanks.find((b) => b.id === id);
  }

  public createBloodRequest(request: {
    bloodBankId: string;
    bloodGroup: BloodGroup;
    units: number;
    neededBy: string;
    appointmentSlot: string;
    requesterName: string;
    requesterPhone: string;
    requesterEmail?: string;
    notes?: string;
  }): BloodRequest | null {
    const bank = this.getBloodBankById(request.bloodBankId);
    if (!bank || !bank.inventory.some((item) => item.bloodGroup === request.bloodGroup)) {
      return null;
    }

    const uuid = randomUUID();
    const createdAt = new Date().toISOString();
    const bloodRequest: BloodRequest = {
      ...request,
      id: uuid,
      reference: `MC-${uuid.slice(0, 8).toUpperCase()}`,
      bloodBankName: bank.name,
      status: "PENDING",
      createdAt,
    };

    this.state.bloodRequests.unshift(bloodRequest);
    if (!this.saveState(this.state)) {
      this.state.bloodRequests.shift();
      throw new Error("Unable to persist the blood request.");
    }
    return bloodRequest;
  }

  public createHospitalRegistration(registration: Omit<HospitalRegistration, "id" | "status" | "createdAt">) {
    const hospitalRegistration: HospitalRegistration = {
      ...registration,
      id: randomUUID(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    this.state.hospitalRegistrations.unshift(hospitalRegistration);
    if (!this.saveState(this.state)) {
      this.state.hospitalRegistrations.shift();
      throw new Error("Unable to persist the hospital registration.");
    }

    return hospitalRegistration;
  }

  public updateBloodInventory(
    bloodBankId: string,
    bloodGroup: string,
    updates: {
      status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE" | "UNKNOWN";
      unitsAvailable?: number;
    },
    user: { id: string; name: string }
  ): BloodBank | null {
    const bb = this.state.bloodBanks.find((b) => b.id === bloodBankId);
    if (!bb) return null;

    const item = bb.inventory.find((i) => i.bloodGroup === bloodGroup);
    if (!item) return null;

    const prevUnits = item.unitsAvailable;
    const prevStatus = item.status;
    const now = new Date().toISOString();

    item.status = updates.status;
    if (updates.unitsAvailable !== undefined) {
      item.unitsAvailable = updates.unitsAvailable;
    }
    item.lastUpdated = now;
    bb.updatedAt = now;

    // Log audit
    this.state.auditLogs.unshift({
      id: `aud_bb_${Date.now()}`,
      facilityId: bb.id,
      facilityName: bb.name,
      resourceName: `Blood Group ${bloodGroup}`,
      previousStatus: prevStatus,
      newStatus: updates.status,
      previousUnits: prevUnits,
      newUnits: item.unitsAvailable,
      changedByUserId: user.id,
      changedByName: user.name,
      timestamp: now,
      notes: `Blood inventory updated for ${bloodGroup}`,
    });

    this.saveState(this.state);
    return bb;
  }

  // Audit Logs
  public getAuditLogs(facilityId?: string): AuditLog[] {
    if (facilityId) {
      return this.state.auditLogs.filter((l) => l.facilityId === facilityId);
    }
    return this.state.auditLogs;
  }

  // Notifications
  public getNotifications(): SystemNotification[] {
    return this.state.notifications;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveState(this.state);
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(): void {
    this.state.notifications.forEach((n) => (n.read = true));
    this.saveState(this.state);
  }

  // User & Auth APIs
  public getUserByEmail(email: string): User | undefined {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  public createUser(user: User): User {
    this.state.users.push(user);
    this.saveState(this.state);
    return user;
  }

  public createPasswordResetToken(email: string, token: string, expiresAt: string): void {
    // Clear any existing tokens for this email
    this.state.passwordResetTokens = this.state.passwordResetTokens.filter(
      (t) => t.email.toLowerCase() !== email.toLowerCase()
    );
    this.state.passwordResetTokens.push({ email, token, expiresAt });
    this.saveState(this.state);
  }

  public verifyAndConsumeResetToken(token: string): string | null {
    const foundIdx = this.state.passwordResetTokens.findIndex((t) => t.token === token);
    if (foundIdx === -1) return null;

    const tokenObj = this.state.passwordResetTokens[foundIdx];
    const isExpired = new Date(tokenObj.expiresAt).getTime() < Date.now();

    // Consume token
    this.state.passwordResetTokens.splice(foundIdx, 1);
    this.saveState(this.state);

    if (isExpired) return null;
    return tokenObj.email;
  }

  public updateUserPassword(email: string, newPasswordHash: string): boolean {
    const user = this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date().toISOString();
    this.saveState(this.state);
    return true;
  }
}

export const db = Database.getInstance();
