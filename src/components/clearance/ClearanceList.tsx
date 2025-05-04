
import React, { useState } from 'react';
import { useResidents } from '@/contexts/ResidentContext';
import { useAuth } from '@/contexts/AuthContext';
import { CheckoutStatus, CheckoutForm } from '@/types';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import ClearanceItemsDialog from './ClearanceItemsDialog';
import { CheckSquare, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";

interface ClearanceListProps {
  searchQuery: string;
  statusFilter: CheckoutStatus | 'all';
}

const ClearanceList = ({ searchQuery, statusFilter }: ClearanceListProps) => {
  const { checkoutForms, residents, updateCheckoutStatus, updateClearanceItem } = useResidents();
  const { currentUser } = useAuth();
  const [activeClearanceForm, setActiveClearanceForm] = useState<CheckoutForm | null>(null);
  
  const filteredForms = checkoutForms.filter((form) => {
    // Exclude completed and rejected forms
    if (form.status === 'completed' || form.status === 'rejected') return false;
    
    // Apply status filter
    if (statusFilter !== 'all' && form.status !== statusFilter) return false;
    
    // Apply search query
    const resident = residents.find(r => r.id === form.residentId);
    if (!resident) return false;
    
    const searchString = [
      resident.firstName,
      resident.lastName,
      resident.studentId,
      resident.roomNumber,
    ].join(' ').toLowerCase();
    
    return searchQuery.length === 0 || searchString.includes(searchQuery.toLowerCase());
  });

  const handleStatusUpdate = (formId: string, newStatus: CheckoutStatus) => {
    if (!currentUser) return;
    
    updateCheckoutStatus(formId, newStatus, `${currentUser.firstName} ${currentUser.lastName}`);
    
    if (newStatus === 'in-progress') {
      toast.success('Form is now in progress. Process the clearance items to continue.');
    } else if (newStatus === 'approved') {
      toast.success('Form has been approved. The resident can now proceed with checkout.');
    } else if (newStatus === 'rejected') {
      toast.error('Form has been rejected.');
    } else if (newStatus === 'completed') {
      toast.success('Checkout process has been completed successfully.');
    }
  };

  const handleClearanceItemUpdate = (formId: string, itemId: string, isCompleted: boolean) => {
    if (!currentUser) return;
    
    updateClearanceItem(
      formId, 
      itemId, 
      isCompleted, 
      isCompleted ? `${currentUser.firstName} ${currentUser.lastName}` : undefined
    );
  };

  const calculateProgress = (form: CheckoutForm) => {
    if (form.clearanceItems.length === 0) return 0;
    const completedItems = form.clearanceItems.filter(item => item.isCompleted).length;
    return (completedItems / form.clearanceItems.length) * 100;
  };

  if (filteredForms.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No active clearance processes found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredForms.map((form) => {
          const resident = residents.find(r => r.id === form.residentId);
          const progress = calculateProgress(form);
          
          return (
            <Card key={form.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      {resident ? `${resident.firstName} ${resident.lastName}` : 'Unknown Resident'}
                    </CardTitle>
                    <CardDescription>
                      {resident ? `Room ${resident.roomNumber} | ${resident.strand} | Grade ${resident.gradeLevel}` : ''}
                    </CardDescription>
                  </div>
                  <StatusBadge status={form.status.replace('inProgress', 'in-progress') as CheckoutStatus} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Checkout progress</p>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {form.clearanceItems.filter(item => item.isCompleted).length} of {form.clearanceItems.length} items completed
                    </p>
                  </div>
                  
                  <div className="text-sm">
                    <p><span className="font-medium">Intended Date:</span> {form.intendedDate}</p>
                    <p>{form.intendedDate ? new Date(form.intendedDate).toLocaleDateString() : 'N/A'}</p>
                    <p className="line-clamp-2"><span className="font-medium">Reason:</span> {form.reason}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setActiveClearanceForm(form)}
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Manage Clearance
                </Button>
                
                {form.status === 'pending' && (
                  <Button 
                    onClick={() => handleStatusUpdate(form.id, 'in-progress')}
                    variant="default"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Start Process
                  </Button>
                )}
                
                {form.status === 'approved' && (
                  <Button 
                    onClick={() => handleStatusUpdate(form.id, 'completed')}
                    variant="default"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Complete Checkout
                  </Button>
                )}
                
                {(form.status === 'pending' || form.status === 'inProgress') && (
                  <Button 
                    onClick={() => handleStatusUpdate(form.id, 'rejected')}
                    variant="destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {activeClearanceForm && (
        <ClearanceItemsDialog
          form={activeClearanceForm}
          onClose={() => setActiveClearanceForm(null)}
          onUpdateItem={handleClearanceItemUpdate}
          onUpdateStatus={(formId, form) => handleStatusUpdate(formId, form.status.replace('inProgress', 'in-progress') as CheckoutStatus)}
        />
      )}
    </>
  );
};

export default ClearanceList;