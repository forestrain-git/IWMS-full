import { useEffect, useMemo } from "react";
import { useGlobalStore, useMockDataStore } from "@/store";
import { generateStations } from "@/lib/mockGenerators";
import type { Station } from "../types/station";

/**
 * 统一获取模块2所需的站点数据并提供筛选、选中逻辑
 */
export function useStationData(
  searchQuery: string,
  selectedStatuses: string[]
) {
  const globalStations = useMockDataStore((s) => s.stations);
  const selectedStationId = useGlobalStore((s) => s.selectedStationId);

  const stations: Station[] = useMemo(() => {
    const stationData = (
      (globalStations.length > 0 ? globalStations : generateStations(20)) as Station[]
    ).map((s) => ({
      ...s,
      qrCodeUrl: s.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        `https://example.com/station/${s.id}`
      )}`,
    }));
    
    console.log("useStationData - globalStations length:", globalStations.length);
    console.log("useStationData - final stations length:", stationData.length);
    console.log("useStationData - sample station:", stationData[0]);
    
    return stationData;
  }, [globalStations]);

  const filtered = useMemo(() => {
    return stations.filter((station) => {
      const matchesSearch =
        searchQuery === "" ||
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(station.status);
      return matchesSearch && matchesStatus;
    });
  }, [stations, searchQuery, selectedStatuses]);

  const selectedStation = useMemo(() => {
    return (
      stations.find((s) => s.id === selectedStationId) || null
    ) as Station | null;
  }, [stations, selectedStationId]);

  return { stations: filtered, selectedStation };
}
