import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: IndexRoot,
})

function IndexRoot() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}
