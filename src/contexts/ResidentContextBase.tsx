import { createContext } from 'react';
import { Resident, CheckoutForm, CheckoutStatus } from '../types';

interface ResidentContextType {
  residents: Resident[];
  checkoutForms: CheckoutForm[];
  addResident: (resident: Omit<Resident, 'id' | 'checkoutStatus'>) => void;
  updateResident: (resident: Resident) => void;
  deleteResident: (id: string) => void;
  getResident: (id: string) => Resident | undefined;
  getResidentByStudentId: (studentId: string) => Resident | undefined;
  addCheckoutForm: (form: Omit<CheckoutForm, 'id' | 'submissionDate'>) => void;
  updateCheckoutForm: (form: CheckoutForm) => void;
  deleteCheckoutForm: (id: string) => void;
  getCheckoutForm: (id: string) => CheckoutForm | undefined;
  getCheckoutFormsByResident: (residentId: string) => CheckoutForm[];
  updateCheckoutStatus: (formId: string, status: CheckoutStatus, approver?: string) => void;
  updateClearanceItem: (formId: string, itemId: string, isCompleted: boolean, completedBy?: string) => void;
}

export const ResidentContext = createContext<ResidentContextType>({
  residents: [],
  checkoutForms: [],
  addResident: () => {},
  updateResident: () => {},
  deleteResident: () => {},
  getResident: () => undefined,
  getResidentByStudentId: () => undefined,
  addCheckoutForm: () => {},
  updateCheckoutForm: () => {},
  deleteCheckoutForm: () => {},
  getCheckoutForm: () => undefined,
  getCheckoutFormsByResident: () => [],
  updateCheckoutStatus: () => {},
  updateClearanceItem: () => {}
});