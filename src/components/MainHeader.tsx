import { Logout, Notification, UserProfile } from "@carbon/icons-react"
import {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
   HeaderName,
  MenuButton, MenuItem,
} from "@carbon/react"
import { useAuth } from "../hooks/useAuth"
import { useProfile } from "../hooks/useProfile"

const MainHeader = () => {
  const { logout } = useAuth()
  const { data: profile, isLoading: profileLoading, isError } = useProfile()

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
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="Uwa Go Rag">
          <HeaderMenuButton
            aria-label="Open menu"
            onClick={onClickSideNavExpand}
            isActive={isSideNavExpanded} />
          <HeaderName href="/" prefix="UWA">
            Go Rag
          </HeaderName>
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
                <MenuItem label="My Profile" renderIcon={() => <UserProfile />} />
              <MenuItem label="Sign Out" kind="danger" onClick={logout} renderIcon={() => <Logout />} />
            </MenuButton>
          </HeaderGlobalBar>
        </Header>
    )}
    />
  )
}

export default MainHeader
