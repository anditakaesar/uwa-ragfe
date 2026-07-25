import { Button, Stack, TextInput } from "@carbon/react"
import { InputWithButton } from "../../components/InputWithButton"

const Dashboard = () => {
  return (
    <Stack>
      <InputWithButton id="role-picker" labelText="Role" />
      <div style={{marginBottom: '1rem'}} />
      <TextInput id='some-test-input' labelText='some test' />
      <div style={{marginBottom: '1rem'}} />
      <Button href="/dashboard/users">Users</Button>
    </Stack>
  )
}

export default Dashboard
