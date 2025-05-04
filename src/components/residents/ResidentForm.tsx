
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Resident } from '@/types';
import { User } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  studentId: z.string().min(4, 'Student ID must be at least 4 characters'),
  strand: z.string().min(2, 'Strand must be at least 2 characters'),
  gradeLevel: z.enum(['11', '12']),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 characters'),
  roomNumber: z.string().min(2, 'Room number must be at least 2 characters'),
});

type ResidentFormData = z.infer<typeof formSchema>;

interface ResidentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resident?: Resident;
  onSubmit: (data: ResidentFormData) => void;
}

const ResidentForm: React.FC<ResidentFormProps> = ({
  open,
  onOpenChange,
  resident,
  onSubmit,
}) => {
  const { toast } = useToast();
  const form = useForm<ResidentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: resident || {
      firstName: '',
      lastName: '',
      studentId: '',
      strand: '',
      gradeLevel: '11',
      contactNumber: '',
      roomNumber: '',
    },
  });

  // Reset form when resident prop changes
  useEffect(() => {
    if (open) {
      form.reset(resident || {
        firstName: '',
        lastName: '',
        studentId: '',
        strand: '',
        gradeLevel: '11',
        contactNumber: '',
        roomNumber: '',
      });
    }
  }, [resident, open, form]);

  const handleSubmit = (data: ResidentFormData) => {
    onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {resident ? 'Edit' : 'Add New'} Resident
          </DialogTitle>
          <DialogDescription>
            {resident 
              ? `Editing information for ${resident.firstName} ${resident.lastName}` 
              : 'Fill in the details to add a new resident'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="strand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strand</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select strand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Instrumentation">Instrumentation</SelectItem>
                            <SelectItem value="Mechatronics">Mechatronics</SelectItem>
                            <SelectItem value="Machining">Machining</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="11">Grade 11</SelectItem>
                          <SelectItem value="12">Grade 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {resident ? 'Update' : 'Add'} Resident
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResidentForm;
