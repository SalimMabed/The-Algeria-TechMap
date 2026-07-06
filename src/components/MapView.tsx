import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet'
import { divIcon, latLngBounds, type LatLngBoundsExpression } from 'leaflet'
import { useEffect } from 'react'
import type { Entity } from '../types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types'
import algeriaBoundary from '../data/algeria-boundary.json'

const ALGERIA_CENTER: [number, number] = [28.1, 2.6]
// Algeria's own bounding box, used to precisely center/fit the country on load.
const ALGERIA_FIT_BOUNDS = latLngBounds([19.06, -8.68], [37.12, 12.0])
// Generous world bounds: keeps the default view anchored on Algeria while
// still letting the surrounding continents be visible when zooming out.
const WORLD_BOUNDS: LatLngBoundsExpression = [
  [-85, -180],
  [85, 180],
]

function FitAlgeria() {
  const map = useMap()
  useEffect(() => {
    // Bias padding towards the top/left to leave room for the floating
    // search bar and stats card so Algeria reads as visually centered.
    map.fitBounds(ALGERIA_FIT_BOUNDS, {
      paddingTopLeft: [40, 170],
      paddingBottomRight: [40, 70],
    })
  }, [map])
  return null
}

function icon(color: string) {
  return divIcon({
    className: 'custom-marker',
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:${color};border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

function FlyTo({ entity }: { entity: Entity | null }) {
  const map = useMap()
  useEffect(() => {
    if (entity) {
      map.flyTo([entity.lat, entity.lng], 12, { duration: 0.7 })
    }
  }, [entity, map])
  return null
}

export function MapView({
  entities,
  selected,
  onViewDetails,
}: {
  entities: Entity[]
  selected: Entity | null
  onViewDetails: (e: Entity) => void
}) {
  return (
    <MapContainer
      center={ALGERIA_CENTER}
      zoom={6}
      minZoom={3}
      maxBounds={WORLD_BOUNDS}
      zoomControl={false}
      scrollWheelZoom
      className="h-full w-full"
    >
      <FitAlgeria />
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
        maxNativeZoom={13}
        className="flat-terrain"
      />

      {/* Algeria is highlighted, not walled off — a soft glow + gentle fill
          instead of a hard, closed-looking border, since the site is about
          investment and collaboration opportunities, not isolation. */}
      <GeoJSON
        data={algeriaBoundary as GeoJSON.GeoJsonObject}
        style={{
          fill: true,
          fillColor: '#10b981',
          fillOpacity: 0.1,
          stroke: true,
          color: '#10b981',
          weight: 10,
          opacity: 0.12,
          lineJoin: 'round',
          interactive: false,
        }}
      />
      <GeoJSON
        data={algeriaBoundary as GeoJSON.GeoJsonObject}
        style={{
          fill: false,
          color: '#059669',
          weight: 1.6,
          opacity: 0.8,
          lineJoin: 'round',
          interactive: false,
        }}
      />

      <FlyTo entity={selected} />
      {entities.map((e) => (
        <Marker key={e.id} position={[e.lat, e.lng]} icon={icon(CATEGORY_COLORS[e.category])}>
          <Popup
            className="premium-popup"
            closeButton={false}
            maxWidth={260}
            autoPanPaddingTopLeft={[20, 180]}
            autoPanPaddingBottomRight={[20, 80]}
          >
            <div className="w-56 p-1">
              <div className="flex items-start gap-2.5">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-semibold text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[e.category] }}
                >
                  {e.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-neutral-900">{e.name}</p>
                  <p className="truncate text-[11px] text-neutral-500">
                    {CATEGORY_LABELS[e.category]} · {e.city}
                  </p>
                </div>
              </div>
              <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-neutral-600">
                {e.description}
              </p>
              <button
                type="button"
                onClick={() => onViewDetails(e)}
                className="mt-3 w-full rounded-lg bg-neutral-900 py-1.5 text-[12px] font-medium text-white transition hover:bg-neutral-700"
              >
                View details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
