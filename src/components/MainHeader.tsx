import { Logout, Notification, UserAvatar } from "@carbon/icons-react"
import {
  Button,
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderMenuItem, HeaderName,
  HeaderNavigation, HeaderSideNavItems, SideNav, SideNavItems, SkipToContent
} from "@carbon/react"
import { useAuth } from "../hooks/useAuth"

const MainHeader = () => {
  const { logout } = useAuth()

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Uwa Go Rag">
          <SkipToContent />
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded} />
          <HeaderName href="/" prefix="UWA">
            Uwa Go Rag
          </HeaderName>
          <HeaderNavigation>
            <HeaderMenuItem href="/dashboard">Dashboard</HeaderMenuItem>
          </HeaderNavigation>
          <SideNav
            aria-label="Side navigation"
            expanded={isSideNavExpanded}
            isPersistent={false}>
            <SideNavItems>
              <HeaderSideNavItems>
                <HeaderMenuItem href="/dashboard">Dashboard</HeaderMenuItem>
              </HeaderSideNavItems>
            </SideNavItems>
          </SideNav>
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Notifications"
              tooltipAlignment="center"
              className="action-icons">
              <Notification size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="User Avatar"
              tooltipAlignment="center"
              className="action-icons">
              <UserAvatar size={20} />
            </HeaderGlobalAction>
            <Button kind="danger" type="button" onClick={logout}>
              <Logout /> {"Sign Out"}
            </Button>
          </HeaderGlobalBar>
        </Header>
    )}
    />
  )
}

export default MainHeader
