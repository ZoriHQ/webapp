/**
 * Maps ISO 3166-1 alpha-2 country codes to approximate geographic coordinates
 * Uses capital cities or geographic centers for marker placement on globe
 */

export interface CountryCoordinate {
  lat: number
  lng: number
  name: string
}

const COUNTRY_COORDINATES: Record<string, CountryCoordinate> = {
  // North America
  US: { lat: 37.0902, lng: -95.7129, name: 'United States' },
  CA: { lat: 56.1304, lng: -106.3468, name: 'Canada' },
  MX: { lat: 23.6345, lng: -102.5528, name: 'Mexico' },

  // Europe
  GB: { lat: 51.5074, lng: -0.1278, name: 'United Kingdom' },
  DE: { lat: 51.1657, lng: 10.4515, name: 'Germany' },
  FR: { lat: 46.2276, lng: 2.2137, name: 'France' },
  ES: { lat: 40.4637, lng: -3.7492, name: 'Spain' },
  IT: { lat: 41.8719, lng: 12.5674, name: 'Italy' },
  NL: { lat: 52.1326, lng: 5.2913, name: 'Netherlands' },
  SE: { lat: 60.1282, lng: 18.6435, name: 'Sweden' },
  NO: { lat: 60.472, lng: 8.4689, name: 'Norway' },
  DK: { lat: 56.2639, lng: 9.5018, name: 'Denmark' },
  FI: { lat: 61.9241, lng: 25.7482, name: 'Finland' },
  PL: { lat: 51.9194, lng: 19.1451, name: 'Poland' },
  CH: { lat: 46.8182, lng: 8.2275, name: 'Switzerland' },
  AT: { lat: 47.5162, lng: 14.5501, name: 'Austria' },
  BE: { lat: 50.5039, lng: 4.4699, name: 'Belgium' },
  IE: { lat: 53.4129, lng: -8.2439, name: 'Ireland' },
  PT: { lat: 39.3999, lng: -8.2245, name: 'Portugal' },
  GR: { lat: 39.0742, lng: 21.8243, name: 'Greece' },
  CZ: { lat: 49.8175, lng: 15.473, name: 'Czech Republic' },
  RO: { lat: 45.9432, lng: 24.9668, name: 'Romania' },
  HU: { lat: 47.1625, lng: 19.5033, name: 'Hungary' },
  BG: { lat: 42.7339, lng: 25.4858, name: 'Bulgaria' },
  HR: { lat: 45.1, lng: 15.2, name: 'Croatia' },
  SK: { lat: 48.669, lng: 19.699, name: 'Slovakia' },
  SI: { lat: 46.1512, lng: 14.9955, name: 'Slovenia' },
  LT: { lat: 55.1694, lng: 23.8813, name: 'Lithuania' },
  LV: { lat: 56.8796, lng: 24.6032, name: 'Latvia' },
  EE: { lat: 58.5953, lng: 25.0136, name: 'Estonia' },
  RS: { lat: 44.0165, lng: 21.0059, name: 'Serbia' },
  UA: { lat: 48.3794, lng: 31.1656, name: 'Ukraine' },
  RU: { lat: 61.524, lng: 105.3188, name: 'Russia' },

  // Asia
  CN: { lat: 35.8617, lng: 104.1954, name: 'China' },
  JP: { lat: 36.2048, lng: 138.2529, name: 'Japan' },
  IN: { lat: 20.5937, lng: 78.9629, name: 'India' },
  KR: { lat: 35.9078, lng: 127.7669, name: 'South Korea' },
  SG: { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  HK: { lat: 22.3193, lng: 114.1694, name: 'Hong Kong' },
  TW: { lat: 23.6978, lng: 120.9605, name: 'Taiwan' },
  TH: { lat: 15.87, lng: 100.9925, name: 'Thailand' },
  MY: { lat: 4.2105, lng: 101.9758, name: 'Malaysia' },
  ID: { lat: -0.7893, lng: 113.9213, name: 'Indonesia' },
  PH: { lat: 12.8797, lng: 121.774, name: 'Philippines' },
  VN: { lat: 14.0583, lng: 108.2772, name: 'Vietnam' },
  PK: { lat: 30.3753, lng: 69.3451, name: 'Pakistan' },
  BD: { lat: 23.685, lng: 90.3563, name: 'Bangladesh' },
  TR: { lat: 38.9637, lng: 35.2433, name: 'Turkey' },
  IL: { lat: 31.0461, lng: 34.8516, name: 'Israel' },
  SA: { lat: 23.8859, lng: 45.0792, name: 'Saudi Arabia' },
  AE: { lat: 23.4241, lng: 53.8478, name: 'United Arab Emirates' },
  KW: { lat: 29.3117, lng: 47.4818, name: 'Kuwait' },
  QA: { lat: 25.3548, lng: 51.1839, name: 'Qatar' },

  // Oceania
  AU: { lat: -25.2744, lng: 133.7751, name: 'Australia' },
  NZ: { lat: -40.9006, lng: 174.886, name: 'New Zealand' },

  // South America
  BR: { lat: -14.235, lng: -51.9253, name: 'Brazil' },
  AR: { lat: -38.4161, lng: -63.6167, name: 'Argentina' },
  CL: { lat: -35.6751, lng: -71.543, name: 'Chile' },
  CO: { lat: 4.5709, lng: -74.2973, name: 'Colombia' },
  PE: { lat: -9.19, lng: -75.0152, name: 'Peru' },
  VE: { lat: 6.4238, lng: -66.5897, name: 'Venezuela' },
  EC: { lat: -1.8312, lng: -78.1834, name: 'Ecuador' },
  UY: { lat: -32.5228, lng: -55.7658, name: 'Uruguay' },
  PY: { lat: -23.4425, lng: -58.4438, name: 'Paraguay' },

  // Africa
  ZA: { lat: -30.5595, lng: 22.9375, name: 'South Africa' },
  EG: { lat: 26.8206, lng: 30.8025, name: 'Egypt' },
  NG: { lat: 9.082, lng: 8.6753, name: 'Nigeria' },
  KE: { lat: -0.0236, lng: 37.9062, name: 'Kenya' },
  MA: { lat: 31.7917, lng: -7.0926, name: 'Morocco' },
  GH: { lat: 7.9465, lng: -1.0232, name: 'Ghana' },
  TN: { lat: 33.8869, lng: 9.5375, name: 'Tunisia' },
  ET: { lat: 9.145, lng: 40.4897, name: 'Ethiopia' },
  TZ: { lat: -6.369, lng: 34.8888, name: 'Tanzania' },
  UG: { lat: 1.3733, lng: 32.2903, name: 'Uganda' },

  // Central America & Caribbean
  CR: { lat: 9.7489, lng: -83.7534, name: 'Costa Rica' },
  PA: { lat: 8.538, lng: -80.7821, name: 'Panama' },
  GT: { lat: 15.7835, lng: -90.2308, name: 'Guatemala' },
  DO: { lat: 18.7357, lng: -70.1627, name: 'Dominican Republic' },
  CU: { lat: 21.5218, lng: -77.7812, name: 'Cuba' },
  JM: { lat: 18.1096, lng: -77.2975, name: 'Jamaica' },
  TT: { lat: 10.6918, lng: -61.2225, name: 'Trinidad and Tobago' },
}

/**
 * Get coordinates for a country code
 * @param countryCode ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB')
 * @returns Country coordinates or null if not found
 */
export function getCountryCoordinates(
  countryCode: string,
): CountryCoordinate | null {
  const code = countryCode.toUpperCase()
  return COUNTRY_COORDINATES[code]
}

/**
 * Get all country coordinates as an array
 * @returns Array of all countries with their coordinates
 */
export function getAllCountryCoordinates(): Array<{
  code: string
  coordinates: CountryCoordinate
}> {
  return Object.entries(COUNTRY_COORDINATES).map(([code, coordinates]) => ({
    code,
    coordinates,
  }))
}

/**
 * Check if a country code has coordinates available
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns True if coordinates are available
 */
export function hasCountryCoordinates(countryCode: string): boolean {
  return !!getCountryCoordinates(countryCode)
}
