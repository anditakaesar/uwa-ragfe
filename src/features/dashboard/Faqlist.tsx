import React, { useState } from "react"
import { useFAQs } from "../../hooks/faqs"
import { DataTable, DataTableSkeleton, Heading, InlineNotification, Pagination, Section, Table, TableBody, TableCell, TableContainer, TableExpandedRow, TableExpandHeader, TableExpandRow, TableHead, TableHeader, TableRow } from "@carbon/react"

const headers = [
  { key: 'no', header: 'No' },
  { key: 'id', header: 'ID' },
  { key: 'status', header: 'Status' },
  { key: 'answer', header: 'Answer' },
  { key: 'createdAt', header: 'Created At' },
]

export const Faqlist = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading, isError, error, isFetching } = useFAQs({
    page,
    size: pageSize,
  })

  const handlePaginationChange = ({ page: newPage, pageSize: newPageSize }: { page: number, pageSize: number }) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const rows =
    data?.data.map((faq, idx) => ({
      no: idx + 1 + (page - 1) * pageSize,
      id: faq.id,
      status: faq.status,
      answer: faq.answer,
      createdAt: new Date(faq.createdAt).toLocaleString(),
    })) || []

  const totalItems = data?.meta.pagination.total || 0

  if (isLoading) {
    return <DataTableSkeleton headers={headers} rowCount={pageSize} columnCount={4} />
  }

  if (isError) {
    return <InlineNotification
      kind="error"
      title="Failed to fetch FAQs"
      subtitle={error instanceof Error ? error.message : 'An unexpected error occured'}
    />
  }

  return (
    <>
      <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s', marginBottom: '2rem' }}>
        <Section as="div">
          <Heading>FAQs Management</Heading>
          <p style={{ marginBottom: '2rem' }}>
            List of FAQs from user chat
          </p>
        </Section>
        <div style={{ marginBottom: '2rem' }} />
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getRowProps, getTableProps }) => (
            <TableContainer>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
                    {headers.map((header) => (
                      <TableHeader key={header.key} hidden={header.key === 'answer'}>
                        {header.header}
                      </TableHeader>
                    ))}
                    <TableHeader>
                      Action
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const rowProps = getRowProps({ row })

                    const answerCell = row.cells.find(
                      (cell) => cell.info?.header === 'answer' || cell.id.endsWith('answer')
                    )

                    return (
                      <React.Fragment key={row.id}>
                        <TableExpandRow {...rowProps} key={row.id}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id} hidden={cell.info.header === 'answer'}>{cell.value}</TableCell>
                          ))}
                          <TableCell>
                            Action Here
                          </TableCell>
                        </TableExpandRow>

                        {row.isExpanded && (
                          <TableExpandedRow colSpan={headers.length + 2}>
                            <strong>Answer:<br /></strong>
                            {answerCell?.value}
                          </TableExpandedRow>
                        )}
                      </React.Fragment>
                    )
                  })}
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