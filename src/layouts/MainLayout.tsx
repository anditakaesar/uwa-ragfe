import type { ReactNode } from "react";
import MainHeader from "../components/MainHeader";
import { Breadcrumb, BreadcrumbItem, Content } from "@carbon/react";
import { Link, useLocation } from "react-router-dom";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const formatSegment = (segment: string): string => {
    return segment.replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const location = useLocation()

  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <>
      <MainHeader />
      <Content className='app-content'>
        <Breadcrumb noTrailingSlash aria-label="Page navigation" style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>

          {pathnames.map((value, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
            const isLast = index === pathnames.length - 1

            return (
                <BreadcrumbItem key={routeTo} isCurrentPage={isLast}>
                  {isLast ? (
                    <span>{formatSegment(value)}</span>
                  ) : (
                    <Link to={routeTo}>{formatSegment(value)}</Link>
                  )}
                </BreadcrumbItem>
              )
            })
          }
        </Breadcrumb>
        {children}
      </Content>
    </>
  )
}

export default MainLayout
