import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IOIEmployeeDirectoryService } from "../services/ioi-employee-directory-service";
import type { IOIEmployeeDirectory } from "../models/ioi-employee-directory-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

export function useIOIEmployeeDirectoryList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["ioiEmployeeDirectory-list", options],
    queryFn: () => IOIEmployeeDirectoryService.getAll(options),
  });
}

export function useIOIEmployeeDirectory(id: string) {
  return useQuery({
    queryKey: ["ioiEmployeeDirectory", id],
    queryFn: () => IOIEmployeeDirectoryService.get(id),
    enabled: !!id && !isNaN(Number(id)),
  });
}

export function useCreateIOIEmployeeDirectory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<IOIEmployeeDirectory, "id">) => IOIEmployeeDirectoryService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["ioiEmployeeDirectory-list"] });
    },
  });
}

export function useUpdateIOIEmployeeDirectory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<IOIEmployeeDirectory, "id">>;
    }) => IOIEmployeeDirectoryService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["ioiEmployeeDirectory-list"] });
      client.invalidateQueries({ queryKey: ["ioiEmployeeDirectory", variables.id] });
    },
  });
}

export function useDeleteIOIEmployeeDirectory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => IOIEmployeeDirectoryService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["ioiEmployeeDirectory-list"] });
      client.invalidateQueries({ queryKey: ["ioiEmployeeDirectory", id] });
    },
  });
}

export const IOIEmployeeDirectory_DATA_SOURCE_TYPE = 'SharePoint' as const;
