import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResidents } from '@/contexts/ResidentContext';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ChecklistForm from './ChecklistForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type definitions to match the context
interface ClearanceItem {
  id?: string;
  name: string;
  isCompleted: boolean;
}

interface CheckoutForm {
  id?: string;
  residentId: string;
  reason: string;
  intendedDate: string; // Kept as string for API/storage format
  intendedTime: string;
  returnDate: string; // Kept as string for API/storage format
  returnTime: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  clearanceItems: ClearanceItem[];
}

// Form schema
const formSchema = z.object({
  residentId: z.string().min(1, { message: 'Resident name is required' }),
  reason: z.string().min(5, { message: 'Reason must be at least 5 characters' }),
  intendedDate: z.date({
    required_error: "Intended checkout date is required",
  }),
  intendedTime: z.string().min(1, { message: 'Intended time is required' }),
  returnDate: z.date({
    required_error: "Return date is required",
  }),
  returnTime: z.string().min(1, { message: 'Return time is required' }),
  notes: z.string().optional(),
  clearanceItems: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Clearance item name is required' }),
    isCompleted: z.boolean().default(false)
  }))
}).refine((data) => {
  // Validate that return date is not before intended date
  return data.returnDate >= data.intendedDate;
}, {
  message: "Return date cannot be before intended checkout date",
  path: ["returnDate"]
});

type FormValues = z.infer<typeof formSchema>;

interface CheckoutFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string | null;
}

const DEFAULT_CLEARANCE_ITEMS: ClearanceItem[] = [
  { name: 'Room inspection', isCompleted: false },
  { name: 'Return keys', isCompleted: false },
  { name: 'Settle outstanding bills', isCompleted: false }
];

const CheckoutFormDrawer = ({ open, onOpenChange, formId }: CheckoutFormDrawerProps) => {
  const { residents, addCheckoutForm, updateCheckoutForm, getCheckoutForm } = useResidents();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      residentId: '',
      reason: '',
      intendedDate: new Date(),
      intendedTime: '08:00',
      returnDate: new Date(),
      returnTime: '17:00',
      notes: '',
      clearanceItems: DEFAULT_CLEARANCE_ITEMS
    }
  });

  const isEditing = !!formId;

  useEffect(() => {
    if (open) {
      if (formId) {
        const checkoutForm = getCheckoutForm(formId);
        if (checkoutForm) {
          try {
            form.reset({
              residentId: checkoutForm.residentId,
              reason: checkoutForm.reason,
              intendedDate: checkoutForm.intendedDate ? new Date(checkoutForm.intendedDate) : new Date(),
              intendedTime: checkoutForm.intendedTime || '08:00',
              returnDate: checkoutForm.returnDate ? new Date(checkoutForm.returnDate) : new Date(),
              returnTime: checkoutForm.returnTime || '17:00',
              notes: checkoutForm.notes || '',
              clearanceItems: checkoutForm.clearanceItems && checkoutForm.clearanceItems.length > 0 ? 
                checkoutForm.clearanceItems.map((item: ClearanceItem) => ({
                  id: item.id,
                  name: item.name,
                  isCompleted: item.isCompleted
                })) : 
                DEFAULT_CLEARANCE_ITEMS
            });
          } catch (error) {
            console.error('Error setting form values:', error);
            toast.error('Error loading checkout form data');
          }
        }
      } else {
        // Reset form when opening a new form
        form.reset({
          residentId: '',
          reason: '',
          intendedDate: new Date(),
          intendedTime: '08:00',
          returnDate: new Date(),
          returnTime: '17:00',
          notes: '',
          clearanceItems: DEFAULT_CLEARANCE_ITEMS
        });
      }
    }
  }, [formId, open, getCheckoutForm, form]);

  const onSubmit = (data: FormValues) => {
    try {
      // Validate dates
      // The zod refine validation should catch this, but double-check here
      const returnDate = new Date(data.returnDate);
      const intendedDate = new Date(data.intendedDate);
      if (returnDate < intendedDate) {
        form.setError("returnDate", {
          type: "manual",
          message: "Return date cannot be before intended checkout date"
        });
        return;
      }

      const formattedIntendedDate = format(data.intendedDate, 'yyyy-MM-dd');
      const formattedReturnDate = format(data.returnDate, 'yyyy-MM-dd');
      
      if (isEditing && formId) {
        const existingForm = getCheckoutForm(formId);
        if (existingForm) {
          updateCheckoutForm({
            ...existingForm,
            residentId: data.residentId,
            reason: data.reason,
            intendedDate: formattedIntendedDate,
            intendedTime: data.intendedTime,
            returnDate: formattedReturnDate,
            returnTime: data.returnTime,
            notes: data.notes,
            clearanceItems: data.clearanceItems.map((item, index) => ({
              id: item.id || `${formId}-${index}`,
              name: item.name,
              isCompleted: item.isCompleted
            }))
          });
          toast.success('Checkout form updated successfully');
        }
      } else {
        const newFormData: Omit<CheckoutForm, 'id'> = {
          residentId: data.residentId,
          reason: data.reason,
          intendedDate: formattedIntendedDate,
          intendedTime: data.intendedTime,
          returnDate: formattedReturnDate,
          returnTime: data.returnTime,
          status: 'pending',
          notes: data.notes,
          clearanceItems: data.clearanceItems.map((item, index) => ({
            id: `new-${index}-${Date.now()}`,
            name: item.name,
            isCompleted: false
          }))
        };
        
        addCheckoutForm(newFormData);
        toast.success('Checkout form submitted successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('An error occurred while saving the form');
      console.error('Form submission error:', error);
    }
  };

  const availableResidents = residents?.filter(resident => {
    if (isEditing && form.watch('residentId') === resident.id) return true;
    return resident.checkoutStatus === 'none' || resident.checkoutStatus === 'rejected';
  }) || [];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] max-h-[90vh]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-auto px-4 py-6">
            <DrawerHeader>
              <DrawerTitle>{isEditing ? 'Edit Checkout Form' : 'New Checkout Request'}</DrawerTitle>
              <DrawerDescription>
                {isEditing 
                  ? 'Update the checkout form details below.' 
                  : 'Fill out the form below to submit a checkout request. Upon approval of your check-out application, you will be given a GATE PASS to be presented at the main gate of the Manresa Farm Complex during exit from the farm premises.'}
              </DrawerDescription>
            </DrawerHeader>

            <div className="space-y-4 px-1">
              <FormField
                control={form.control}
                name="residentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resident Name</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isEditing}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a resident" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableResidents.length > 0 ? (
                            availableResidents.map((resident) => (
                              <SelectItem key={resident.id} value={resident.id}>
                                {resident.firstName} {resident.lastName} ({resident.roomNumber})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-residents" disabled>
                              No eligible residents found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Checkout</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a reason for checkout"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="intendedDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Intended Checkout Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                "outline w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intendedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intended Checkout Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          placeholder="Enter time (HH:MM)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="returnDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => {
                              const intendedDate = form.getValues('intendedDate');
                              return intendedDate && date < intendedDate;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="returnTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          placeholder="Enter time (HH:MM)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Pass the form to ChecklistForm component */}
      {typeof ChecklistForm === 'function' && <ChecklistForm form={form} />}
            </div>

            <DrawerFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? 'Update Form' : 'Submit Request'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default CheckoutFormDrawer;