import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBSECService } from "../services/main-dbsec-service";
import type { MainDBSEC } from "../models/main-dbsec-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function useMainDBSECList(o?: IOperationOptions) { return useQuery({ queryKey: ["mainDBSEC-list", o], queryFn: () => MainDBSECService.getAll(o) }); }
export function useMainDBSEC(id: string) { return useQuery({ queryKey: ["mainDBSEC", id], queryFn: () => MainDBSECService.get(id), enabled: !!id && UUID_REGEX.test(id) }); }
export function useCreateMainDBSEC() { const c = useQueryClient(); return useMutation({ mutationFn: (d: Omit<MainDBSEC,"id">) => MainDBSECService.create(d), onSuccess: () => c.invalidateQueries({ queryKey: ["mainDBSEC-list"] }) }); }
export function useUpdateMainDBSEC() { const c = useQueryClient(); return useMutation({ mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<MainDBSEC,"id">> }) => MainDBSECService.update(id, changedFields), onSuccess: (_d, v) => { c.invalidateQueries({ queryKey: ["mainDBSEC-list"] }); c.invalidateQueries({ queryKey: ["mainDBSEC", v.id] }); } }); }
export function useDeleteMainDBSEC() { const c = useQueryClient(); return useMutation({ mutationFn: (id: string) => MainDBSECService.delete(id), onSuccess: (_d, id) => { c.invalidateQueries({ queryKey: ["mainDBSEC-list"] }); c.invalidateQueries({ queryKey: ["mainDBSEC", id] }); } }); }
