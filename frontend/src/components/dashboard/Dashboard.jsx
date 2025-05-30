import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layout } from '../layout/Layout';
import { EmployeeDashboard } from './EmployeeDashboard';
import { AdminDashboard } from './AdminDashboard';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </Layout>
  );
};