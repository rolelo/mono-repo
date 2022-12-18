import React from 'react';
import { useLocation } from 'react-router-dom';

export function useQueryString() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default useQueryString;