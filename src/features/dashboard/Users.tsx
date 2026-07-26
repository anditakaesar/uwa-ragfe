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
  DataTableSkeleton,
  Pagination,
  InlineNotification,
  TableToolbar,
  TableToolbarContent,
  TextInput,
  IconButton,
  Section,
  Heading,
  Button,
  Modal,
  Search,
} from '@carbon/react'
import { useUsers } from '../../hooks/useUsers'
import { Add, Search as SearchIcon } from '@carbon/icons-react'

const headers = [
  { key: 'id', header: 'ID' },
  { key: 'username', header: 'Username' },
  { key: 'roleName', header: 'Role' },
  { key: 'createdAt', header: 'Created At' }
]

const NewUserModal = () => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
    <Button type='button' onClick={() => setModalOpen(true)} renderIcon={Add}>
          New
    </Button>
    <Modal open={modalOpen} onRequestClose={() => setModalOpen(false)} primaryButtonText="Add" secondaryButtonText="Cancel">
      <p style={{marginBottom: '1rem'}}>
        Create new user here
      </p>
      <TextInput data-modal-primary-focus id='username' type='text' labelText='username' placeholder='username here...' style={{marginBottom: '1rem'}} />
      <TextInput id='password' type='password' labelText='password' placeholder='password here...' style={{marginBottom: '1rem'}} />
    </Modal>
    </>
  )
}

export const Users = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [username, setUsername] = useState('')
  const [filterusername, setFilterusername] = useState('')

  const { data, isLoading, isError, error, isFetching } = useUsers({
    page,
    size: pageSize,
    username: username || undefined
  })

  const handlePaginationChange = ({ page: newPage, pageSize: newPageSize }: { page: number; pageSize: number }) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleSearch = (value: string) => {
    setUsername(value)
  }

  const rows =
    data?.data.map((user) => ({
      id: String(user.id),
      username: user.username,
      roleName: user.roleName,
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
    <>
    <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <Section as="div">
        <Heading>Users Management</Heading>
        <p style={{ marginBottom: '2rem'}}>
          List of registered users in the system
        </p>
        <NewUserModal />
      </Section>
      <div style={{ marginBottom: '2rem' }} />
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <Search
                  closeButtonLabelText='clear search input'
                  id='search-by-name'
                  labelText='search filter by username'
                  type='search'
                  placeholder='filter by username'
                  value={filterusername}
                  onChange={(e) => setFilterusername(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(filterusername)
                    }
                  }}
                  onClear={() => {
                    setFilterusername('')
                    handleSearch('')
                  }}
                />
                <IconButton label='search' onClick={() => {
                  handleSearch(filterusername)
                }}>
                  <SearchIcon />
                </IconButton>
              </TableToolbarContent>
            </TableToolbar>
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
        pageSizes={[10, 20, 30]}
        totalItems={totalItems}
        onChange={handlePaginationChange}
        />
    </div>
    </>
  )
}

export default Users
