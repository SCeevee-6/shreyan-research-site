const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const fmtShort = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
const fmtMonthLong = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

export const formatDate = (d: string | Date) => fmt.format(new Date(d));
export const formatMonth = (d: string | Date) => fmtShort.format(new Date(d));

/** Month and year of this build, shown as "Updated …". */
export const updated = () => fmtMonthLong.format(new Date());
