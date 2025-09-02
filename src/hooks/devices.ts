/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/devices.ts
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listDevices, getDevice, renameDevice } from '@/lib/api/devices';
import { useDispatch } from 'react-redux';
import { upsertMany, setDetail } from '@/store/devicesSlice';
import { qk } from '@/lib/api/queryKeys';
import { useToast } from '@/hooks/use-toast';
import { Device, DeviceDetail } from '@/lib/mockData';

function getErrMsg(e: unknown): string {
  if (!e) return 'Unknown error';
  if (typeof e === 'string') return e;
  const anyErr = e as any;
  return anyErr?.message || anyErr?.data?.message || 'Unexpected error occurred';
}

export function useDevicesQuery() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const result = useQuery<Device[]>({
    queryKey: qk.devices,
    queryFn: listDevices,
    refetchInterval: 3000,
    placeholderData: (prev) => prev, // keep old list during refetch
  });

  // Store in Redux on success
  useEffect(() => {
    if (result.data) dispatch(upsertMany(result.data));
  }, [result.data, dispatch]);

  // Toast on error (guarded to avoid spam while fetching)
  useEffect(() => {
    if (result.isError && !result.isFetching && result.error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load devices',
        description: getErrMsg(result.error),
      });
    }
  }, [result.isError, result.isFetching, result.error, toast]);

  return result;
}

export function useDeviceQuery(id: string) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const result = useQuery<DeviceDetail>({
    queryKey: qk.device(id),
    queryFn: () => getDevice(id),
    enabled: !!id,
    refetchInterval: 2000,
    placeholderData: (prev) => prev, // keep previous detail during refetch
  });

  // Store in Redux on success
  useEffect(() => {
    if (result.data) dispatch(setDetail(result.data));
  }, [result.data, dispatch]);

  // Toast on error
  useEffect(() => {
    if (result.isError && !result.isFetching && result.error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load device',
        description: getErrMsg(result.error),
      });
    }
  }, [result.isError, result.isFetching, result.error, toast]);

  return result;
}

export function useRenameDevice(id: string) {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (name: string) => renameDevice(id, name),
    onSuccess: async () => {
      toast({
        title: 'Device renamed',
        description: 'The device display name was updated successfully.',
      });
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.devices }),
        qc.invalidateQueries({ queryKey: qk.device(id) }),
      ]);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Rename failed',
        description: getErrMsg(error),
      });
    },
  });
}
