
import React, { useState } from 'react';
import { useResidents } from '@/contexts/ResidentContext';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from '../StatusBadge';
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckoutStatus } from '@/types';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ResidentsTableProps {
  searchQuery: string;
  statusFilter: CheckoutStatus | 'all';
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ResidentsTable = ({ searchQuery, statusFilter, onEdit, onDelete }: ResidentsTableProps) => {
  const { residents } = useResidents();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = 
      resident.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || resident.checkoutStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResidents = filteredResidents.slice(startIndex, startIndex + itemsPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        pageNumbers.push('ellipsis1');
      }
      
      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('ellipsis2');
      }
      
      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RESIDENT</TableHead>
            <TableHead>ROOM</TableHead>
            <TableHead>GRADE LEVEL</TableHead>
            <TableHead>CONTACT INFO</TableHead>
            <TableHead>CHECK-OUT STATUS</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No residents found matching your filters.
              </TableCell>
            </TableRow>
          ) : (
            paginatedResidents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {resident.firstName} {resident.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {resident.studentId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {resident.roomNumber}
                </TableCell>
                <TableCell>
                  {resident.gradeLevel === "11" ? "Grade 11" : "Grade 12"}
                  <div className="text-sm text-muted-foreground">
                    {resident.strand}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {resident.contactNumber}
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {`${resident.firstName.toLowerCase()}.${resident.lastName.toLowerCase()}@my.xu.edu.ph`}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={resident.checkoutStatus || 'none'} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(resident.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(resident.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Enhanced Pagination controls using shadcn/ui Pagination component */}
      {filteredResidents.length > 0 && (
        <div className="border-t p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredResidents.length)} of {filteredResidents.length} residents
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {getPageNumbers().map((pageNumber, index) => (
                <PaginationItem key={`page-${index}`}>
                  {pageNumber === 'ellipsis1' || pageNumber === 'ellipsis2' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(Number(pageNumber))}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ResidentsTable;