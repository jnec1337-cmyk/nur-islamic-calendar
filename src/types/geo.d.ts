declare module "world-atlas/countries-110m.json" {
  const value: {
    objects: { countries: unknown };
  };
  export default value;
}

declare module "topojson-client" {
  export function feature(topology: unknown, object: unknown): unknown;
}

declare module "d3-geo" {
  export type GeoPermissibleObjects = object;
  export interface GeoProjection {
    (point: [number, number]): [number, number] | null;
    invert(point: [number, number]): [number, number] | null;
    fitExtent(extent: [[number, number], [number, number]], object: GeoPermissibleObjects): this;
    rotate(rotation: [number, number, number]): this;
    scale(k: number): this;
    translate(point: [number, number]): this;
    clipAngle(angle: number): this;
  }
  export function geoMercator(): GeoProjection;
  export function geoOrthographic(): GeoProjection;
  export function geoPath(projection: GeoProjection): (object: GeoPermissibleObjects) => string | null;
  export function geoGraticule(): {
    step(step: [number, number]): { (): GeoPermissibleObjects };
  };
}
