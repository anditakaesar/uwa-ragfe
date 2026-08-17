import { Button, Column, Grid } from "@carbon/react"
import './dashboard.scss'
import { Card } from "@carbon/react/lib/components/Card"
import { useUsers } from "../../hooks/users"
import { useFiles } from "../../hooks/files"

const Dashboard = () => {
  const buttonFullsize = { width: '100%', height: '100%', TextVerticalAlignment: 'center' }

  const { data: userData } = useUsers({
    page: 1,
    size: 1
  })

  const { data: docData } = useFiles({
    mimeTypes: [
      'text/markdown',
    ]
  })

  const { data: imageData } = useFiles({
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg',
      'image/webp',
      'image/bmp',
      'image/svg+xml',
    ]
  })

  return (
    <>
      <Grid withRowGap>
        <Column sm={1} md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Registered Users</Card.Title>
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', alignContent: 'end' }}>
                <p style={{ fontSize: '4rem' }}>{userData?.meta.pagination.total}</p>
              </div>

            </Card.Body>
            <Card.Footer>
              <Button kind='tertiary' size="md" href="/dashboard/users">Users</Button>
            </Card.Footer>
          </Card>
        </Column>

        <Column sm={1} md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Uploaded Documents</Card.Title>
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', alignContent: 'end' }}>
                <p style={{ fontSize: '4rem' }}>{docData?.meta.pagination.total}</p>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button kind='tertiary' size="md" href="/dashboard/upload-documents">Upload Documents</Button>
            </Card.Footer>
          </Card>
        </Column>

        <Column sm={1} md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Uploaded Images</Card.Title>
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', alignContent: 'end' }}>
                <p style={{ fontSize: '4rem' }}>{imageData?.meta.pagination.total}</p>
              </div>

            </Card.Body>
            <Card.Footer>
              <Button kind='tertiary' size="md" href="/dashboard/upload-images">Upload Images</Button>
            </Card.Footer>
          </Card>
        </Column>

        <Column sm={1} md={4}>
          <Card>
            <Card.Header>
              <Card.Title>Unanswered FAQ</Card.Title>
            </Card.Header>
            <Card.Body>
              <p>Number: 3</p>
            </Card.Body>
            <Card.Footer>
              <Button kind='tertiary' style={buttonFullsize} href="/dashboard/faqs">Open FAQ List</Button>
            </Card.Footer>
          </Card>
        </Column>
      </Grid>
      <div style={{ marginBottom: '2rem' }} />

      <Grid>
        <Column lg={4}>
          <div className="menu-title">Resources</div>
          <ul className="menu-item">
            <li><Button kind='ghost' style={buttonFullsize} href="/dashboard/users">Users</Button></li>
            <li><Button kind='ghost' style={buttonFullsize} href="/dashboard/faqs">FAQ List</Button></li>
          </ul>
        </Column>
        <Column lg={4}>
          <div className="menu-title">Files</div>
          <ul className="menu-item">
            <li><Button kind='ghost' style={buttonFullsize} href="/dashboard/upload-documents">Upload Documents</Button></li>
            <li><Button kind='ghost' style={buttonFullsize} href="/dashboard/upload-images">Upload Images</Button></li>
          </ul>
        </Column>
        <Column lg={4}>
          <div className="menu-title">Logs</div>
          <ul className="menu-item">
            <li><Button kind='ghost' style={buttonFullsize} href="/dashboard/auditlogs">Audit Logs</Button></li>
          </ul>
        </Column>
        <Column lg={4}>
          <div className="menu-title">Others</div>
          <ul className="menu-item">
            <li><Button kind='ghost' style={buttonFullsize} href="/dashboard/playground">Playground</Button></li>
          </ul>
        </Column>
      </Grid>

    </>
  )
}

export default Dashboard