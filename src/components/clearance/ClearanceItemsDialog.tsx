
import React from 'react'; // React import is required for JSX
import { useResidents } from '@/contexts/ResidentContext';
import { CheckoutForm } from '@/types';
import { Button } from '@/components/ui/button';
import { Check, CheckSquare, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ClearanceItemsDialogProps {
  form: CheckoutForm;
  onClose: () => void;
  onUpdateItem: (formId: string, itemId: string, isCompleted: boolean) => void;
  onUpdateStatus: (formId: string, status: CheckoutForm) => void;
}

const ClearanceItemsDialog = ({
  form,
  onClose,
  onUpdateItem,
  onUpdateStatus
}: ClearanceItemsDialogProps) => {
  const { residents } = useResidents();
  
  const resident = residents.find(r => r.id === form.residentId);
  const allItemsCompleted = form.clearanceItems.every(item => item.isCompleted);
  
  const handleToggleItem = (itemId: string, isCompleted: boolean) => {
    onUpdateItem(form.id, itemId, isCompleted);
  };

  const canApprove = form.status === 'inProgress' && allItemsCompleted; // Ensure 'inProgress' is part of CheckoutStatus
  
  return (
    <Dialog open={!!form} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Clearance Items</DialogTitle>
          <DialogDescription>
            {resident ? `${resident.firstName} ${resident.lastName} - Room ${resident.roomNumber}` : ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div>
            <p className="text-sm font-medium mb-1">Checkout Status</p>
            <Badge className={`
              ${form.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-300' : ''}
              ${form.status === 'inProgress' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''} // Ensure 'inProgress' is valid
              ${form.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' : ''}
              ${form.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' : ''}
              ${form.status === 'completed' ? 'bg-purple-100 text-purple-800 border-purple-300' : ''} // Ensure 'completed' is valid
            `}>
              {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <p className="text-sm font-medium">Required Clearance Items</p>
            {form.clearanceItems.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  item.isCompleted ? 'bg-green-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.isCompleted}
                      onCheckedChange={(checked) => handleToggleItem(item.id, !!checked)}
                      disabled={form.status !== 'inProgress'} // Ensure 'inProgress' is valid
                      className={`${
                        item.isCompleted ? 'border-green-500 bg-green-500' : ''
                      } h-5 w-5 rounded transition-all`}
                    />
                    {item.isCompleted && (
                      <CheckCircle2 
                        className="absolute -right-1 -top-1 h-3 w-3 text-green-500 stroke-[3]" 
                      />
                    )}
                  </div>
                  <label
                    htmlFor={`item-${item.id}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      item.isCompleted ? 'text-green-700' : ''
                    }`}
                  >
                    {item.name}
                  </label>
                </div>
                {item.isCompleted && item.completedBy && ( // Ensure completedBy exists in ClearanceItem
                  <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded">
                    by {item.completedBy} // Ensure completedBy exists in ClearanceItem
                  </span>
                )}
              </div>
            ))}
            
            {form.clearanceItems.length === 0 && (
              <p className="text-sm text-muted-foreground">No clearance items defined.</p>
            )}
          </div>
          
          {canApprove && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">
              <div className="flex items-center">
                <CheckSquare className="mr-2 h-4 w-4" />
                <p>All clearance items have been completed. This form can now be approved.</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button type="button" className="outline">
              Close
            </Button>
          </DialogClose>
          
          {form.status === 'inProgress' && allItemsCompleted && ( // Ensure 'inProgress' is valid
            <Button 
              type="button"
              onClick={() => {
                onUpdateStatus(form.id, { ...form, status: 'approved' });
                onClose();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Approve Checkout
            </Button>
          )}
          
          {form.status === 'approved' && (
            <Button 
              type="button"
              onClick={() => {
                onUpdateStatus(form.id, { ...form, status: 'completed' });
                onClose();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Complete Checkout
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearanceItemsDialog;