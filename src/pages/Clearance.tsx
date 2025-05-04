
import React, { useState } from 'react';
import { useResidents } from '@/contexts/ResidentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, CheckSquare } from 'lucide-react';
import { CheckoutStatus } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClearanceList from '@/components/clearance/ClearanceList';

const Clearance = () => {
  const { checkoutForms } = useResidents();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CheckoutStatus | 'all'>('all');

  // Only include forms that are in-progress, approved or pending
  const activeForms = checkoutForms.filter(form => 
    form.status === 'in-progress' || form.status === 'approved' || form.status === 'pending'
  );

  const getStatusLabel = (status: CheckoutStatus | 'all') => {
    if (status === 'all') return 'All Statuses';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Clearance Management</h1>
        <p className="text-muted-foreground">Process checkout clearance items for residents</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">
            {activeForms.length} Active Checkout Processes
          </h2>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by resident name or room..."
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
                <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="in-progress">In Progress</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="approved">Approved</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ClearanceList 
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </div>
    </div>
  );
};

export default Clearance;