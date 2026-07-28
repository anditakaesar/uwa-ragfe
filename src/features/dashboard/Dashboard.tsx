import { Button, ComboBox, Stack, TextInput } from "@carbon/react"
import { SelectPickField } from "../../components/InputWithButton"
import { useState } from "react"
import { type DropdownItem } from "../../types/dropdownItem"

const Dashboard = () => {
  const [ roleID, setRoleID ] = useState('1')
  const [ roleValue, setRoleValue ] = useState<DropdownItem | null | undefined>({ id: '2', label: 'Option Two'}) // initialized value
  const [ roleInputSearch, setRoleInputSearch] = useState('')

  // pull data from hook, transform into DropdownItem[]
  const items: DropdownItem[] | null = [
    {
      id: '1',
      label: 'Option One',
    },
    {
      id: '2',
      label: 'Option Two',
    },
    {
      id: '3',
      label: 'Option Three',
    }
  ]

  return (
    <Stack>
      <SelectPickField value={roleID} 
        id="role-picker" labelText="Role" 
        onSelect={(newID) => {setRoleID(newID)}} hideLabel />
      
      <div style={{marginBottom: '1rem', marginTop: '1rem', width: '50%'}}>
        <p style={{marginBottom: '1rem'}}>
          Selected Item: {roleValue !== null ? `${roleValue?.id} - ${roleValue?.label}` : ''}<br />
          Input search: {roleInputSearch}
        </p>

        <ComboBox id="role-select"
          placeholder="select a role..."
          items={items}
          onInputChange={(txt) => setRoleInputSearch(txt)} // use this to capture typing
          itemToString={(item) => (item ? item.label : '')}
          selectedItem={roleValue}
          onChange={({selectedItem: newSelection}) => {
            setRoleValue(newSelection)
          }}
        />
      </div>

      <div style={{marginBottom: '1rem'}} />
      <TextInput id='some-test-input' labelText='some test' />
      <div style={{marginBottom: '1rem'}} />
      <Button href="/dashboard/users">Users</Button>
    </Stack>
  )
}

export default Dashboard
