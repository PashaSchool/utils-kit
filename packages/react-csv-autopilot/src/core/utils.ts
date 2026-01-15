import type { Column, ToCSVChunkMessage } from "./types";

export function objectsToCSV(
  jsonArray: ToCSVChunkMessage["data"],
  columns: ToCSVChunkMessage["columns"],
  includeHeaders: boolean,
) {
  if (!jsonArray.length || !columns.length) return "";

  const rows = [];

  if (includeHeaders) {
    rows.push(columns.map((col) => col.label).join(","));
  }

  jsonArray.forEach((row) => {
    rows.push(
      columns
        .map((col) => {
          const val: any = getNested(row, col.key);
          const normalizedValue = normalisedValue(val);
          const maybeFormattedValue = getFormatter(col, normalizedValue);

          return maybeFormattedValue;
        })
        .join(","),
    );
  });

  return `${rows.join("\n")}\n`;
}

function getNested(obj: Record<string, any>, keyPath: string) {
  return keyPath.split(".").reduce((acc, key) => acc?.[key], obj);
}

function normalisedValue<T>(value: T): string | T {
  let result: any = value;

  if (typeof result === "string") {
    result = `"${result.replace(/"/g, '""')}"`;
  }

  if (result === undefined || result === null) {
    result = "";
  }

  return result;
}

function makeFormatters(locale = "en-US", timeZone = "UTC", currency = "USD") {
  return {
    dateFull: new Intl.DateTimeFormat(locale, { timeZone, dateStyle: "full" }),
    dateMediumTime: new Intl.DateTimeFormat(locale, {
      timeZone,
      dateStyle: "medium",
      timeStyle: "short",
    }),
    timeShort: new Intl.DateTimeFormat(locale, { timeZone, timeStyle: "short" }),

    numDecimal: new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }),
    numCompact: new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }),
    numCurrency: new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }),
    numPercent: new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }),
  };
}

function getFormatter(col: Column, value: string) {
  const formatters = makeFormatters();
  const availableFormatters = Object.keys(formatters);

  if ("formatType" in col && availableFormatters.includes(col.formatType as string)) {
    const enhance = formatters[col.formatType as keyof typeof formatters];

    return enhance.format(value as any);
  } else {
    return value;
  }
}
