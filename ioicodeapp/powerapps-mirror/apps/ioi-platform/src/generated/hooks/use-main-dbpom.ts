import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBPOMService } from "../services/main-dbpom-service";
import type { MainDBPOM } from "../models/main-dbpom-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function useMainDBPOMList(o?: IOperationOptions) { return useQuery({ queryKey: ["mainDBPOM-list", o], queryFn: () => MainDBPOMService.getAll(o) }); }
export function useMainDBPOM(id: string) { return useQuery({ queryKey: ["mainDBPOM", id], queryFn: () => MainDBPOMService.get(id), enabled: !!id && UUID_REGEX.test(id) }); }
export function useCreateMainDBPOM() { const c = useQueryClient(); return useMutation({ mutationFn: (d: Omit<MainDBPOM,"id">) => MainDBPOMService.create(d), onSuccess: () => c.invalidateQueries({ queryKey: ["mainDBPOM-list"] }) }); }
export function useUpdateMainDBPOM() { const c = useQueryClient(); return useMutation({ mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<MainDBPOM,"id">> }) => MainDBPOMService.update(id, changedFields), onSuccess: (_d, v) => { c.invalidateQueries({ queryKey: ["mainDBPOM-list"] }); c.invalidateQueries({ queryKey: ["mainDBPOM", v.id] }); } }); }
export function useDeleteMainDBPOM() { const c = useQueryClient(); return useMutation({ mutationFn: (id: string) => MainDBPOMService.delete(id), onSuccess: (_d, id) => { c.invalidateQueries({ queryKey: ["mainDBPOM-list"] }); c.invalidateQueries({ queryKey: ["mainDBPOM", id] }); } }); }
