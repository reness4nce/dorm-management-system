
import React from 'react';
import { useResidents } from '@/contexts/ResidentContext';
import { useAuth } from '@/contexts/AuthContext';
import { CheckoutStatus } from '@/types'; // Ensure CheckoutStatus is exported from '@/types'
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';

interface CheckoutFormsListProps {
  searchQuery: string;
  statusFilter: CheckoutStatus | 'all';
  onViewForm: (formId: string) => void;
}

const CheckoutFormsList = ({ searchQuery, statusFilter, onViewForm }: CheckoutFormsListProps) => {
  const { checkoutForms, residents } = useResidents();
  const { currentUser, isAdmin, isStaff } = useAuth();

  // Filter forms based on user role and current user
  const filteredForms = checkoutForms.filter((form) => {
    // For admin/staff, show all forms if no search/status filter
    if ((isAdmin || isStaff) && !searchQuery && statusFilter === 'all') {
      return true;
    }

    // For residents, only show their own forms
    if (!isAdmin && !isStaff) {
      const resident = residents.find(r => 
        r.firstName === currentUser?.firstName && 
        r.lastName === currentUser?.lastName
      );
      if (!resident || form.residentId !== resident.id) {
        return false;
      }
    }

    // Apply status filter
    if (statusFilter !== 'all' && form.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    const resident = residents.find(r => r.id === form.residentId);
    if (!resident) return false;
    
    const searchString = [
      resident.firstName,
      resident.lastName,
      resident.studentId,
      form.reason,
      resident.roomNumber
    ].join(' ').toLowerCase();
    
    return searchString.includes(searchQuery.toLowerCase());
  });

  if (filteredForms.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">
          {isAdmin || isStaff 
            ? "No checkout forms found." 
            : "You haven't submitted any checkout forms yet."}
        </p>
      </div>
    );
  }

  const getResidentName = (residentId: string) => {
    const resident = residents.find(r => r.id === residentId);
    return resident ? `${resident.firstName} ${resident.lastName}` : 'Unknown Resident';
  };

  const getResidentInfo = (residentId: string) => {
    const resident = residents.find(r => r.id === residentId);
    return resident ? `${resident.studentId} | Room ${resident.roomNumber}` : '';
  };

  return (
    <div className="space-y-4">
      {filteredForms.map((form) => (
        <Card key={form.id} className="hover:bg-accent/5 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1">
                {(isAdmin || isStaff) && (
                  <>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{getResidentName(form.residentId)}</h3>
                      <StatusBadge status={form.status === 'inProgress' ? 'in-progress' : form.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{getResidentInfo(form.residentId)}</p>
                  </>
                )}
                {!isAdmin && !isStaff && (
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Checkout Request</h3>
                    <StatusBadge status={form.status === 'inProgress' ? 'in-progress' : form.status} />
                  </div>
                )}
                <p className="text-sm">
                  <span className="font-medium">Reason:</span> {form.reason}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Intended Date:</span> {form.intendedDate} at {form.intendedTime}
                </p>
                {form.returnDate && (
                  <p className="text-sm">
                    <span className="font-medium">Return Date:</span> {form.returnDate} at {form.returnTime}
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => onViewForm(form.id)}>
                <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CheckoutFormsList;