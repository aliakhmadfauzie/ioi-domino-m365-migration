import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBADMINService } from "../services/main-dbadmin-service";
import type { MainDBADMIN } from "../models/main-dbadmin-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function useMainDBADMINList(o?: IOperationOptions) { return useQuery({ queryKey: ["mainDBADMIN-list", o], queryFn: () => MainDBADMINService.getAll(o) }); }
export function useMainDBADMIN(id: string) { return useQuery({ queryKey: ["mainDBADMIN", id], queryFn: () => MainDBADMINService.get(id), enabled: !!id && UUID_REGEX.test(id) }); }
export function useCreateMainDBADMIN() { const c = useQueryClient(); return useMutation({ mutationFn: (d: Omit<MainDBADMIN,"id">) => MainDBADMINService.create(d), onSuccess: () => c.invalidateQueries({ queryKey: ["mainDBADMIN-list"] }) }); }
export function useUpdateMainDBADMIN() { const c = useQueryClient(); return useMutation({ mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<MainDBADMIN,"id">> }) => MainDBADMINService.update(id, changedFields), onSuccess: (_d, v) => { c.invalidateQueries({ queryKey: ["mainDBADMIN-list"] }); c.invalidateQueries({ queryKey: ["mainDBADMIN", v.id] }); } }); }
export function useDeleteMainDBADMIN() { const c = useQueryClient(); return useMutation({ mutationFn: (id: string) => MainDBADMINService.delete(id), onSuccess: (_d, id) => { c.invalidateQueries({ queryKey: ["mainDBADMIN-list"] }); c.invalidateQueries({ queryKey: ["mainDBADMIN", id] }); } }); }
