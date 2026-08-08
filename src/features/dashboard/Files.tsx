import {
  DataTable,
  DataTableSkeleton,
  FileUploader,
  Heading,
  InlineNotification,
  Pagination,
  Section,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Callout,
  Button,
  ProgressBar,
  FeatureFlags,
} from "@carbon/react"
import { useState } from "react"
import { useFiles, useUploadFile } from "../../hooks/files"
import axios from "axios"
import { fileService } from "../../services/fileService"
import { Download } from "@carbon/icons-react"

const headers = [
  { key: 'no', header: 'No' },
  { key: 'id', header: 'ID' },
  { key: 'originalName', header: 'Original Name' },
  { key: 'mimeType', header: 'MIME Type' },
  { key: 'sizeHumanize', header: 'Size' },
  { key: 'status', header: 'Status' },
  { key: 'createdAt', header: 'Created At' }
]

type FileUploadStatus = "edit" | "complete" | "uploading"

const UploadSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadErr, setUploadErr] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileStatus, setFileStatus] = useState<FileUploadStatus>('edit')

  const { mutate, isPending } = useUploadFile()

  const handleUpload = () => {
    if (uploadedFiles.length !== 0) {
      setUploadErr('')
      setUploadProgress(0)
      setFileStatus('uploading')

      mutate(
        {
          file: uploadedFiles[0],
          onProgress: (percentage) => {
            setUploadProgress(percentage)
          }
        },
        {
          onSuccess: () => {
            setUploadedFiles([])
            setUploadProgress(0)
            setUploadErr('')
            setFileStatus('complete')
          },
          onError: (error: unknown) => {
            if (axios.isAxiosError(error)) {
              if (error.response) {
                const { data } = error.response
                setUploadErr(data.error?.message || data.message || 'Upload file failed')
              } else {
                setUploadErr('Network error or failed to reach upload server')
              }
            } else {
              const err = error as Error
              setUploadErr(err.message || 'Upload file failed')
            }
            setFileStatus('edit')
          }
        }
      )
    }
  }

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <FeatureFlags enableEnhancedFileUploader>
          <FileUploader
            accept={[
              '.jpg',
              '.png'
            ]}
            buttonKind="primary"
            buttonLabel="Add file"
            filenameStatus={fileStatus}
            iconDescription="Delete file"
            labelDescription="JPG or PNG only"
            name="fileupload"
            onAddFiles={(_, content) => {
              content.addedFiles.forEach((value) => {
                setUploadedFiles([value])
              })
              setFileStatus('edit')
            }}
            size="md"

            disabled={uploadedFiles.length !== 0 || isPending}
          />
        </FeatureFlags>
      </div>
      <span className={uploadedFiles.length === 0 ? 'hidden' : ''}>
        <Button kind="primary" onClick={handleUpload} disabled={isPending}>
          {isPending ? 'Uploading...' : 'Upload'}
        </Button>
      </span>
      {isPending && (
        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <ProgressBar label="Uploading file..." value={uploadProgress} max={100} helperText={`${uploadProgress}% completed`} />
        </div>
      )}
      <Callout className={!uploadErr ? 'hidden' : ''}
        aria-label='error while uploading'
        kind='error'
        role='status'
        title='Upload File Error'
        subtitle={uploadErr}
      />
    </>
  )
}

const Files = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading, isError, error, isFetching } = useFiles({
    page,
    size: pageSize,
  })

  const handlePaginationChange = ({ page: newPage, pageSize: newPageSize }: { page: number, pageSize: number }) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  const handleDownload = async (fileID: string) => {
    const response = await fileService.getDownloadLink(fileID)
    window.open(response.data, '_blank', 'noopener,noreferrer');
  };

  const rows =
    data?.data.map((doc, index) => ({
      no: index + 1 + (page - 1) * pageSize,
      id: doc.id,
      originalName: doc.originalName,
      mimeType: doc.mimeType,
      sizeHumanize: doc.sizeHumanize,
      status: doc.status,
      createdAt: new Date(doc.createdAt).toLocaleString()
    })) || []

  const totalItems = data?.meta.pagination.total || 0

  if (isLoading) {
    return <DataTableSkeleton headers={headers} rowCount={pageSize} columnCount={4} />
  }

  if (isError) {
    return (
      <InlineNotification
        kind="error"
        title="Failed to fetch files"
        subtitle={error instanceof Error ? error.message : 'An unexpected error occurred'}
      />
    )
  }

  return (
    <>
      <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
        <Section as="div">
          <Heading>Files Management</Heading>
          <p style={{ marginBottom: '2rem' }}>
            List of uploaded files in the system
          </p>
        </Section>
        <UploadSection />
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
                    <TableHeader>
                      Action
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                      <TableCell>
                        <Button kind="secondary" size="sm" renderIcon={Download} onClick={() => handleDownload(row.id)}>Download</Button>
                      </TableCell>
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

export default Files