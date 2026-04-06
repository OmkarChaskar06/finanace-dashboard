import { useContext } from 'react';
import { DataContext } from '../contexts/DataContextObject';

export function useData() {
  return useContext(DataContext);
}
