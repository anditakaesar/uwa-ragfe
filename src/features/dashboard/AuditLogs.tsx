import { Button, DataTable, DataTableSkeleton, Heading, InlineNotification, Pagination, Section, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TabList, TabPanel, TabPanels, Tabs, TextInput } from "@carbon/react"
import { useState } from "react"
import { useAuditLogs } from "../../hooks/auditlogs"
import { isAfter } from "date-fns"

const headers = [
  { key: 'no', header: 'No' },
  { key: 'id', header: 'ID' },
  { key: 'resourceName', header: 'Resource Name' },
  { key: 'resourceID', header: 'Resource ID' },
  { key: 'actorID', header: 'ActorID' },
  { key: 'actorName', header: 'Actor Name' },
  { key: 'actorType', header: 'Actor Type' },
  { key: 'action', header: 'Action' },
  { key: 'createdAt', header: 'Datetime' },
]

export const AuditLogs = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [startDateFilter, setStartDateFilter] = useState<string>('')
  const [endDateFilter, setEndDateFilter] = useState<string>('')

  const { data, isLoading, isError, error, isFetching } = useAuditLogs({
    page,
    startDate,
    endDate,
    size: pageSize,
    resourceName: undefined,
  })

  const handlePaginationChange = ({ page: newPage, pageSize: newPageSize }: { page: number; pageSize: number }) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleFilterButton = () => {
    if (endDateFilter != '' && startDateFilter != '') {
      const s = new Date(startDateFilter)
      const e = new Date(endDateFilter)

      if (isAfter(s, e)) {
        setErrMsg('End Date must after Start Date')
        return
      }

      setStartDate(s)
      setEndDate(e)
    }
  }

  const handleResetButton = () => {
    setStartDateFilter('')
    setEndDateFilter('')
    setStartDate(undefined)
    setEndDate(undefined)
    setErrMsg(null)
  }

  const showFilterErr = () => {
    if (errMsg) {
      return (
        <InlineNotification
          kind="warning"
          title="Failed to fetch Audit Logs"
          subtitle={errMsg ?? ''}
          onCloseButtonClick={() => setErrMsg(null)}
        />
      )
    }
    return
  }

  const rows = data?.data.map((alog, index) => ({
    no: index + 1 + (page - 1) * pageSize,
    id: String(alog.id),
    resourceName: alog.resourceName,
    resourceID: alog.resourceID,
    actorID: alog.resourceID ? String(alog.resourceID) : '',
    actorName: alog.actorName,
    actorType: alog.actorType,
    action: alog.action,
    createdAt: new Date(alog.createdAt).toLocaleString()
  })) || []

  const totalItems = data?.meta.pagination.total || 0

  if (isLoading) {
    return <DataTableSkeleton headers={headers} rowCount={pageSize} columnCount={headers.length} />
  }

  if (isError) {
    return (
      <InlineNotification
        kind="error"
        title="Failed to fetch Audit Logs"
        subtitle={error instanceof Error ? error.message : 'An unexpected error occurred'}
      />
    )
  }

  return (
    <>
      <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
        <Section as="div">
          <Heading>Audit Logs</Heading>
          <p style={{ marginBottom: '2rem' }}>
            System audit logs list
          </p>
        </Section>
        <Tabs>
          <TabList>
            <Tab>
              Filter
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', maxWidth: '15rem' }}>
                  <TextInput id="filter-start-date" labelText="Start Date" type="datetime-local" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)}></TextInput>
                  <TextInput id="filter-end-date" labelText="End Date" type="datetime-local" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)}></TextInput>
                </div>
                <div style={{ display: 'flex', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <Button size="sm" onClick={handleFilterButton}>Filter</Button>
                  <Button size="sm" kind="danger" onClick={handleResetButton}>Reset</Button>
                </div>
                {showFilterErr()}
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <div style={{ marginBottom: '2rem' }} />
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps }) => (
            <TableContainer>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader key={header.key}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>

        <Pagination
          page={page}
          pageSize={pageSize}
          pageSizes={[10, 20, 50, 100]}
          totalItems={totalItems}
          onChange={handlePaginationChange}
        />
      </div>
      <div style={{ marginBottom: '2rem' }} />
    </>
  )
}

export default AuditLogs