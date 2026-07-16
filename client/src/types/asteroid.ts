export interface Asteroid {
  id: number;
  nasa_id: string;
  name: string;
  diameter_km: number;
  is_potentially_hazardous: boolean;
  approach_date: string;
  miss_distance_km: number;
  relative_velocity_km_s: number;
}