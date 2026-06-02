import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBITExtSupportService } from "../services/main-dbit-ext-support-service";
import type { MainDBITExtSupport } from "../models/main-dbit-ext-support-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

export function useMainDBITExtSupportList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["mainDBITExtSupport-list", options],
    queryFn: () => MainDBITExtSupportService.getAll(options),
  });
}

export function useCreateMainDBITExtSupport() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBITExtSupport, "id">) =>
      MainDBITExtSupportService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["mainDBITExtSupport-list"] });
    },
  });
}
