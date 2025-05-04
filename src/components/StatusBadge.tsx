import React from 'react';
import { CheckoutStatus } from '../types';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: CheckoutStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'none':
        return 'bg-gray-200 text-gray-700';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'none':
        return 'No Checkout';
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusStyles()} capitalize`}>
      {getStatusLabel()}
    </Badge>
  );
};

export default StatusBadge;