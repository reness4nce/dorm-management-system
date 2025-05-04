
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useResidents } from '@/contexts/ResidentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import CheckoutFormsList from '@/components/checkout/CheckoutFormsList';
import CheckoutFormDrawer from '@/components/checkout/CheckoutFormDrawer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';

const CheckoutForms = () => {
  const { checkoutForms, residents } = useResidents();
  const { currentUser, isAdmin, isStaff } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);

  const handleOpenForm = (formId?: string) => {
    if (formId) {
      setEditingFormId(formId);
    } else {
      setEditingFormId(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingFormId(null);
  };

  // Get resident's forms for display on the page
  const residentForms = React.useMemo(() => {
    if (!currentUser) return [];
    
    const resident = residents.find(r => 
      r.firstName === currentUser.firstName && 
      r.lastName === currentUser.lastName
    );
    
    if (!resident) return [];
    
    return checkoutForms.filter(form => form.residentId === resident.id);
  }, [checkoutForms, residents, currentUser]);

  const getResidentName = (residentId: string) => {
    const resident = residents.find(r => r.id === residentId);
    return resident ? `${resident.firstName} ${resident.lastName}` : 'Unknown Resident';
  };

  const getResidentInfo = (residentId: string) => {
    const resident = residents.find(r => r.id === residentId);
    return resident ? `${resident.studentId} | Room ${resident.roomNumber}` : '';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            {isAdmin || isStaff ? 'Checkout Forms' : 'My Checkout Requests'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin || isStaff 
              ? 'Create and manage resident checkout requests'
              : 'Submit and view your checkout requests'}
          </p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {!isAdmin && !isStaff && (
        <div className="space-y-4">
          {residentForms.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">You haven't submitted any checkout forms yet.</p>
                <p className="text-muted-foreground">Click the "New Request" button to create one.</p>
              </CardContent>
            </Card>
          ) : (
            residentForms.map((form) => (
              <Card key={form.id} className="hover:bg-accent/5 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Checkout Request</CardTitle>
                    <StatusBadge status={form.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Reason for Checkout:</p>
                      <p className="text-muted-foreground">{form.reason}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="font-medium">Checkout Date:</p>
                        <p className="text-muted-foreground">{form.intendedDate} at {form.intendedTime}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">Return Date:</p>
                        <p className="text-muted-foreground">{form.returnDate} at {form.returnTime}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium">Submitted On:</p>
                      <p className="text-muted-foreground">{form.submissionDate}</p>
                    </div>
                    
                    {form.notes && (
                      <div>
                        <p className="font-medium">Additional Notes:</p>
                        <p className="text-muted-foreground">{form.notes}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="font-medium">Clearance Items Progress:</p>
                      <ul className="list-disc ml-5 mt-1">
                        {form.clearanceItems.map((item) => (
                          <li key={item.id} className="text-sm">
                            {item.name} - {item.isCompleted ? (
                              <span className="text-green-500">Completed</span>
                            ) : (
                              <span className="text-amber-500">Pending</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {(isAdmin || isStaff) && (
        <CheckoutFormsList 
          searchQuery=""
          statusFilter="all"
          onViewForm={handleOpenForm}
        />
      )}

      <CheckoutFormDrawer 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        formId={editingFormId}
      />
    </div>
  );
};

export default CheckoutForms;