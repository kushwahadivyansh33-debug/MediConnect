"use client";

import { useState } from "react";
import { Coordinates } from "@/lib/location";

export function useBrowserLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Location is not supported by this browser. Choose a city or area instead.");
      return;
    }

    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setLocating(false);
      },
      (geolocationError) => {
        setError(
          geolocationError.code === geolocationError.PERMISSION_DENIED
            ? "Location permission was denied. Choose a city or area instead."
            : "Could not determine your location. Choose a city or area instead.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  return { location, locating, error, requestLocation };
}
