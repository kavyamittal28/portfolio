import { useEffect, useState } from 'react';

interface GeoData {
  city: string | null;
  country: string | null;
  lat: number | null;
  lon: number | null;
  loading: boolean;
}

const STORAGE_KEY = 'kavya-visitor-geo';

interface GeoResponse {
  city: string;
  country_name: string;
  latitude: number;
  longitude: number;
}

export function useGeoGreeting(): GeoData {
  const [data, setData] = useState<GeoData>({
    city: null,
    country: null,
    lat: null,
    lon: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchGeo() {
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as GeoData;
          if (!cancelled) setData({ ...parsed, loading: false });
          return;
        }
      } catch {}

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as GeoResponse;

        const geo: GeoData = {
          city: json.city ?? null,
          country: json.country_name ?? null,
          lat: json.latitude ?? null,
          lon: json.longitude ?? null,
          loading: false,
        };

        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(geo));
        } catch {}

        if (!cancelled) setData(geo);
      } catch {
        if (!cancelled) {
          setData({ city: 'World', country: 'Earth', lat: null, lon: null, loading: false });
        }
      }
    }

    fetchGeo();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
