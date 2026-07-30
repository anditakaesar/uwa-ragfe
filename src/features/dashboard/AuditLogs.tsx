import { DataTable, DataTableSkeleton, Heading, InlineNotification, Pagination, Section, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@carbon/react"
import { useState } from "react"
import { useAuditLogs } from "../../hooks/auditlogs"

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

  const { data, isLoading, isError, error, isFetching } = useAuditLogs({
    page,
    size: pageSize,
    resourceName: undefined,
  })

  const handlePaginationChange = ({ page: newPage, pageSize: newPageSize }: { page: number; pageSize: number }) => {
    setPage(newPage)
    setPageSize(newPageSize)
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
        title="Failed to fetch users"
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
      <div style={{marginBottom: '2rem'}} />
    </>
  )
}

export default AuditLogs