// Configuration for NASA APIs and other services
export const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY"

export const API_ENDPOINTS = {
  NASA_EARTH_IMAGERY: "https://api.nasa.gov/planetary/earth/imagery",
  NASA_EARTH_ASSETS: "https://api.nasa.gov/planetary/earth/assets",
  NASA_APOD: "https://api.nasa.gov/planetary/apod",
  NASA_NEO: "https://api.nasa.gov/neo/rest/v1",
  EARTHDATA: "https://earthdata.nasa.gov/api",
  MODIS: "https://modis.gsfc.nasa.gov/data",
  LANDSAT: "https://earthexplorer.usgs.gov/api",
  COPERNICUS: "https://dataspace.copernicus.eu/api",
}

export const SATELLITE_CONFIGS = {
  MODIS_TERRA: {
    name: "MODIS Terra",
    orbit: "sun-synchronous",
    altitude: 705, // km
    instruments: ["MODIS", "ASTER", "CERES", "MISR", "MOPITT"],
  },
  MODIS_AQUA: {
    name: "MODIS Aqua",
    orbit: "sun-synchronous",
    altitude: 705, // km
    instruments: ["MODIS", "AIRS", "AMSU-A", "CERES", "HSB"],
  },
  LANDSAT_9: {
    name: "Landsat 9",
    orbit: "sun-synchronous",
    altitude: 705, // km
    instruments: ["OLI-2", "TIRS-2"],
  },
  SUOMI_NPP: {
    name: "Suomi NPP",
    orbit: "sun-synchronous",
    altitude: 824, // km
    instruments: ["VIIRS", "CrIS", "ATMS", "OMPS", "CERES"],
  },
}
