import { useContext } from 'react';
import { RoleContext } from '../contexts/RoleContextObject';

export function useRole() {
  return useContext(RoleContext);
}
