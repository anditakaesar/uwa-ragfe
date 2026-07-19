import { Column, Grid } from "@carbon/react"

const Dashboard = () => {
  return (
    <Grid className="landing-page" fullWidth>
      <Column lg={16} md={8} sm={4} className="landing-page__banner">
        1
      </Column>
      <Column lg={16} md={8} sm={4} className="landing-page__r2">
        <Grid className="tabs-group-content">
          <Column md={4} lg={7} sm={4} className="landing-page__tab-content">
            7/16
          </Column>
          <Column md={4} lg={{ span: 8, offset: 8 }} sm={4}>
            8/16
          </Column>
        </Grid>
      </Column>
      <Column lg={16} md={8} sm={4} className="landing-page__r3">
        <Grid>
          <Column md={4} lg={4} sm={4}>
            1/4
          </Column>
          <Column md={4} lg={4} sm={4}>
            1/4
          </Column>
          <Column md={4} lg={4} sm={4}>
            1/4
          </Column>
          <Column md={4} lg={4} sm={4}>
            1/4
          </Column>
        </Grid>
      </Column>
    </Grid>
  )
}

export default Dashboard
