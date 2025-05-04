
import { useState } from 'react'; // Removed unused 'React' import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResidentsTable from '@/components/residents/ResidentsTable';
import ResidentForm from '@/components/residents/ResidentForm';
import { useResidents } from '@/contexts/ResidentContext'; // Ensure 'useResidents' is exported from '@/contexts/ResidentContext'
import { Download, Plus, Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { CheckoutStatus, Resident } from '@/types'; // Ensure 'Resident' is exported from '@/types'



const Residents = () => {
  const { residents, addResident, updateResident, deleteResident, getResident } = useResidents();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CheckoutStatus | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResidentId, setEditingResidentId] = useState<string | null>(null);

  // Filter residents based on search and status filter
  const filteredResidents = residents.filter(resident => {
    const matchesSearch = 
      resident.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || resident.checkoutStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Student ID', 'Strand', 'Grade Level', 'Contact Number', 'Room Number', 'Checkout Status'],
      ...residents.map(resident => [
        resident.firstName,
        resident.lastName,
        resident.studentId,
        resident.strand,
        resident.gradeLevel,
        resident.contactNumber,
        resident.roomNumber,
        resident.checkoutStatus || 'none'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'residents.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (data: Omit<Resident, 'id' | 'checkoutStatus'>) => {
    if (editingResidentId) {
      const existingResident = getResident(editingResidentId);
      if (existingResident) {
        updateResident({
              ...data,
              id: editingResidentId,
              checkoutStatus: existingResident.checkoutStatus
            });
        toast.success('Resident updated successfully');
      }
    } else {
      addResident(data);
      toast.success('Resident added successfully');
    }
    setIsFormOpen(false);
    setEditingResidentId(null);
  };

  const handleEdit = (id: string) => {
    setEditingResidentId(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      deleteResident(id);
      toast.success('Resident deleted successfully');
    } catch (error) {
      toast.error('Failed to delete resident');
    }
  };

  const getStatusLabel = (status: CheckoutStatus | 'all') => {
    if (status === 'all') return 'All Statuses';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Residents</h1>
        <p className="text-muted-foreground">Manage dormitory residents</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">
            Total of {residents.length} residents
            {searchQuery || statusFilter !== 'all' ? 
              ` (${filteredResidents.length} filtered)` : ''}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2" />
              Add New Resident
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search residents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2" />
                {getStatusLabel(statusFilter)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value: CheckoutStatus | 'all') => setStatusFilter(value)}>
                <DropdownMenuRadioItem value="all">All Statuses</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="in-progress">In Progress</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="approved">Approved</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rejected">Rejected</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ResidentsTable 
          searchQuery={searchQuery} 
          statusFilter={statusFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ResidentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        resident={editingResidentId ? getResident(editingResidentId) : undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Residents;
