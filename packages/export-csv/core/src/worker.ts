console.log('empty worker')


// getColumns: () => [
//   { key: 'time', label: 'Time' },
//   { key: 'src_name', label: 'Source name' },
//   { key: 'src_process', label: 'Source process' },
//   { key: 'policy_name', label: 'Policy name' },
//   { key: 'port', label: 'Port' },
//   { key: 'dst_name', label: 'Destination name' },
//   { key: 'dst_process', label: 'Destination process' },
// ],

type FormatTypes = {
  dataType: 'Date' | 'Timestamp' | 'Utc',
  applyFormattingType: 'DD/MM/YYYY'
}

type Column = {
  key: string, header: string, format?: FormatTypes
}

type Message = {
  type: string,
  columns: Array<Column>
}

self.onmessage((message: Message) => {
  const {type, columns} = message;
  
})
