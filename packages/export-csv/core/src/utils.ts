export function objectsToCSV(jsonArray, columns, includeHeaders) {
  if (!jsonArray.length || !columns.length) return "";

  const rows = [];

  if (includeHeaders) {
    rows.push(columns.map((col) => col.label).join(","));
  }

  jsonArray.forEach((row) => {
    rows.push(
      columns
        .map((col) => {
          let val = getNested(row, col.key);

          // if (val && typeof val === 'object' && 'seconds' in val && 'nanoseconds' in val) {
          //   val = formatFirestoreTimestamp(val)
          // }

          if (typeof val === "string") val = `"${val.replace(/"/g, '""')}"`;
          if (val === undefined || val === null) val = "";
          return val;
        })
        .join(","),
    );
  });

  return rows.join("\n") + "\n";
}

function getNested(obj, keyPath) {
  return keyPath.split(".").reduce((acc, key) => acc && acc[key], obj);
}

function formatFirestoreTimestamp(val) {
  if (
    val &&
    typeof val === "object" &&
    typeof val.seconds === "number" &&
    typeof val.nanoseconds === "number"
  ) {
    const date = new Date(val.seconds * 1000 + Math.floor(val.nanoseconds / 1e6));

    return date.toISOString().replace("T", " ").slice(0, 19);
  }
  return val;
}
