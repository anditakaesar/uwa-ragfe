import type { ReactNode } from "react";
import MainHeader from "../components/MainHeader";
import { Content, Theme } from "@carbon/react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Theme theme="g100">
        <MainHeader />
      </Theme>
      <Content>
        {children}
      </Content>
    </>
  )
}

export default MainLayout
