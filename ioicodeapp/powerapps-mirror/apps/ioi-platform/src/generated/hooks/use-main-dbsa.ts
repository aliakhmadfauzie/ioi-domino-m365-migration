import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBSAService } from "../services/main-dbsa-service";
import type { MainDBSA } from "../models/main-dbsa-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function useMainDBSAList(o?: IOperationOptions) { return useQuery({ queryKey: ["mainDBSA-list", o], queryFn: () => MainDBSAService.getAll(o) }); }
export function useMainDBSA(id: string) { return useQuery({ queryKey: ["mainDBSA", id], queryFn: () => MainDBSAService.get(id), enabled: !!id && UUID_REGEX.test(id) }); }
export function useCreateMainDBSA() { const c = useQueryClient(); return useMutation({ mutationFn: (d: Omit<MainDBSA,"id">) => MainDBSAService.create(d), onSuccess: () => c.invalidateQueries({ queryKey: ["mainDBSA-list"] }) }); }
export function useUpdateMainDBSA() { const c = useQueryClient(); return useMutation({ mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<MainDBSA,"id">> }) => MainDBSAService.update(id, changedFields), onSuccess: (_d, v) => { c.invalidateQueries({ queryKey: ["mainDBSA-list"] }); c.invalidateQueries({ queryKey: ["mainDBSA", v.id] }); } }); }
export function useDeleteMainDBSA() { const c = useQueryClient(); return useMutation({ mutationFn: (id: string) => MainDBSAService.delete(id), onSuccess: (_d, id) => { c.invalidateQueries({ queryKey: ["mainDBSA-list"] }); c.invalidateQueries({ queryKey: ["mainDBSA", id] }); } }); }
