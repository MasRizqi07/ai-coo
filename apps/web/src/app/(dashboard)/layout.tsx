import * as React from 'react';
import { getMeAction } from '../actions/auth';
import { DashboardShell } from './dashboard-shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userProfile = await getMeAction();

  return <DashboardShell userProfile={userProfile}>{children}</DashboardShell>;
}
