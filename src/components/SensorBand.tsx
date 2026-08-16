import { useState } from 'react'
import { Reveal } from './motion'
import { Lightbox } from './Lightbox'
import deltaOptical from '../assets/delta-optical.webp'

/**
 * Real optical satellite imagery of the Niger Delta, used to make an argument
 * rather than as decoration: roughly half the scene is under cloud, which is
 * precisely the case for tasking radar alongside optical.
 *
 * Public-domain NASA imagery. Deliberately NOT our own output — publishing
 * operational captures is exactly what we tell clients we don't do.
 */
export function SensorBand() {
  const [zoomed, setZoomed] = useState(false)

  return (
    <section className="relative border-t border-steel overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={deltaOptical}
          alt="Optical satellite view of the Niger Delta coastline, with scattered cumulus cloud obscuring large areas of the land surface"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* Keep the right side of the scene readable — the cloud IS the
            argument. Legibility is bought with a left-side gradient over the
            text column, not a flat wash over the whole image. */}
        <div className="absolute inset-0 bg-void/25" />
        <div className="absolute inset-0 grid-overlay opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-void/40" />
      </div>

      {/* The real image is clickable — open it full-size with its attribution. */}
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="absolute inset-0 group cursor-zoom-in"
        aria-label="Open the full-size satellite image"
      >
        <span className="absolute bottom-4 right-4 font-mono text-[9.5px] tracking-[0.14em] uppercase text-ink-faint border border-steel bg-void/70 backdrop-blur-sm px-3 py-1.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          Click to enlarge →
        </span>
      </button>

      <div className="relative max-w-[1240px] mx-auto px-7 py-28 pointer-events-none">
        <Reveal>
          <div className="max-w-xl">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-cyan mb-3">
              Optical · Niger Delta
            </div>
            <h2 className="font-display font-bold text-[clamp(26px,3.6vw,38px)] leading-[1.1] mb-5 text-balance">
              Count the cloud. That is the whole case for radar.
            </h2>
            <p className="text-ink-dim text-[15px] leading-relaxed mb-4">
              This is a real optical pass over the delta. Roughly half the land surface is under cumulus, and the wet
              season — when flooding and pipeline activity both peak — is when that cover is heaviest.
            </p>
            <p className="text-ink-dim text-[15px] leading-relaxed">
              Optical imagery is the better picture when you can get it. Radar is the one you can rely on getting.
              A collection plan that depends on clear sky is a collection plan with a seasonal blind spot.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative border-t border-steel/60">
        <div className="max-w-[1240px] mx-auto px-7 py-3 font-mono text-[9.5px] tracking-[0.14em] uppercase text-ink-faint">
          Imagery: NASA, public domain · illustrative, not an operational capture
        </div>
      </div>

      <Lightbox open={zoomed} onClose={() => setZoomed(false)} label="Full-size optical satellite image of the Niger Delta">
        <figure className="m-0">
          <img
            src={deltaOptical}
            alt="Optical satellite view of the Niger Delta coastline, with scattered cumulus cloud obscuring large areas of the land surface"
            className="w-full h-auto max-h-[82vh] object-contain border border-steel bg-void"
          />
          <figcaption className="mt-3 font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-faint text-center">
            Optical pass over the Niger Delta · NASA, public domain · illustrative, not an operational capture
          </figcaption>
        </figure>
      </Lightbox>
    </section>
  )
}
