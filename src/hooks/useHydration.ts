/**
 * @file useHydration.ts
 * @description 处理SSR hydration的工具hook
 */

import { useState, useEffect } from "react";

export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
