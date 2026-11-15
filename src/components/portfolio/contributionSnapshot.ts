/**
 * The contribution calendars from both GitHub profiles, as they look when
 * signed in (private contributions included), read square by square from
 * screenshots taken on 14 November 2026. The public calendar hides private
 * work, so the site shows this record instead.
 *
 * Each account is GitHub's "last year" view: 53 weeks, one string per
 * weekday (Sunday first), one digit per week (0 = none, 1-4 = GitHub's
 * shade). Only the shades and each account's total are known, not each day's
 * exact count, so the graph shows shades and the totals only.
 *
 * To refresh: take new screenshots, set `asOf` to the day they were taken
 * (the last square of the bottom-right column is that week's Saturday) and
 * replace the totals and rows.
 */
export const CONTRIBUTION_SNAPSHOT = {
  /** the date the screenshots were taken: the calendars end here */
  asOf: "2026-11-14",
  accounts: [
    {
      user: "Harsha-Srinatth",
      label: "Personal",
      total: 196,
      rows: [
        "00100000000001000000000000000000000200000004000001110",
        "00000000000002000000000000000100000000000000000100100",
        "00000010100000000000000000000000000000000004000210100",
        "00000000000000000000000000000300000011000002001201000",
        "00000100000000000000000000000000000001000012002101000",
        "00000000000000000000000000000000000000000040002001110",
        "00000000000001000000000000000100000000000020002001102",
      ],
    },
    {
      user: "Harsha-Alchemist",
      label: "Internship",
      total: 710,
      rows: [
        "00000000000000000000000000000000000000001122413123223",
        "00000000000000000000000000000000000000000110111322440",
        "00000000000000000000000000000000000000111120142211240",
        "00000000000000000000000000000000000001011221224211020",
        "00000000000000000000000000000000000000032121211332020",
        "00000000000000000000000000000000000000100211111120320",
        "00000000000000000000000000000000000000012201002120040",
      ],
    },
  ],
};
