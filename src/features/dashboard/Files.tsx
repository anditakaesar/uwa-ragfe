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
  IconButton,
  Modal,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
} from "@carbon/react"
import React, { useState } from "react"
import { useDeleteFile, useFiles, useUploadFile } from "../../hooks/files"
import axios from "axios"
import { fileService } from "../../services/fileService"
import { Download, SettingsView, TrashCan } from "@carbon/icons-react"

const MIME_TO_EXTENSION = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'text/plain': '.txt',
  'text/markdown': '.md',
  'text/csv': '.csv',
  'application/zip': '.zip',
  'application/gzip': '.gz',
  'application/json': '.json',
} as const

export type MimeType = keyof typeof MIME_TO_EXTENSION

const mimeTypesToExtensions = (mimeTypes: MimeType[]): string[] =>
  mimeTypes.map((mimeType) => MIME_TO_EXTENSION[mimeType])

const headers = [
  { key: 'no', header: 'No' },
  { key: 'id', header: 'ID' },
  { key: 'originalName', header: 'Original Name' },
  { key: 'mimeType', header: 'MIME Type' },
  { key: 'sizeHumanize', header: 'Size' },
  { key: 'status', header: 'Status' },
  { key: 'createdAt', header: 'Created At' },
  { key: 'thumbnailURL', header: 'Thumbnail URL' }
]

type FileUploadStatus = "edit" | "complete" | "uploading"

interface RowData {
  no: number
  id: string
  originalName: string
  mimeType: string
  sizeHumanize: string
  thumbnailURL: string
  status: string
  createdAt: string
}

const UploadSection = ({ acceptedMimeTypes }: { acceptedMimeTypes?: MimeType[] }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadErr, setUploadErr] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileStatus, setFileStatus] = useState<FileUploadStatus>('edit')
  const acceptedExtensions = (acceptedMimeTypes && mimeTypesToExtensions(acceptedMimeTypes))

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

  const handleAddFiles = (_: React.SyntheticEvent<HTMLElement, Event>, content: { addedFiles: Array<File & { invalidFileType?: boolean }> }): void => {
    content.addedFiles.forEach((value) => {
      const valid = !acceptedMimeTypes || (acceptedMimeTypes.findIndex((m) => m === value.type) > -1)

      if (!valid) {
        setUploadErr(`Invalid file type: ${value.type}`)
      } else {
        setUploadedFiles([value])
        setFileStatus('edit')
      }
    })
  }

  const handleDeleteFile = () => {
    setUploadErr('')
    setUploadedFiles([])
  }

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <FeatureFlags enableEnhancedFileUploader>
          <FileUploader
            accept={acceptedExtensions}
            buttonKind="primary"
            buttonLabel="Add file"
            filenameStatus={fileStatus}
            iconDescription="Delete file"
            labelDescription={acceptedExtensions ? `${acceptedExtensions?.join(', ')} only` : ''}
            name="fileupload"
            onAddFiles={handleAddFiles}
            onDelete={handleDeleteFile}
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

const Files = ({ mimeTypes, title }: { mimeTypes?: MimeType[], title?: string }) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<RowData | null>(null)
  const [deleteErr, setDeleteErr] = useState('')

  const { mutate } = useDeleteFile()

  const { data, isLoading, isError, error, isFetching } = useFiles({
    mimeTypes: mimeTypes,
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

  const handleDelete = async () => {
    if (rowToDelete) {
      mutate(
        rowToDelete.id,
        {
          onSuccess: () => {
            setConfirmModalOpen(false)
            setRowToDelete(null)
          },
          onError: (error: unknown) => {
            if (axios.isAxiosError(error)) {
              if (error.response) {
                const { data } = error.response
                setDeleteErr(data.error?.message || data.message || 'Delete file failed')
              } else {
                setDeleteErr('Network error or failed to reach upload server')
              }
            } else {
              const err = error as Error
              setDeleteErr(err.message || 'Delete file failed')
            }
          }
        }
      )
    }

  }

  const handleDeleteModal = (fileID: string) => {
    setConfirmModalOpen(true)
    const idx = rows.findIndex(row => row.id == fileID)
    setRowToDelete(rows[idx])
  }

  const handleGenerateThumbnail = async (fileID: string) => {
    await fileService.generateThumbnail(fileID)
  }

  const rows =
    data?.data.map((doc, index) => ({
      no: index + 1 + (page - 1) * pageSize,
      id: doc.id,
      originalName: doc.originalName,
      mimeType: doc.mimeType,
      sizeHumanize: doc.sizeHumanize,
      thumbnailURL: doc.thumbnailURL,
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
      <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s', marginBottom: '2rem' }}>
        <Section as="div">
          <Heading>{title ? title : 'File Management'}</Heading>
          <p style={{ marginBottom: '2rem' }}>
            List of uploaded files in the system
          </p>
        </Section>
        <UploadSection acceptedMimeTypes={mimeTypes} />
        <Callout className={!deleteErr ? 'hidden' : ''}
          aria-label='error while deleting'
          kind='error'
          role='status'
          title='Delete File Error'
          subtitle={deleteErr}
        />
        <div style={{ marginBottom: '2rem' }} />
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getRowProps, getTableProps }) => (
            <TableContainer>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
                    {headers.map((header) => (
                      <TableHeader key={header.key} hidden={header.key === 'thumbnailURL'}>
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

                    const mimeTypeCell = row.cells.find(
                      (cell) => cell.info?.header === 'mimeType' || cell.id.endsWith('mimetype')
                    )

                    const isImage = mimeTypeCell?.value.startsWith('image') ?? false

                    const thumbnailCell = row.cells.find(
                      (cell) => cell.info?.header === 'thumbnailURL' || cell.id.endsWith('thumbnailURL')
                    )

                    const thumbnailURL = thumbnailCell?.value

                    return (
                      <React.Fragment key={row.id}>
                        <TableExpandRow {...rowProps} key={row.id}>
                          {row.cells.map((cell) => (
                            <TableCell key={cell.id} hidden={cell.info.header === 'thumbnailURL'}>{cell.value}</TableCell>
                          ))}
                          <TableCell>
                            <IconButton kind="secondary" size="sm" label="download" onClick={() => handleDownload(row.id)}>
                              <Download />
                            </IconButton>
                            {isImage ? <IconButton kind="secondary" style={{ marginLeft: '0.25rem' }} size="sm" label="generate-thumbnail" onClick={() => { handleGenerateThumbnail(row.id) }}>
                              <SettingsView />
                            </IconButton> : ''}
                            <IconButton kind="secondary" style={{ marginLeft: '0.25rem' }} size="sm" label="delete" onClick={() => handleDeleteModal(row.id)}>
                              <TrashCan />
                            </IconButton>
                          </TableCell>
                        </TableExpandRow>

                        {row.isExpanded && (
                          <TableExpandedRow colSpan={headers.length + 2}>
                            <strong>Extended Description: </strong>
                            {isImage ? <img
                              src={thumbnailURL}
                              alt="Thumbnail"
                              style={{ maxHeight: '25rem', display: 'block', marginTop: '0.5rem', borderRadius: '4px' }}
                            /> : ''}
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
      <Modal
        danger
        modalHeading="Are you sure you want to delete this file?"
        modalLabel="File resources"
        onRequestClose={() => setConfirmModalOpen(false)}
        onRequestSubmit={handleDelete}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        open={confirmModalOpen}
      >
        <p>
          {rowToDelete?.id}: {rowToDelete?.originalName}
          <img
            src={rowToDelete?.thumbnailURL}
            alt="Thumbnail"
            style={{ maxHeight: '10rem', display: 'block', marginTop: '0.5rem', borderRadius: '4px' }}
          />
        </p>
      </Modal>
    </>
  )
}

export default Files