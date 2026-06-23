export const RESPONSE_DEADLINE_DAYS = 7;
const JAPAN_TIME_ZONE = "Asia/Tokyo";

export function defaultResponseDeadline(now = new Date()) {
  return new Date(now.getTime() + RESPONSE_DEADLINE_DAYS * 24 * 60 * 60 * 1000);
}

export function toDateTimeLocalInTokyo(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: JAPAN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const valueByType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${valueByType.year}-${valueByType.month}-${valueByType.day}T${valueByType.hour}:${valueByType.minute}`;
}

export function parseTokyoDateTimeLocal(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour) - 9, Number(minute)));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function deadlineFromTokyoInput(value: string | null | undefined, now = new Date()) {
  const raw = value?.trim() ?? "";
  if (!raw) return defaultResponseDeadline(now);

  const parsed = parseTokyoDateTimeLocal(raw);
  if (!parsed || parsed.getTime() <= now.getTime()) return null;
  return parsed;
}

export function formatDeadlineInTokyo(value?: string | null) {
  if (!value) return "指定なし";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: JAPAN_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(new Date(value));
}

export function isDeadlineExpired(value?: string | null, now = Date.now()) {
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) || now >= timestamp;
}
