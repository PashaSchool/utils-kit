// TODO: FIX TYPES
export function objectsToCSV(rows: any[]) {
  if (!Array.isArray(rows) || rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);

    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvLines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCSV(row[h])).join(",")),
  ];

  return csvLines.join("\r\n");
}
