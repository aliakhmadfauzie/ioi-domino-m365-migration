import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBPRCService } from "../services/main-dbprc-service";
import type { MainDBPRC } from "../models/main-dbprc-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function useMainDBPRCList(o?: IOperationOptions) { return useQuery({ queryKey: ["mainDBPRC-list", o], queryFn: () => MainDBPRCService.getAll(o) }); }
export function useMainDBPRC(id: string) { return useQuery({ queryKey: ["mainDBPRC", id], queryFn: () => MainDBPRCService.get(id), enabled: !!id && UUID_REGEX.test(id) }); }
export function useCreateMainDBPRC() { const c = useQueryClient(); return useMutation({ mutationFn: (d: Omit<MainDBPRC,"id">) => MainDBPRCService.create(d), onSuccess: () => c.invalidateQueries({ queryKey: ["mainDBPRC-list"] }) }); }
export function useUpdateMainDBPRC() { const c = useQueryClient(); return useMutation({ mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<MainDBPRC,"id">> }) => MainDBPRCService.update(id, changedFields), onSuccess: (_d, v) => { c.invalidateQueries({ queryKey: ["mainDBPRC-list"] }); c.invalidateQueries({ queryKey: ["mainDBPRC", v.id] }); } }); }
export function useDeleteMainDBPRC() { const c = useQueryClient(); return useMutation({ mutationFn: (id: string) => MainDBPRCService.delete(id), onSuccess: (_d, id) => { c.invalidateQueries({ queryKey: ["mainDBPRC-list"] }); c.invalidateQueries({ queryKey: ["mainDBPRC", id] }); } }); }
