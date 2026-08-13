/**
 * NUMAN HINDCAST — the measured record behind the one claim this site makes.
 *
 * PROVENANCE. Every number below is a stored radar measurement of wetted area
 * at the Benue @ Numan reach (Gongola confluence, Adamawa), read out of the
 * platform's own `flood_reference` table — the same rows the live early-warning
 * cron writes and reads. Nothing here is drawn, smoothed, modelled, or chosen
 * to look good. If the stored record changes, this file is wrong and should be
 * regenerated from it rather than edited by hand.
 *
 * WHY IT IS BAKED IN. The public site holds no credentials for the analysis
 * project and must not: this page is a published record of a closed historical
 * event, not a live readout. A frozen copy is the honest representation.
 *
 * THE DETECTOR (unchanged from the live one, stated in full so a reader can
 * replay it against the arrays below):
 *   surge test    wetted >= 1.4x the trailing median of passes 10-45 days back
 *   seasonal test wetted >= 1.4x the control-year median at the same day of
 *                 year (+/- 15 days) — the `pin` field on each event point
 *   floor         20 km² absolute
 *   WATCH         both tests pass on one pass
 *   CONFIRMED     both tests pass on two consecutive passes, and the upstream
 *                 gate is open (Lagdo >= 80% full, or filling >= 2%/week)
 *
 * REPLAYING IT over the 2022 season yields WATCH on Sep 4 and the first
 * CONFIRMED on Sep 9 — the certified result. Two earlier single-pass WATCHes
 * (Jun 29, Aug 16) never escalated, because a second consecutive hit never
 * came. That is the two-pass rule doing its job, and it is why an isolated
 * high reading is not a warning.
 *
 * WINDOW. Jul 1 - Oct 31 on both years. The 2022 record also holds three June
 * passes (Jun 5 at 110.2 km², Jun 12 at 53.5, Jun 17 at 52.4). They sit outside
 * this window and are disclosed on the page rather than quietly dropped: the
 * first two have no trailing history behind them, so the surge test is
 * undefined there and the detector cannot evaluate them at all.
 */

export interface EventPoint {
  /** Pass date (ISO). */
  d: string
  /** Measured wetted area, km². */
  km2: number
  /** Seasonal test threshold at this day of year: 1.4x the control-year median. */
  pin: number
}

export interface ControlPoint {
  d: string
  km2: number
}

/** 2022 — the flood year. */
export const EVENT_2022: EventPoint[] = [
  { d: '2022-07-06', km2: 15.435, pin: 58.21 },
  { d: '2022-07-11', km2: 64.241, pin: 35.14 },
  { d: '2022-07-18', km2: 31.952, pin: 34.89 },
  { d: '2022-07-23', km2: 30.411, pin: 34.2 },
  { d: '2022-07-30', km2: 45.825, pin: 34.2 },
  { d: '2022-08-04', km2: 25.437, pin: 34.2 },
  { d: '2022-08-11', km2: 38.486, pin: 37.96 },
  { d: '2022-08-16', km2: 43.864, pin: 37.96 },
  { d: '2022-08-23', km2: 43.091, pin: 42.26 },
  { d: '2022-08-28', km2: 34.933, pin: 40.48 },
  { d: '2022-09-04', km2: 69.343, pin: 37.59 },
  { d: '2022-09-09', km2: 60.498, pin: 36.48 },
  { d: '2022-09-16', km2: 65.129, pin: 36.48 },
  { d: '2022-09-21', km2: 67.078, pin: 36.48 },
  { d: '2022-09-28', km2: 63.949, pin: 36.48 },
  { d: '2022-10-03', km2: 58.575, pin: 43.32 },
  { d: '2022-10-10', km2: 53.296, pin: 43.51 },
  { d: '2022-10-15', km2: 40.938, pin: 41.03 },
  { d: '2022-10-22', km2: 29.699, pin: 34.93 },
  { d: '2022-10-27', km2: 25.653, pin: 34.93 },
]

/** 2021 — the control year, same reach, same engine, same window. */
export const CONTROL_2021: ControlPoint[] = [
  { d: '2021-07-04', km2: 40.956 },
  { d: '2021-07-11', km2: 43.602 },
  { d: '2021-07-16', km2: 18.621 },
  { d: '2021-07-23', km2: 24.808 },
  { d: '2021-07-28', km2: 19.806 },
  { d: '2021-08-04', km2: 43.977 },
  { d: '2021-08-09', km2: 21.244 },
  { d: '2021-08-16', km2: 30.192 },
  { d: '2021-08-21', km2: 34.189 },
  { d: '2021-08-28', km2: 37.787 },
  { d: '2021-09-02', km2: 30.183 },
  { d: '2021-09-09', km2: 27.644 },
  { d: '2021-09-14', km2: 26.054 },
  { d: '2021-09-26', km2: 24.657 },
  { d: '2021-10-03', km2: 30.94 },
  { d: '2021-10-08', km2: 19.247 },
  { d: '2021-10-15', km2: 34.635 },
  { d: '2021-10-20', km2: 22.723 },
  { d: '2021-10-27', km2: 27.675 },
]

/** The two passes that carry the claim. */
export const WATCH_DATE = '2022-09-04'
export const CONFIRMED_DATE = '2022-09-09'

/**
 * Lead time over the official notification, in days. The certified hindcast
 * records CONFIRMED at Sep 9, four days ahead of the official warning. We mark
 * the warning on the chart by that offset rather than minting a calendar date
 * of our own for someone else's announcement.
 */
export const LEAD_DAYS = 4

/** The June passes held out of the charted window — disclosed, not dropped. */
export const JUNE_HELDOUT = [
  { d: '2022-06-05', km2: 110.223, note: 'no trailing history — surge test undefined' },
  { d: '2022-06-12', km2: 53.472, note: 'no trailing history — surge test undefined' },
  { d: '2022-06-17', km2: 52.385, note: 'evaluated, both tests negative' },
]
