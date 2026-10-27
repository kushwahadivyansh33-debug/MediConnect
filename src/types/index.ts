export type ResourceStatus = "AVAILABLE" | "LIMITED" | "UNAVAILABLE" | "UNKNOWN";
export type UserRole = "ADMIN" | "FACILITY_STAFF" | "VIEWER";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  facilityId?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  name: string;
  type: "HOSPITAL" | "CLINIC" | "TRAUMA_CENTER";
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  website?: string;
  image?: string;
  distanceKm?: number;
  latitude?: number;
  longitude?: number;
  totalBeds: number;
  dataSource: string;
  verified: boolean;
  isDemoData: boolean;
  updatedAt: string;
  resources: HospitalResource[];
}

export interface HospitalResource {
  id: string;
  facilityId: string;
  category: "BEDS" | "EQUIPMENT" | "DIAGNOSTICS" | "SPECIALTY";
  name: string; // e.g. "ICU Beds", "Ventilators", "Oxygen Beds", "X-Ray", "CT Scan", "ECG", "NICU"
  status: ResourceStatus;
  availableUnits?: number;
  totalUnits?: number;
  lastUpdated: string;
  updatedByUserId?: string;
  notes?: string;
}

export interface BloodInventoryItem {
  bloodGroup: BloodGroup;
  status: ResourceStatus;
  unitsAvailable?: number;
  lastUpdated: string;
}

export interface BloodBank {
  id: string;
  name: string;
  hospitalName?: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  operatingHours: string;
  dataSource: string;
  verified: boolean;
  isDemoData: boolean;
  updatedAt: string;
  inventory: BloodInventoryItem[];
}

export interface AuditLog {
  id: string;
  facilityId: string;
  facilityName: string;
  resourceName: string;
  previousStatus?: string;
  newStatus: string;
  previousUnits?: number;
  newUnits?: number;
  changedByUserId: string;
  changedByName: string;
  timestamp: string;
  notes?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  category: "ALERT" | "UPDATE" | "SYSTEM";
  facilityId?: string;
  targetRole?: UserRole;
  read: boolean;
  createdAt: string;
}

export interface PasswordResetToken {
  token: string;
  email: string;
  expiresAt: string;
}
