export interface Coordinates {
  latitude: number;
  longitude: number;
}

const APPROXIMATE_POSTAL_COORDINATES: Record<string, Coordinates> = {
  "226001": { latitude: 26.850, longitude: 80.949 },
  "226010": { latitude: 26.847, longitude: 80.946 },
  "226016": { latitude: 26.870, longitude: 80.995 },
  "226024": { latitude: 26.895, longitude: 80.939 },
  "110027": { latitude: 28.650, longitude: 77.130 },
};

export function getApproximateCoordinates(postalCode: string): Coordinates | undefined {
  return APPROXIMATE_POSTAL_COORDINATES[postalCode];
}

export function distanceInKm(from: Coordinates, to: Coordinates): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const value =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}
