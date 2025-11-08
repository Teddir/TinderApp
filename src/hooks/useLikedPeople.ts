import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api/client';
import { ApiPerson, PaginatedResponse } from '../types/api';
import { mapPersonFromApi } from '../utils/personMapper';
import { Person } from '../types/person';

export type LikedPeopleResult = {
  list: Person[];
  pagination: PaginatedResponse<ApiPerson>['meta'];
};

const fetchLikedPeople = async (
  userIdentifier: string,
): Promise<LikedPeopleResult> => {
  const params = new URLSearchParams({
    per_page: '50',
    user_identifier: userIdentifier,
  });

  const response = await apiFetch<PaginatedResponse<ApiPerson>>(
    `/api/people/liked?${params.toString()}`,
  );

  return {
    list: response.data.map(mapPersonFromApi),
    pagination: response.meta,
  };
};

export const useLikedPeople = (userIdentifier?: string) =>
  useQuery<LikedPeopleResult>({
    queryKey: ['likedPeople', userIdentifier],
    queryFn: () => fetchLikedPeople(userIdentifier!),
    enabled: Boolean(userIdentifier),
  });

