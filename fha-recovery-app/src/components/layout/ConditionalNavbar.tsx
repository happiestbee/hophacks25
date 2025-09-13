'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Hide navbar on these routes
  const hideNavbarRoutes = ['/', '/login', '/signup']
  
  // Check if current path should hide navbar
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname)
  
  if (shouldHideNavbar) {
    return null
  }
  
  return <Navbar />
}
