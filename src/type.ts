// User Roles
export type UserRole = "admin" | "staff" | "resident";
export type UserRoleLabel = "Admin" | "Staff" | "Resident";

// Checkout Status
export type CheckoutStatus = 
  | "pending" 
  | "in-progress" 
  | "approved" 
  | "rejected" 
  | "completed";

// User Interface
export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  strand: string;
  gradeLevel: "11" | "12";
  contactNumber: string;
  roomNumber: string;
  checkoutStatus: CheckoutStatus;
}


// Clearance Item Interface
export interface ClearanceItem {
  id: string;
  name: string;
  isCompleted: boolean;
  completedBy?: string;
  completedDate?: string;
}

// Checkout Form Interface
export interface CheckoutForm {
  id: string;
  residentId: string;
  reason: string;
  intendedDate: string;
  intendedTime: string;
  returnDate: string;
  returnTime: string;
  submissionDate: string; 
  status: CheckoutStatus;
  clearanceItems: ClearanceItem[];
  notes?: string;
  approvedBy?: string;
  approvalDate?: string;
}
