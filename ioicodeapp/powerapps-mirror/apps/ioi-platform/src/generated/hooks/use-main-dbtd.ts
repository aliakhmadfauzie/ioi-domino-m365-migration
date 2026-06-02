import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainDBTDService } from "../services/main-dbtd-service";
import type { MainDBTD } from "../models/main-dbtd-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function useMainDBTDList(o?: IOperationOptions) { return useQuery({ queryKey: ["mainDBTD-list", o], queryFn: () => MainDBTDService.getAll(o) }); }
export function useMainDBTD(id: string) { return useQuery({ queryKey: ["mainDBTD", id], queryFn: () => MainDBTDService.get(id), enabled: !!id && UUID_REGEX.test(id) }); }
export function useCreateMainDBTD() { const c = useQueryClient(); return useMutation({ mutationFn: (d: Omit<MainDBTD,"id">) => MainDBTDService.create(d), onSuccess: () => c.invalidateQueries({ queryKey: ["mainDBTD-list"] }) }); }
export function useUpdateMainDBTD() { const c = useQueryClient(); return useMutation({ mutationFn: ({ id, changedFields }: { id: string; changedFields: Partial<Omit<MainDBTD,"id">> }) => MainDBTDService.update(id, changedFields), onSuccess: (_d, v) => { c.invalidateQueries({ queryKey: ["mainDBTD-list"] }); c.invalidateQueries({ queryKey: ["mainDBTD", v.id] }); } }); }
export function useDeleteMainDBTD() { const c = useQueryClient(); return useMutation({ mutationFn: (id: string) => MainDBTDService.delete(id), onSuccess: (_d, id) => { c.invalidateQueries({ queryKey: ["mainDBTD-list"] }); c.invalidateQueries({ queryKey: ["mainDBTD", id] }); } }); }
