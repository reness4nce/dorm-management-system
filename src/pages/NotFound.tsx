
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dorm-background">
      <h1 className="text-6xl font-bold text-dorm-primary mb-6">404</h1>
      <p className="text-xl mb-8 text-dorm-text-secondary">The page you are looking for doesn't exist.</p>
      <Button asChild>
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
