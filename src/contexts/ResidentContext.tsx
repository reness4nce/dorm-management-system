import React, { createContext, useState, useEffect } from 'react';
import { Resident, CheckoutForm, CheckoutStatus } from '../types';
import { toast } from 'sonner';

// eslint-disable-next-line react-refresh/only-export-components
export const useResidents = () => {
  const context = React.useContext(ResidentContext);
  if (!context) {
    throw new Error('useResidents must be used within a ResidentProvider');
  }
  return context;
};

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Function to generate sample residents data
const generateSampleResidents = (count: number = 150): Resident[] => {
  const firstNames = ['John', 'Mary', 'James', 'Patricia', 'Robert', 'Jennifer'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis'];
  const strands = ['Instrumentation', 'Mechatronics', 'Machining'];
  const gradeLevels: Array<"11" | "12"> = ["11", "12"];
  const checkoutStatuses: CheckoutStatus[] = ['pending', 'in-progress', 'approved', 'completed', 'rejected'];
  const roomPrefixes = ['A', 'B', 'C', 'D', 'E'];

  const residents: Resident[] = [];
  const originalResidents: Resident[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      studentId: 'S12345',
      strand: 'Instrumentation',
      gradeLevel: '11',
      contactNumber: '09123456789',
      roomNumber: 'A101',
      checkoutStatus: 'in-progress'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      studentId: 'S67890',
      strand: 'Mechatronics',
      gradeLevel: '12',
      contactNumber: '09876543210',
      roomNumber: 'B202',
      checkoutStatus: 'pending'
    }
  ];

  residents.push(...originalResidents);

  for (let i = 6; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const strand = strands[Math.floor(Math.random() * strands.length)];
    const gradeLevel = gradeLevels[Math.floor(Math.random() * gradeLevels.length)];
    const roomPrefix = roomPrefixes[Math.floor(Math.random() * roomPrefixes.length)];
    const roomNumber = `${roomPrefix}${Math.floor(Math.random() * 4) + 1}${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')}`;
    const checkoutStatus = checkoutStatuses[Math.floor(Math.random() * checkoutStatuses.length)];

    const studentId = `S${String(i).padStart(5, '0')}`;
    const contactNumber = `09${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;

    residents.push({
      id: i.toString(),
      firstName,
      lastName,
      studentId,
      strand,
      gradeLevel,
      contactNumber,
      roomNumber,
      checkoutStatus
    });
  }
  return residents;
};

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

const ResidentContext = createContext<ResidentContextType | undefined>(undefined);

export const ResidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [checkoutForms, setCheckoutForms] = useState<CheckoutForm[]>([]);

  useEffect(() => {
    const savedResidents = localStorage.getItem('dormResidents');
    const savedForms = localStorage.getItem('dormCheckoutForms');

    if (savedResidents) {
      setResidents(JSON.parse(savedResidents));
    } else {
      setResidents(generateSampleResidents());
    }

    if (savedForms) {
      setCheckoutForms(JSON.parse(savedForms));
    } else {
      setCheckoutForms([]);
    }
  }, []);

  useEffect(() => {
    if (residents.length > 0) {
      localStorage.setItem('dormResidents', JSON.stringify(residents));
    }
  }, [residents]);

  useEffect(() => {
    if (checkoutForms.length > 0) {
      localStorage.setItem('dormCheckoutForms', JSON.stringify(checkoutForms));
    }
  }, [checkoutForms]);

  const addResident = (resident: Omit<Resident, 'id' | 'checkoutStatus'>) => {
    const newResident: Resident = {
      ...resident,
      id: generateId(),
      checkoutStatus: 'in-progress'
    };

    setResidents(prev => [...prev, newResident]);
    toast.success(`Added resident: ${resident.firstName} ${resident.lastName}`);
  };

  const updateResident = (resident: Resident) => {
    setResidents(prev => prev.map(r => (r.id === resident.id ? resident : r)));
    toast.success(`Updated resident: ${resident.firstName} ${resident.lastName}`);
  };

  const deleteResident = (id: string) => {
    const resident = residents.find(r => r.id === id);
    const hasCheckoutForms = checkoutForms.some(form => form.residentId === id);

    if (hasCheckoutForms) {
      toast.error('Cannot delete resident with active checkout forms');
      return;
    }

    setResidents(prev => prev.filter(r => r.id !== id));
    if (resident) {
      toast.success(`Deleted resident: ${resident.firstName} ${resident.lastName}`);
    }
  };

  const getResident = (id: string) => residents.find(r => r.id === id);

  const getResidentByStudentId = (studentId: string) => 
    residents.find(r => r.studentId === studentId);

  const addCheckoutForm = (form: Omit<CheckoutForm, 'id' | 'submissionDate'>) => {
    const newForm: CheckoutForm = {
      ...form,
      id: generateId(),
      submissionDate: new Date().toISOString().split('T')[0]
    };

    setCheckoutForms(prev => [...prev, newForm]);
    updateResidentCheckoutStatus(form.residentId, 'in-progress');
    toast.success('Checkout form submitted successfully');
  };

  const updateCheckoutForm = (form: CheckoutForm) => {
    setCheckoutForms(prev => prev.map(f => (f.id === form.id ? form : f)));
    updateResidentCheckoutStatus(form.residentId, form.status);
    toast.success('Checkout form updated successfully');
  };

  const deleteCheckoutForm = (id: string) => {
    const form = checkoutForms.find(f => f.id === id);
    if (!form) return;

    if (form.status !== 'pending' && form.status !== 'rejected') {
      toast.error('Cannot delete forms that are in progress, approved, or completed');
      return;
    }

    setCheckoutForms(prev => prev.filter(f => f.id !== id));
    const residentForms = checkoutForms.filter(f => 
      f.residentId === form.residentId && f.id !== id
    );
    
    if (residentForms.length === 0) {
      updateResidentCheckoutStatus(form.residentId, 'pending');
    }
    
    toast.success('Checkout form deleted successfully');
  };

  const getCheckoutForm = (id: string) => checkoutForms.find(f => f.id === id);

  const getCheckoutFormsByResident = (residentId: string) => 
    checkoutForms.filter(f => f.residentId === residentId);

  const updateCheckoutStatus = (formId: string, status: CheckoutStatus, approver?: string) => {
    const form = checkoutForms.find(f => f.id === formId);
    if (!form) return;

    const updatedForm: CheckoutForm = {
      ...form,
      status,
      approvedBy: (status === 'approved' || status === 'completed' || status === 'in-progress') 
      ? approver || form.approvedBy 
      : undefined,
      approvalDate: (status === 'approved' || status === 'completed' || status === 'in-progress') 
      ? form.approvalDate || new Date().toISOString().split('T')[0] 
      : undefined,
    };

    setCheckoutForms(prev => 
      prev.map(f => (f.id === formId ? updatedForm : f))
    );

    updateResidentCheckoutStatus(form.residentId, status);
    toast.success(`Checkout status updated to ${status}`);
  };

  const updateClearanceItem = (formId: string, itemId: string, isCompleted: boolean, completedBy?: string) => {
    const form = checkoutForms.find(f => f.id === formId);
    if (!form) return;

    const updatedItems = form.clearanceItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          isCompleted,
          ...(isCompleted 
            ? { 
                completedBy: completedBy || item.completedBy, 
                completedDate: new Date().toISOString().split('T')[0] 
              } 
            : { completedBy: undefined, completedDate: undefined })
        };
      }
      return item;
    });

    const allCompleted = updatedItems.every(item => item.isCompleted);

    const updatedForm: CheckoutForm = {
      ...form,
      clearanceItems: updatedItems,
      status: allCompleted && form.status === 'in-progress' ? 'approved' : form.status
    };

    setCheckoutForms(prev => 
      prev.map(f => (f.id === formId ? updatedForm : f))
    );

    if (allCompleted && form.status === 'in-progress') {
      updateResidentCheckoutStatus(form.residentId, 'approved');
      toast.success('All clearance items have been completed. The form is now approved.');
    } else {
      toast.success('Clearance item status updated successfully.');
    }
  };

  const updateResidentCheckoutStatus = (residentId: string, status: CheckoutStatus) => {
    setResidents(prev => 
      prev.map(r => {
        if (r.id === residentId) {
          return { ...r, checkoutStatus: status };
        }
        return r;
      })
    );
  };

  const value = {
    residents,
    checkoutForms,
    addResident,
    updateResident,
    deleteResident,
    getResident,
    getResidentByStudentId,
    addCheckoutForm,
    updateCheckoutForm,
    deleteCheckoutForm,
    getCheckoutForm,
    getCheckoutFormsByResident,
    updateCheckoutStatus,
    updateClearanceItem
  };

  return <ResidentContext.Provider value={value}>{children}</ResidentContext.Provider>;
};
