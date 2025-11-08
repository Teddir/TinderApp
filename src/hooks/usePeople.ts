import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api/client';
import { ApiPerson, PaginatedResponse } from '../types/api';
import { Person } from '../types/person';
import { mapPersonFromApi } from '../utils/personMapper';

export type PeopleQueryResult = {
  list: Person[];
  pagination: PaginatedResponse<ApiPerson>['meta'];
};

const fetchPeople = async (
  userIdentifier: string,
): Promise<PeopleQueryResult> => {
  const params = new URLSearchParams({
    per_page: '20',
    user_identifier: userIdentifier,
  });

  const response = await apiFetch<PaginatedResponse<ApiPerson>>(
    `/api/people?${params.toString()}`,
  );

  return {
    list: response.data.map(mapPersonFromApi),
    pagination: response.meta,
  };
};

export const usePeople = (userIdentifier?: string) =>
  useQuery<PeopleQueryResult>({
    queryKey: ['people', userIdentifier],
    queryFn: () => fetchPeople(userIdentifier!),
    enabled: Boolean(userIdentifier),
  });

