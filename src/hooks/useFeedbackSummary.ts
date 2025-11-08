import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api/client';

export type FeedbackSummary = {
  likesCount: number;
  passedCount: number;
  remainingCount: number;
};

type SummaryResponse = {
  data: {
    likes_count: number;
    passed_count: number;
    remaining_count: number;
  };
};

const fetchSummary = async (userIdentifier: string): Promise<FeedbackSummary> => {
  const params = new URLSearchParams({ user_identifier: userIdentifier });
  const response = await apiFetch<SummaryResponse>(
    `/api/people/summary?${params.toString()}`,
  );

  return {
    likesCount: response.data.likes_count,
    passedCount: response.data.passed_count,
    remainingCount: response.data.remaining_count,
  };
};

export const useFeedbackSummary = (userIdentifier?: string) =>
  useQuery<FeedbackSummary>({
    queryKey: ['feedbackSummary', userIdentifier],
    queryFn: () => fetchSummary(userIdentifier!),
    enabled: Boolean(userIdentifier),
  });

