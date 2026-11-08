// Demo: needs react-circular-progressbar (and reactstrap for the Card) in your app.
import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { CircularProgressbar } from 'react-circular-progressbar'
import GroupedDataTable from '../src/GroupedDataTable'
import { sampleDataByRegionGroup } from './sampleData'

const GroupedTableDemo = () => {
  const [selected, setSelected] = useState(null)

  const rows = useMemo(
    () =>
      Object.keys(sampleDataByRegionGroup).map(region => {
        const row = { id: region, label: region }
        for (const mile in sampleDataByRegionGroup[region]) {
          const m = sampleDataByRegionGroup[region][mile]
          row[mile] = {
            ...m,
            percentage: m.plan > 0 ? Math.round((m.actual / m.plan) * 100) : Math.round(m.actual * 100)
          }
        }
        return row
      }),
    []
  )

  const columns = useMemo(() => {
    const mileNames = [...new Set(rows.flatMap(r => Object.keys(r).filter(k => k !== 'id' && k !== 'label')))]

    return [
      {
        header: 'Region',
        key: 'label',
        width: 100,
        cell: row => (
          <a href="#" onClick={e => { e.preventDefault(); setSelected(row) }}>
            {row.label}
          </a>
        )
      },
      ...mileNames.map(mile => ({
        header: mile,
        children: [
          { header: 'Pl.', key: `${mile}.plan`,   width: 60, cell: r => r[mile]?.plan ?? 0 },
          { header: 'Ac.', key: `${mile}.actual`, width: 60, cell: r => r[mile]?.actual ?? 0 },
          {
            header: '%',
            key: `${mile}.percentage`,
            width: 70,
            cell: r => {
              const v = r[mile]?.percentage ?? 0
              return (
                <div style={{ width: 40, height: 40 }}>
                  <CircularProgressbar
                    value={v}
                    text={`${v}%`}
                    backgroundPadding={6}
                    styles={{
                      background: { fill: '#3e7491' },
                      text: { fontSize: '22px', fontWeight: 'bold' }
                    }}
                  />
                </div>
              )
            }
          }
        ]
      }))
    ]
  }, [rows])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="m-2" tag="h4">Milestone Stats by Region Groups (Demo)</CardTitle>
      </CardHeader>
      <CardBody className="m-1">
        <GroupedDataTable columns={columns} data={rows} maxHeight={300} />
        {selected && <pre className="mt-2">{JSON.stringify(selected, null, 2)}</pre>}
      </CardBody>
    </Card>
  )
}

export default GroupedTableDemo
