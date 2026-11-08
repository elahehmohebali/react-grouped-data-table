import { useMemo } from 'react'
import DataTable from 'react-data-table-component'

const ORANGE = '#f07019'

// ---- helpers: work on a column tree of any depth ----
const getDepth = cols =>
  Math.max(...cols.map(c => (c.children ? 1 + getDepth(c.children) : 1)))

const getLeaves = cols =>
  cols.flatMap(c => (c.children ? getLeaves(c.children) : [c]))

const getWidth = col =>
  col.children ? col.children.reduce((sum, c) => sum + getWidth(c), 0) : col.width

// ---- one header node (group or leaf), rendered recursively ----
const HeaderNode = ({ col, level, depth, rowHeight, headStyle }) => {
  const width = getWidth(col)

  // Leaf: stretch down to the bottom (acts like rowspan)
  if (!col.children) {
    return (
      <div style={{ ...headStyle, width, height: (depth - level) * rowHeight }}>
        {col.header}
      </div>
    )
  }

  // Group: title on top, children side by side underneath (acts like colspan)
  return (
    <div style={{ width }}>
      <div style={{ ...headStyle, width: '100%', height: rowHeight }}>{col.header}</div>
      <div style={{ display: 'flex' }}>
        {col.children.map((child, i) => (
          <HeaderNode
            key={child.key || child.header || i}
            col={child}
            level={level + 1}
            depth={depth}
            rowHeight={rowHeight}
            headStyle={headStyle}
          />
        ))}
      </div>
    </div>
  )
}

const GroupedDataTable = ({
  columns,                 // tree: { header, key?, width?, cell?, children? }
  data,
  keyField = 'id',
  loading = false,
  maxHeight = 300,
  headerRowHeight = 40,
  headerBackground = ORANGE,
  headerColor = 'white',
  rowHeight = 46,
  ...tableProps            // any other react-data-table-component prop
}) => {
  const depth = useMemo(() => getDepth(columns), [columns])
  const leaves = useMemo(() => getLeaves(columns), [columns])
  const totalWidth = useMemo(() => leaves.reduce((s, c) => s + c.width, 0), [leaves])

  const headStyle = {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: headerColor,
    fontWeight: 'bold',
    backgroundColor: headerBackground,
    border: '1px solid #fff'
  }

  // Convert leaf columns into plain react-data-table-component columns
  const tableColumns = useMemo(
    () =>
      leaves.map(leaf => ({
        name: leaf.header,
        width: `${leaf.width}px`,
        cell: leaf.cell || (row => row[leaf.key])
      })),
    [leaves]
  )

  const customStyles = {
    rows: { style: { minHeight: `${rowHeight}px` } },
    cells: {
      style: { padding: 0, justifyContent: 'center', borderRight: '1px solid #e0e0e0' }
    }
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ width: totalWidth, minWidth: '100%' }}>
        {/* Grouped header (fixed while the body scrolls vertically) */}
        <div style={{ display: 'flex' }}>
          {columns.map((col, i) => (
            <HeaderNode
              key={col.key || col.header || i}
              col={col}
              level={0}
              depth={depth}
              rowHeight={headerRowHeight}
              headStyle={headStyle}
            />
          ))}
        </div>

        {/* Body */}
        <div style={{ maxHeight, overflowY: 'auto' }}>
          <DataTable
            columns={tableColumns}
            data={data}
            keyField={keyField}
            noTableHead
            progressPending={loading}
            customStyles={customStyles}
            highlightOnHover
            {...tableProps}
          />
        </div>
      </div>
    </div>
  )
}

export default GroupedDataTable
