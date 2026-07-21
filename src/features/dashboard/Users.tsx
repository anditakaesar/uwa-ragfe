import { useState } from 'react'
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  // TableToolbar,
  // TableToolbarContent,
  // TableToolbarSearch,
  DataTableSkeleton,
  Pagination,
  InlineNotification
} from '@carbon/react'
import { useUsers } from '../../hooks/useUsers'

const headers = [
  { key: 'id', header: 'ID' },
  { key: 'username', header: 'Username' },
  { key: 'roleID', header: 'Role ID' },
  { key: 'createdAt', header: 'Created At' }
]

export const Users = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [username] = useState('')

  const { data, isLoading, isError, error, isFetching } = useUsers({
    page,
    size: pageSize,
    username: username || undefined
  })

  const handlePaginationChange = ({ page: newPage, pageSize: newPageSize }: { page: number; pageSize: number }) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  // const handleUsernameChange = (e, value) => {
  //   setUsername(value)
  // }

  const rows =
    data?.data.map((user) => ({
      id: String(user.id),
      username: user.username,
      roleID: user.roleID,
      createdAt: new Date(user.createdAt).toLocaleString()
    })) || []

  const totalItems = data?.meta.pagination.total || 0

  if (isLoading) {
    return <DataTableSkeleton headers={headers} rowCount={pageSize} columnCount={4} />
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
    <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
          <TableContainer title="Users Management" description="List of registered users in the system">
            {/*<TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  persistent
                  placeholder="Filter by username..."
                  value={username}
                  onChange={handleUsernameChange}
                />
              </TableToolbarContent>
            </TableToolbar>*/}
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
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
        pageSizes={[1, 2, 3]}
        totalItems={totalItems}
        onChange={handlePaginationChange}
      />
    </div>
  )
}

export default Users
