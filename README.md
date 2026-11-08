# react-grouped-data-table

Multi-level grouped column headers for [`react-data-table-component`](https://github.com/jbetancur/react-data-table-component).

`react-data-table-component` has no equivalent of `ColumnGroup`, so building a
table with grouped headers (for example *Milestone → Plan / Actual / %*) means
hand-aligning header cells with body cells. `GroupedDataTable` removes that work:
you describe your columns as a tree, and it renders the grouped header and the
body for you.

```
┌────────┬───────────────────────┬───────────────────────┐
│        │      Site Survey      │       Civil Work      │
│ Region ├─────┬───────┬─────────┼─────┬───────┬─────────┤
│        │ Pl. │  Ac.  │    %    │ Pl. │  Ac.  │    %    │
├────────┼─────┼───────┼─────────┼─────┼───────┼─────────┤
│ Tehran │ 300 │  300  │  100%   │ 250 │  190  │   76%   │
└────────┴─────┴───────┴─────────┴─────┴───────┴─────────┘
```

## Features

- Multi-level headers, nested to any depth
- Automatic rowspan/colspan: leaf columns stretch to the bottom, groups span their children
- Widths declared once, so header and body never drift out of alignment
- Shared horizontal scroll, with a header that stays fixed while the body scrolls vertically
- Custom cell rendering per column (links, progress rings, badges)
- Every other `react-data-table-component` prop is passed through

## Installation

```bash
npm install react-grouped-data-table react-data-table-component styled-components
```

## Usage

```jsx
import GroupedDataTable from 'react-grouped-data-table'

const columns = [
  { header: 'Region', key: 'label', width: 100 },
  {
    header: 'Site Survey',
    children: [
      { header: 'Pl.', key: 'plan', width: 60, cell: row => row.survey.plan },
      { header: 'Ac.', key: 'actual', width: 60, cell: row => row.survey.actual },
      { header: '%', key: 'pct', width: 70, cell: row => `${row.survey.pct}%` }
    ]
  }
]

const data = [
  { id: 'tehran', label: 'Tehran', survey: { plan: 300, actual: 300, pct: 100 } }
]

export default function App() {
  return <GroupedDataTable columns={columns} data={data} maxHeight={300} />
}
```

A fuller example (with progress rings and sample data) lives in [`example/`](./example).

## Column definition

| Field      | Type            | Description                                                       |
|------------|-----------------|-------------------------------------------------------------------|
| `header`   | `string`        | Text shown in the header.                                         |
| `key`      | `string`        | Row field used when no `cell` is given.                           |
| `width`    | `number`        | Width in px. Required on leaf columns; groups sum their children. |
| `cell`     | `(row) => node` | Custom renderer for the body cell (leaf columns only).            |
| `children` | `Column[]`      | Makes this column a group. Can be nested.                         |

## Props

| Prop               | Default   | Description                                |
|--------------------|-----------|--------------------------------------------|
| `columns`          | required  | Column tree (see above).                   |
| `data`             | required  | Array of row objects.                      |
| `keyField`         | `'id'`    | Unique row key.                            |
| `loading`          | `false`   | Shows the progress indicator.              |
| `maxHeight`        | `300`     | Body height before it scrolls vertically.  |
| `headerRowHeight`  | `40`      | Height of one header row, in px.           |
| `headerBackground` | `#f07019` | Header background color.                   |
| `headerColor`      | `white`   | Header text color.                         |
| `rowHeight`        | `46`      | Minimum body row height, in px.            |
| `...rest`          |           | Forwarded to `react-data-table-component`. |

## Limitations

- Built-in column sorting is disabled, because the library's own header is turned off.
  Sort `data` yourself if you need it.
- When the body shows a vertical scrollbar, it takes about 15px, so the last header
  column can sit slightly offset. Add `scrollbar-gutter: stable` to work around it.

## Roadmap

- [ ] Sortable leaf headers
- [ ] Sticky first column
- [ ] TypeScript types
- [ ] RTL support

## Contributing

Issues and pull requests are welcome.

## License

MIT
