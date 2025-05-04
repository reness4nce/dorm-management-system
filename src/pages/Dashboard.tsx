
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useResidents } from '../contexts/ResidentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '../components/StatusBadge';
import { CheckoutStatus } from '../types';

const Dashboard = () => {
  const { currentUser, isAdmin, isStaff, isResident } = useAuth();
  const { residents, checkoutForms } = useResidents();

  // Calculate dashboard stats
  const totalResidents = residents.length;
  const pendingForms = checkoutForms.filter(form => form.status === 'pending').length;
  const inProgressForms = checkoutForms.filter(form => form.status === 'in-progress').length;
  const approvedForms = checkoutForms.filter(form => form.status === 'approved').length;
  const completedForms = checkoutForms.filter(form => form.status === 'completed').length;

  // Calculate status counts for each checkout status
  const statusCounts = {
    'none': residents.filter(resident => resident.checkoutStatus === 'none').length,
    'pending': residents.filter(resident => resident.checkoutStatus === 'pending').length,
    'in-progress': residents.filter(resident => resident.checkoutStatus === 'in-progress').length,
    'approved': residents.filter(resident => resident.checkoutStatus === 'approved').length,
    'rejected': residents.filter(resident => resident.checkoutStatus === 'rejected').length,
    'completed': residents.filter(resident => resident.checkoutStatus === 'completed').length,
  };

  // Get resident specific data if the user is a resident
  const residentId = isResident ? 
    residents.find(r => r.firstName === currentUser?.firstName && r.lastName === currentUser?.lastName)?.id : 
    undefined;

  const residentForms = residentId ? 
    checkoutForms.filter(form => form.residentId === residentId) : 
    [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-dorm-text-secondary">Welcome back, {currentUser?.firstName}!</p>
      </div>

      {/* Admin/Staff view */}
      {(isAdmin || isStaff) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">Total Residents</CardTitle>
                <CardDescription>Current dormitory residents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-dorm-primary">{totalResidents}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">Pending Forms</CardTitle>
                <CardDescription>Awaiting initial review</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-500">{pendingForms}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">In Progress</CardTitle>
                <CardDescription>Currently being processed</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-500">{inProgressForms}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">Completed</CardTitle>
                <CardDescription>Successfully checked out</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-500">{completedForms}</p>
              </CardContent>
            </Card>
          </div>

          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Resident Status Breakdown</CardTitle>
              <CardDescription>Current status of all dormitory residents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-3 border rounded-md">
                    <StatusBadge status={status as CheckoutStatus} />
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Forms */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Checkout Forms</CardTitle>
              <CardDescription>Latest checkout requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checkoutForms.slice(0, 5).map(form => {
                  const resident = residents.find(r => r.id === form.residentId);
                  return (
                    <div key={form.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{resident?.firstName} {resident?.lastName}</p>
                        <p className="text-sm text-dorm-text-secondary">
                          Room: {resident?.roomNumber} • Submitted: {form.submissionDate}
                        </p>
                      </div>
                      <StatusBadge status={form.status} />
                    </div>
                  );
                })}
                {checkoutForms.length === 0 && (
                  <p className="text-center text-dorm-text-secondary py-4">No forms submitted yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Resident specific view */}
      {isResident && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Checkout Status</CardTitle>
              <CardDescription>Current status of your checkout request</CardDescription>
            </CardHeader>
            <CardContent>
              {residentId ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="text-lg mb-4">Your current status:</div>
                    <StatusBadge 
                      status={residents.find(r => r.id === residentId)?.checkoutStatus || 'none'} 
                    />
                  </div>
                  {residentForms[0] && (
                    <div className="space-y-2">
                      <p><span className="font-medium">Intended Checkout:</span> {residentForms[0].intendedDate} at {residentForms[0].intendedTime}</p>
                      <p><span className="font-medium">Return:</span> {residentForms[0].returnDate} at {residentForms[0].returnTime}</p>
                      {residentForms[0].notes && (
                        <p><span className="font-medium">Notes:</span> {residentForms[0].notes}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Submitted on: {residentForms[0].submissionDate}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-dorm-text-secondary py-4">Status not available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;