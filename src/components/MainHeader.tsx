import { Fade, Logout, Notification, UserProfile } from "@carbon/icons-react"
import {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
   HeaderMenuItem,
   HeaderName,
  HeaderNavigation,
  HeaderSideNavItems,
  MenuButton, MenuItem,
  SideNav,
  SideNavItems,
  SkipToContent,
} from "@carbon/react"
import { useAuth } from "../hooks/useAuth"
import { useProfile } from "../hooks/useProfile"
import { useNavigate } from "react-router-dom"

const MainHeader = () => {
  const { logout } = useAuth()
  const { data: profile, isLoading: profileLoading, isError } = useProfile()

  const navigate = useNavigate()

  function returnName() : string {
    if (profileLoading) {
      return "Loading username..."
    }

    if (isError) {
      return "Error loading profile!"
    }

    if (profile) {
      return `Hello, ${profile.username}!`
    }

    return ""
  }

  return (
    <HeaderContainer
      render={() => (
        <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <Header aria-label="Header">
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName href="/" prefix="UWA">
              Go Rag
            </HeaderName>
            <HeaderNavigation aria-label="Header">
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
              <MenuButton
                label={returnName()} // change into username?
                className="action-icons">
                <MenuItem label="My Profile" renderIcon={() => <UserProfile />} onClick={() => {
                  navigate('/profile')
                }} />
                <MenuItem label="Sign Out" kind="danger" onClick={logout} renderIcon={() => <Logout />} />
              </MenuButton>
            </HeaderGlobalBar>
          </Header>
        )}
      />
    )}
    />
  )
}

export default MainHeader
