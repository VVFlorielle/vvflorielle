import React from 'react';
import { ManagementDock } from './management/ManagementDock';
import { useStore } from '../context/StoreContext';

/**
 * Backward compatibility wrapper - Delegates directly to the clean, light-glass ManagementDock
 */
export const ManagementHeader: React.FC = () => {
  const { currentView } = useStore();
  return <ManagementDock role={currentView === 'owner' ? 'owner' : 'admin'} />;
};
