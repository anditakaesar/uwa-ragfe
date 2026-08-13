import { Button, Column, Grid } from "@carbon/react"

const Dashboard = () => {
  
  const buttonFullsize = {width: '100%', height: '100%', TextVerticalAlignment: 'center'}
  return (
    <>
    <Grid style={{height: '6rem'}}>
      <Column lg={4}>
        <Button style={buttonFullsize} href="/dashboard/users">Users</Button>
      </Column>
      <Column lg={4}>
        <Button style={buttonFullsize} href="/dashboard/upload-documents">Upload Documents</Button>
      </Column>
      <Column lg={4}>
        <Button style={buttonFullsize} href="/dashboard/upload-images">Upload Images</Button>
      </Column>
      <Column lg={4}>
        <Button style={buttonFullsize} href="/dashboard/auditlogs">Audit Logs</Button>
      </Column>
    </Grid>
    <div style={{marginTop: '2rem'}} />
    <Grid style={{height: '6rem'}}>
      <Column lg={4}>
        <Button style={buttonFullsize} href="/dashboard/users">Users</Button>
      </Column>
      <Column lg={4}>
        <Button style={buttonFullsize} href="/dashboard/playground">Playground</Button>
      </Column>
      <Column lg={4}>
        <Button style={buttonFullsize} href="/dashboard/playground">Next Menu</Button>
      </Column>
      <Column lg={4}>
        <Button style={buttonFullsize} href="/dashboard/playground">Next Feature</Button>
      </Column>
    </Grid>
    </>
  )
}

export default Dashboard