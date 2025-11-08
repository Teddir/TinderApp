import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../api/client';
import { ApiPerson } from '../types/api';
import { Person } from '../types/person';
import { mapPersonFromApi } from '../utils/personMapper';

type FeedbackPayload = {
  personId: string;
  direction: 'like' | 'dislike';
  userIdentifier: string;
};

type PersonResponse = {
  data: ApiPerson;
};

const postFeedback = async ({
  personId,
  direction,
  userIdentifier,
}: FeedbackPayload): Promise<Person> => {
  const response = await apiFetch<PersonResponse>(
    `/api/people/${personId}/${direction}`,
    {
      method: 'POST',
      body: JSON.stringify({
        user_identifier: userIdentifier,
      }),
    },
  );

  return mapPersonFromApi(response.data);
};

export const useFeedbackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postFeedback,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['likedPeople', variables.userIdentifier],
      });
    },
  });
};

