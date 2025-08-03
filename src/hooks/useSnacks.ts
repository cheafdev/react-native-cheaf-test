import { useQuery } from '@tanstack/react-query';

import { fakeApi } from '../api/fakeApi';

export function useSnacks(searchTerm?: string) {
  return useQuery({
    queryKey: ['snacks', searchTerm],
    queryFn: () => fakeApi.listSnacks({ search: searchTerm }),
  });
}

