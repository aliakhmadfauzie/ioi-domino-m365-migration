import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBWHService } from "../services/main-dbwh-service";
import type { MainDBWH } from "../models/main-dbwh-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function useMainDBWHList(options?: IOperationOptions) {
  return useQuery({ queryKey: ["mainDBWH-list", options], queryFn: () => MainDBWHService.getAll(options) });
}

export function useMainDBWH(id: string) {
  return useQuery({ queryKey: ["mainDBWH", id], queryFn: () => MainDBWHService.get(id), enabled: !!id && UUID_REGEX.test(id) });
}

export function useCreateMainDBWH() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MainDBWH, "id">) => MainDBWHService.create(data),
    onSuccess: () => client.invalidateQueries({ queryKey: ["mainDBWH-list"] }),
  });
}

export function useUpdateMainDBWH() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<MainDBWH, "id">> }) => MainDBWHService.update(id, changedFields),
    onSuccess: (_data, variables) => { client.invalidateQueries({ queryKey: ["mainDBWH-list"] }); client.invalidateQueries({ queryKey: ["mainDBWH", variables.id] }); },
  });
}

export function useDeleteMainDBWH() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => MainDBWHService.delete(id),
    onSuccess: (_data, id) => { client.invalidateQueries({ queryKey: ["mainDBWH-list"] }); client.invalidateQueries({ queryKey: ["mainDBWH", id] }); },
  });
}
