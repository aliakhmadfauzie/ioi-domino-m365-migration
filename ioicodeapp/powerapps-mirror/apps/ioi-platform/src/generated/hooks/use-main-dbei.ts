import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBEIService } from "../services/main-dbei-service";
import type { MainDBEI } from "../models/main-dbei-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function useMainDBEIList(o?: IOperationOptions) { return useQuery({ queryKey: ["mainDBEI-list", o], queryFn: () => MainDBEIService.getAll(o) }); }
export function useMainDBEI(id: string) { return useQuery({ queryKey: ["mainDBEI", id], queryFn: () => MainDBEIService.get(id), enabled: !!id && UUID_REGEX.test(id) }); }
export function useCreateMainDBEI() { const c = useQueryClient(); return useMutation({ mutationFn: (d: Omit<MainDBEI,"id">) => MainDBEIService.create(d), onSuccess: () => c.invalidateQueries({ queryKey: ["mainDBEI-list"] }) }); }
export function useUpdateMainDBEI() { const c = useQueryClient(); return useMutation({ mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<MainDBEI,"id">> }) => MainDBEIService.update(id, changedFields), onSuccess: (_d, v) => { c.invalidateQueries({ queryKey: ["mainDBEI-list"] }); c.invalidateQueries({ queryKey: ["mainDBEI", v.id] }); } }); }
export function useDeleteMainDBEI() { const c = useQueryClient(); return useMutation({ mutationFn: (id: string) => MainDBEIService.delete(id), onSuccess: (_d, id) => { c.invalidateQueries({ queryKey: ["mainDBEI-list"] }); c.invalidateQueries({ queryKey: ["mainDBEI", id] }); } }); }
