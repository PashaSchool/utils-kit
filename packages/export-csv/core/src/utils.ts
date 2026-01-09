import {ToCSVChunkMessage} from "./types";

export function objectsToCSV(jsonArray: ToCSVChunkMessage['data'], columns: ToCSVChunkMessage['columns'], includeHeaders: boolean) {
  if (!jsonArray.length || !columns.length) return "";
  
  const rows = [];
  
  if (includeHeaders) {
    rows.push(columns.map((col) => col.label).join(","));
  }
  
  jsonArray.forEach((row) => {
    rows.push(
      columns
        .map((col) => {
          let val: any = getNested(row, col.key);
          
          if (typeof val === "string") {
            val = `"${val.replace(/"/g, '""')}"`
          };
          if (val === undefined || val === null) {
            val = ""
          };
          return val;
        })
        .join(","),
    );
  });
  
  return rows.join("\n") + "\n";
}

function getNested(obj: Record<string, any>, keyPath: string) {
  return keyPath.split(".").reduce((acc, key) => acc && acc[key], obj);
}
