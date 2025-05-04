export interface ClearanceItem {
    id?: string;
    name: string;
    isCompleted: boolean;
  }
  
  export interface CheckoutForm {
    id?: string;
    residentId: string;
    reason: string;
    submissionDate?: string; 
    approvedBy?: string; // Added the missing property
    approvalDate?: string; // Added the missing property
    intendedDate: string;
    intendedTime: string;
    returnDate: string;
    returnTime: string;
    status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'completed';
    notes?: string;
    clearanceItems: ClearanceItem[];
  }

  export type CheckoutStatus = 'pending' | 'in-progress' | 'approved' | 'completed' | 'rejected';


  export interface ClearanceItem {
    id?: string;
    name: string;
    isCompleted: boolean;
    completedBy?: string; // Added completedBy property
  }

export type UserRole = "admin" | "staff" | "resident";

// Add your types here

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'staff' | 'resident';
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
