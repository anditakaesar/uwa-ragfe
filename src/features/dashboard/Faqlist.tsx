import React, { useState } from "react"
import { useDeleteFAQ, useFAQs, useUpdateFAQ } from "../../hooks/faqs"
import { DataTable, DataTableSkeleton, Heading, IconButton, InlineNotification, Pagination, Section, Table, TableBody, TableCell, TableContainer, TableExpandedRow, TableExpandHeader, TableExpandRow, TableHead, TableHeader, TableRow } from "@carbon/react"
import { CheckmarkFilled, InformationDisabled, TrashCan } from "@carbon/icons-react"
import './faqlist.scss'
import { FAQAnswerRow } from "../../components/FAQAnswerRow"
import axios from "axios"

const headers = [
  { key: 'no', header: 'No' },
  { key: 'id', header: 'ID' },
  { key: 'status', header: 'Status' },
  { key: 'question', header: 'Question' },
  { key: 'answer', header: 'Answer' },
  { key: 'createdAt', header: 'Created At' },
]

export interface FaqRow {
  no: number
  id: string
  status: string
  question: string
  answer: string
  createdAt: string
}

export const Faqlist = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading, isError, error, isFetching } = useFAQs({
    page,
    size: pageSize,
  })

  const { mutate: deleteMutate } = useDeleteFAQ()
  const { mutate: updateMutate } = useUpdateFAQ()

  const handlePaginationChange = ({ page: newPage, pageSize: newPageSize }: { page: number, pageSize: number }) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleDelete = (id: string) => {
    deleteMutate(
      id,
      {
        onSuccess: () => {},
        onError: (error: unknown) => {
           if (axios.isAxiosError(error)) {
              if (error.response) {
                const { data } = error.response
                console.log(data.error?.message || data.message || 'Delete FAQ failed')
              } else {
                console.log('Network error or failed to reach upload server')
              }
            } else {
              const err = error as Error
              console.log(err.message || 'Upload file failed')
            }
        }
      }
    )
  }

  const handleUpdateStatus = (id: string, status: string) => {
    updateMutate(
      {
        id: id,
        status: status
      },
      {
        onSuccess: () => {},
        onError: (error: unknown) => {
           if (axios.isAxiosError(error)) {
              if (error.response) {
                const { data } = error.response
                console.log(data.error?.message || data.message || 'Delete FAQ failed')
              } else {
                console.log('Network error or failed to reach upload server')
              }
            } else {
              const err = error as Error
              console.log(err.message || 'Upload file failed')
            }
        }
      }
    )
  }

  const dataRows =
    data?.data.map((faq, idx) => ({
      no: idx + 1 + (page - 1) * pageSize,
      id: faq.id,
      status: faq.status,
      question: faq.question,
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
        <DataTable rows={dataRows} headers={headers}>
          {({ rows, headers, getRowProps, getTableProps }) => (
            <TableContainer>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
                    {headers.map((header) => (
                      <TableHeader key={header.key} hidden={header.key === 'answer' || header.key === 'id'}>
                        {header.header}
                      </TableHeader>
                    ))}
                    <TableHeader>
                      Action
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, idx) => {
                    const rowProps = getRowProps({ row })

                    const statusCell = row.cells.find(
                      (cell) => cell.info?.header === 'status' || cell.id.endsWith('status')
                    )

                    const statusValue = statusCell?.value

                    return (
                      <React.Fragment key={row.id}>
                        <TableExpandRow {...rowProps} key={row.id}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id} hidden={cell.info.header === 'answer' || cell.info.header === 'id'}>{cell.value}</TableCell>
                          ))}
                          <TableCell>
                            {statusValue === 'dismissed' ? <IconButton kind="secondary" style={{ marginLeft: '0.25rem' }} size="sm" label="enable-question" onClick={() => {
                              handleUpdateStatus(row.id, 'unanswered')
                            }}>
                              <CheckmarkFilled />
                            </IconButton> : <IconButton kind="secondary" style={{ marginLeft: '0.25rem' }} size="sm" label="disable-question" onClick={() => handleUpdateStatus(row.id, 'dismissed')}>
                              <InformationDisabled />
                            </IconButton>}

                            <IconButton kind="secondary" style={{ marginLeft: '0.25rem' }} size="sm" label="delete" onClick={() => handleDelete(row.id)}>
                              <TrashCan />
                            </IconButton>
                          </TableCell>
                        </TableExpandRow>

                        {row.isExpanded && (
                          <TableExpandedRow colSpan={headers.length + 2}>
                            <FAQAnswerRow faq={dataRows[idx]} />
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