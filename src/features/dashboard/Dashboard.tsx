import { Button, Stack, TextInput } from "@carbon/react"
import { SelectPickField } from "../../components/InputWithButton"
import { useState } from "react"

const Dashboard = () => {
  const [ roleID, setRoleID ] = useState('1')
  return (
    <Stack>
      <SelectPickField value={roleID} id="role-picker" labelText="Role" onSelect={(newID) => {setRoleID(newID)}} hideLabel />
      <div style={{marginBottom: '1rem'}} />
      <TextInput id='some-test-input' labelText='some test' />
      <div style={{marginBottom: '1rem'}} />
      <Button href="/dashboard/users">Users</Button>
    </Stack>
  )
}

export default Dashboard
