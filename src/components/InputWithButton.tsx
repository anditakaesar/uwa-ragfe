import { OverflowMenuHorizontal, Search, TextClearFormat } from "@carbon/icons-react";
import { DataTable, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TableSelectRow, TableToolbar, TableToolbarContent, TextInput, type DataTableRow } from "@carbon/react";
import { useState } from "react";

interface SelectPickFieldParam {
  id: string
  labelText: string
  placeholder?: string
  value: string
  onSelect: (newID: string) => void
  buttonLabel?: string
  hideLabel?: boolean
}

export const SelectPickField: React.FC<SelectPickFieldParam> = ({
  id,
  labelText,
  placeholder = 'Put ID...',
  value,
  buttonLabel = 'Search Param',
  hideLabel = false,
  onSelect: onSubmit
}) => {
  const [ modalOpen, setModalOpen ] = useState(false)
  const [ valueDesc, setValueDesc ] = useState('')
  const [ selected, setSelected ] = useState('')
  const [ selectedDesc, setSelectedDesc ] = useState('')
  const [ filterNameOrID, setFilterNameOrID ] = useState('')

  const headers = [
    {
      key: 'id',
      header: 'ID',
    },
    {
      key: 'description',
      header: 'Description'
    }
  ]
  const rows = [
    { id: '1', description: 'One' },
    { id: '2', description: 'Two' },
    { id: '3', description: 'Three' },
  ]

  const onSelectHandler = (row: DataTableRow<any[]>) => {
    setSelected(row.id)
    setSelectedDesc(row.cells[1].value)
  }

  // initial state?
  // search state
  return (
    <>
    <Modal open={modalOpen} 
      onRequestClose={() => setModalOpen(false)} 
      primaryButtonText="Select" 
      secondaryButtonText="Cancel"
      onRequestSubmit={() => {
        onSubmit(selected)
        setValueDesc(selectedDesc)
        setModalOpen(false)
      }}
    >
      <div style={{marginTop: '1.5rem'}}>
        <DataTable rows={rows} headers={headers} radio>
          {({
            rows, headers, getSelectionProps, getTableProps,
          }) => (
            <TableContainer>
              <TableToolbar>
              <TableToolbarContent>
                <TextInput 
                id='name-id-like-input' 
                labelText='id or name like' hideLabel 
                placeholder='filter by id or name'
                value={filterNameOrID}
                onChange={(e) => setFilterNameOrID(e.target.value)}
                />
                <IconButton label='search' onClick={() => {
                  // handleSearch(filterusername)
                }}>
                  <Search />
                </IconButton>
                <IconButton label='clear' onClick={() => {
                  // setFilterusername('')
                  // handleSearch('')
                }}>
                  <TextClearFormat />
                </IconButton>
              </TableToolbarContent>
            </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableHeader />
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
                      <TableSelectRow {...getSelectionProps({ row })} onChange={() => onSelectHandler(row)} />
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
      </div>
    </Modal>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignContent: 'center',
          borderRadius: '0px',
        }}
      >
        <div style={{
          flex: '0 0 10rem',
        }}>
          <TextInput
            id={id}
            labelText={labelText}
            hideLabel={hideLabel}
            placeholder={placeholder}
            value={value}
            // on blur here
          />
        </div>
        
        <IconButton
          label={buttonLabel}
          size="md"
          onClick={() => {setModalOpen(true)}} // open modal
          style={{
            display: 'flex',
            marginTop: hideLabel ? '' : '1.5rem'
          }}
        >
          <OverflowMenuHorizontal />
        </IconButton>
        
        <div style={{alignSelf: 'center', marginLeft: '1rem', marginTop: hideLabel ? '' : '1.5rem'}}>
          {valueDesc}
        </div>
      </div>
    </div>
    </>
  )
}