import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainDBITExtPolicyService } from '../services/main-dbit-ext-policy-service';
import type { MainDBITExtPolicy } from '../models/main-dbit-ext-policy-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const QUERY_KEY = 'MainDBITExtPolicy';

export function useMainDBITExtPolicyList(options?: IOperationOptions) {
  return useQuery({
    queryKey: [QUERY_KEY, 'list', options],
    queryFn: () => MainDBITExtPolicyService.getList(options),
  });
}

export function useMainDBITExtPolicyById(id: number, options?: IOperationOptions) {
  return useQuery({
    queryKey: [QUERY_KEY, 'byId', id, options],
    queryFn: () => MainDBITExtPolicyService.getById(id, options),
  });
}

export function useCreateMainDBITExtPolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtPolicy, 'id'>) => MainDBITExtPolicyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateMainDBITExtPolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MainDBITExtPolicy> }) =>
      MainDBITExtPolicyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
