import { geoGraticule, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { tx } from "@/lib/i18n";
import { KAABA } from "@/lib/prayer";
import { useNur } from "@/lib/store";

const land = feature(world, world.objects.countries) as GeoPermissibleObjects;

type LngLat = [number, number];
type Quat = [number, number, number, number];
type Vec3 = [number, number, number];
type Angles = [number, number, number];

const RAD = Math.PI / 180;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function sphere(lat: number, lng: number): Vec3 {
  const φ = lat * RAD;
  const λ = lng * RAD;
  return [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)];
}

function greatCircle(lat: number, lng: number, steps = 96): LngLat[] {
  const va = sphere(lat, lng);
  const vb = sphere(KAABA.lat, KAABA.lng);
  const dot = clamp(va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2], -1, 1);
  const omega = Math.acos(dot);
  const coords: LngLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let x = va[0];
    let y = va[1];
    let z = va[2];
    if (omega >= 1e-4) {
      const s = Math.sin(omega);
      const p = Math.sin((1 - t) * omega) / s;
      const q = Math.sin(t * omega) / s;
      x = va[0] * p + vb[0] * q;
      y = va[1] * p + vb[1] * q;
      z = va[2] * p + vb[2] * q;
    }
    coords.push([(Math.atan2(y, x) * 180) / Math.PI, (Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI]);
  }
  return coords;
}

function fromAngles([l, p, g]: Angles): Quat {
  l *= RAD / 2;
  p *= RAD / 2;
  g *= RAD / 2;
  const sl = Math.sin(l);
  const cl = Math.cos(l);
  const sp = Math.sin(p);
  const cp = Math.cos(p);
  const sg = Math.sin(g);
  const cg = Math.cos(g);
  return [
    cl * cp * cg + sl * sp * sg,
    sl * cp * cg - cl * sp * sg,
    cl * sp * cg + sl * cp * sg,
    cl * cp * sg - sl * sp * cg,
  ];
}

function toAngles([a, b, c, d]: Quat): Angles {
  return [
    (Math.atan2(2 * (a * b + c * d), 1 - 2 * (b * b + c * c)) * 180) / Math.PI,
    (Math.asin(clamp(2 * (a * c - d * b), -1, 1)) * 180) / Math.PI,
    (Math.atan2(2 * (a * d + b * c), 1 - 2 * (c * c + d * d)) * 180) / Math.PI,
  ];
}

function multiply([a1, b1, c1, d1]: Quat, [a2, b2, c2, d2]: Quat): Quat {
  return [
    a1 * a2 - b1 * b2 - c1 * c2 - d1 * d2,
    a1 * b2 + b1 * a2 + c1 * d2 - d1 * c2,
    a1 * c2 - b1 * d2 + c1 * a2 + d1 * b2,
    a1 * d2 + b1 * c2 - c1 * b2 + d1 * a2,
  ];
}

function cartesian([lon, lat]: LngLat): Vec3 {
  const l = lon * RAD;
  const p = lat * RAD;
  const cp = Math.cos(p);
  return [cp * Math.cos(l), cp * Math.sin(l), Math.sin(p)];
}

function delta(v0: Vec3, v1: Vec3): Quat {
  const w: Vec3 = [
    v0[1] * v1[2] - v0[2] * v1[1],
    v0[2] * v1[0] - v0[0] * v1[2],
    v0[0] * v1[1] - v0[1] * v1[0],
  ];
  const l = Math.hypot(w[0], w[1], w[2]);
  if (!l) return [1, 0, 0, 0];
  const dot = clamp(v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2], -1, 1);
  const t = Math.acos(dot) / 2;
  const s = Math.sin(t);
  return [Math.cos(t), (w[2] / l) * s, (-w[1] / l) * s, (w[0] / l) * s];
}

function onDisk(x: number, y: number, cx: number, cy: number, radius: number): [number, number] {
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.hypot(dx, dy);
  const limit = radius * 0.92;
  if (dist <= limit || dist === 0) return [x, y];
  const k = limit / dist;
  return [cx + dx * k, cy + dy * k];
}

export function QiblaGlobe({
  lat,
  lng,
  bearing,
}: {
  lat: number;
  lng: number;
  bearing: number;
}) {
  const lang = useNur((s) => s.lang);
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [rotation, setRotation] = useState<Angles>([-lng, -lat, bearing]);
  const [zoom, setZoom] = useState(1.15);
  const drag = useRef<{
    q0: Quat;
    v0: Vec3;
    rotation: Angles;
    radius: number;
    cx: number;
    cy: number;
  } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);

  const qiblaView = useMemo<Angles>(() => [-lng, -lat, bearing], [lat, lng, bearing]);

  useEffect(() => {
    setRotation(qiblaView);
    setZoom(1.15);
  }, [qiblaView]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scene = useMemo(() => {
    if (size.w < 40 || size.h < 40) return null;
    const radius = Math.min(size.w, size.h) * 0.42 * zoom;
    const projection = geoOrthographic()
      .translate([size.w / 2, size.h / 2])
      .scale(radius)
      .rotate(rotation)
      .clipAngle(90);
    const path = geoPath(projection);
    const route = greatCircle(lat, lng);
    const draw = path({ type: "LineString", coordinates: route });
    const project = (longitude: number, latitude: number) => {
      const point = projection([longitude, latitude]);
      return point ? ([point[0], point[1]] as [number, number]) : null;
    };
    return {
      radius,
      cx: size.w / 2,
      cy: size.h / 2,
      land: path(land),
      grid: path(geoGraticule().step([20, 20])()),
      arc: draw,
      user: project(lng, lat),
      kaaba: project(KAABA.lng, KAABA.lat),
      aim: project(route[8]?.[0] ?? KAABA.lng, route[8]?.[1] ?? KAABA.lat),
      projection,
    };
  }, [lat, lng, rotation, size.h, size.w, zoom]);

  function zoomBy(factor: number) {
    setZoom((value) => clamp(value * factor, 0.85, 3.4));
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    const el = boxRef.current;
    if (!el || !scene) return;
    el.setPointerCapture(event.pointerId);
    const rect = el.getBoundingClientRect();
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, zoom };
      drag.current = null;
      return;
    }
    const [px, py] = onDisk(event.clientX - rect.left, event.clientY - rect.top, scene.cx, scene.cy, scene.radius);
    const hit = scene.projection.invert([px, py]);
    if (!hit || Number.isNaN(hit[0])) return;
    drag.current = {
      q0: fromAngles(rotation),
      v0: cartesian(hit),
      rotation,
      radius: scene.radius,
      cx: scene.cx,
      cy: scene.cy,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size >= 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const next = clamp(pinch.current.zoom * (dist / pinch.current.dist), 0.85, 3.4);
      setZoom(next);
      return;
    }
    const start = drag.current;
    const el = boxRef.current;
    if (!start || !el) return;
    const rect = el.getBoundingClientRect();
    const [px, py] = onDisk(event.clientX - rect.left, event.clientY - rect.top, start.cx, start.cy, start.radius);
    const globe = geoOrthographic().translate([start.cx, start.cy]).scale(start.radius).rotate(start.rotation).clipAngle(90);
    const hit = globe.invert([px, py]);
    if (!hit || Number.isNaN(hit[0])) return;
    setRotation(toAngles(multiply(start.q0, delta(start.v0, cartesian(hit)))));
  }

  function endPointer(event: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) drag.current = null;
  }

  const aim =
    scene?.user && scene.aim
      ? Math.atan2(scene.aim[0] - scene.user[0], scene.user[1] - scene.aim[1])
      : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={boxRef}
        className="relative min-h-0 flex-1 touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        {scene ? (
          <svg className="h-full w-full" viewBox={`0 0 ${size.w} ${size.h}`}>
            <circle className="qibla-glow" cx={scene.cx} cy={scene.cy} r={scene.radius + 10} />
            <circle className="qibla-disc" cx={scene.cx} cy={scene.cy} r={scene.radius} />
            {scene.grid ? <path className="qibla-grid" d={scene.grid} /> : null}
            {scene.land ? <path className="qibla-land" d={scene.land} /> : null}
            {scene.arc ? <path className="qibla-band" d={scene.arc} /> : null}
            {scene.arc ? <path className="qibla-line" d={scene.arc} /> : null}
            <circle className="qibla-limb" cx={scene.cx} cy={scene.cy} r={scene.radius} />
          </svg>
        ) : null}
        {scene?.user ? (
          <div className="pointer-events-none absolute" style={{ left: scene.user[0], top: scene.user[1] }}>
            {aim != null ? (
              <div
                className="absolute left-0 top-0 h-8 w-1.5 -translate-x-1/2 rounded-full bg-gold"
                style={{ transform: `translate(-50%, -100%) rotate(${aim}rad)`, transformOrigin: "bottom center" }}
              />
            ) : null}
            <div className="size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cream bg-gold shadow" />
          </div>
        ) : null}
        {scene?.kaaba ? (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: scene.kaaba[0], top: scene.kaaba[1] }}
          >
            <div className="mx-auto size-4 rounded-[3px] bg-header ring-2 ring-gold" />
            <p className="mt-0.5 rounded-full bg-card/90 px-1.5 text-[10px] font-semibold text-ink">
              {tx(lang, { ru: "Кааба", ar: "الكعبة", en: "Kaaba" })}
            </p>
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
          <p className="pointer-events-none max-w-[70%] rounded-2xl bg-card/90 px-3 py-2 text-xs leading-5 text-soft shadow-card">
            {tx(lang, {
              ru: "Крутите землю. Золотая дуга — кибла, она смотрит на Каабу.",
              ar: "أدر الأرض. القوس الذهبي هو القبلة نحو الكعبة.",
              en: "Turn the earth. The gold arc is the qibla, toward the Kaaba.",
            })}
          </p>
          <div className="pointer-events-auto flex flex-col gap-2">
            <button type="button" aria-label="+" onClick={() => zoomBy(1.2)} className="flex size-11 items-center justify-center rounded-full border border-line bg-card text-ink">
              <Plus className="size-5" />
            </button>
            <button type="button" aria-label="−" onClick={() => zoomBy(1 / 1.2)} className="flex size-11 items-center justify-center rounded-full border border-line bg-card text-ink">
              <Minus className="size-5" />
            </button>
            <button
              type="button"
              aria-label={tx(lang, { ru: "Кибла вверх", ar: "القبلة للأعلى", en: "Qibla up" })}
              onClick={() => {
                setRotation(qiblaView);
                setZoom(1.15);
              }}
              className="flex size-11 items-center justify-center rounded-full border border-line bg-card text-goldink"
            >
              <LocateFixed className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
