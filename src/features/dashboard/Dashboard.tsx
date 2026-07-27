import { Button, ComboBox, Stack, TextInput } from "@carbon/react"
import { SelectPickField } from "../../components/InputWithButton"
import { useState } from "react"

interface DropdownItem {
  id: string
  label: string
}

const Dashboard = () => {
  const [ roleID, setRoleID ] = useState('1')
  const [ selectedItem, setSelectedItem ] = useState<DropdownItem | null>()
  const [ typedInput, setTypedInput] = useState('')

  const items: DropdownItem[] = [
    {
      id: '1',
      label: 'Option One',
    },
    {
      id: '2',
      label: 'Option Two',
    },
    {
      id: 'e',
      label: 'Option Three',
    }
  ]

  return (
    <Stack>
      <SelectPickField value={roleID} 
        id="role-picker" labelText="Role" 
        onSelect={(newID) => {setRoleID(newID)}} hideLabel />
      <div style={{marginBottom: '1rem', marginTop: '1rem', width: '50%'}}>
        <p style={{marginTop: '1rem'}}>
          Typed Result: {typedInput}
        </p>
        <ComboBox id="role-picker-dropdown" 
          items={items} 
          titleText="type"
          onInputChange={(txt) => setTypedInput(txt)}
          onChange={(data) => setSelectedItem(data.selectedItem)} />
        <p style={{marginTop: '1rem'}}>
          {selectedItem?.id} - {selectedItem?.label}
        </p>
        
      </div>
      <div style={{marginBottom: '1rem'}} />
      <TextInput id='some-test-input' labelText='some test' />
      <div style={{marginBottom: '1rem'}} />
      <Button href="/dashboard/users">Users</Button>
    </Stack>
  )
}

export default Dashboard
