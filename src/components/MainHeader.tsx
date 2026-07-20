import { Logout, Notification, UserProfile } from "@carbon/icons-react"
import {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
   HeaderName,
  MenuButton, MenuItem, SkipToContent
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
              label="Hello, User!" // change into username?
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
