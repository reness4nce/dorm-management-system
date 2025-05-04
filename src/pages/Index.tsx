
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, Users, FileText, ClipboardCheck, Settings } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dorm-primary to-dorm-secondary text-white">
      {/* Header/Navigation */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">ALGCIT DORM</h1>
        </div>
        <div>
          <Link to="/login">
            <Button variant="outline" className="text-white border-white hover:bg-white/20">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-[fade-in_1s_ease-out]">
            Dormitory Management System
          </h1>
          <p className="text-xl mb-8 max-w-md opacity-90 animate-[fade-in_1.2s_ease-out]">
            Streamline your dormitory operations with our comprehensive management system designed for administrators, staff, and residents.
          </p>
          <Link to="/login">
            <Button className="bg-white text-dorm-primary hover:bg-white/90 animate-[fade-in_1.4s_ease-out] group">
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center animate-[scale-in_1s_ease-out]">
          <div className="relative w-full max-w-lg aspect-video">
            <div className="absolute inset-0 bg-dorm-building bg-cover bg-center rounded-lg shadow-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-dorm-secondary/80 to-transparent rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-white/5">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: "Dashboard", 
              description: "Get a comprehensive overview of dormitory operations with our intuitive dashboard.", 
              icon: <Home className="h-8 w-8 text-white" />
            },
            { 
              title: "Resident Management", 
              description: "Easily manage resident information, room assignments, and history.", 
              icon: <Users className="h-8 w-8 text-white" />
            },
            { 
              title: "Checkout Forms", 
              description: "Streamline the checkout process with digital forms and tracking.", 
              icon: <FileText className="h-8 w-8 text-white" />
            },
            { 
              title: "Clearance Management", 
              description: "Manage and track clearance requirements and approvals efficiently.", 
              icon: <ClipboardCheck className="h-8 w-8 text-white" />
            },
            { 
              title: "Reporting", 
              description: "Generate comprehensive reports on occupancy, checkouts, and more.", 
              icon: <FileText className="h-8 w-8 text-white" />
            },
            { 
              title: "System Settings", 
              description: "Configure system settings to match your dormitory's specific needs.", 
              icon: <Settings className="h-8 w-8 text-white" />
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/10 p-6 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="bg-gradient-to-br from-dorm-primary to-dorm-secondary p-3 rounded-full inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="opacity-90">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-10 mt-auto">
        <div className="border-t border-white/20 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} ALGCIT Dormitory Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
