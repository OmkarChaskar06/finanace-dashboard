import React, { useState } from 'react';
import { RoleContext } from './contexts/RoleContextObject';

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('viewer'); // 'viewer' or 'admin'

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
