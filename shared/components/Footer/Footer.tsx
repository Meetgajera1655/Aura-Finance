import React from 'react'
import { Link } from 'react-router-dom'
import LogoIcon from '../LogoIcon';

const Footer: React.FC = () => {
  return (
    <>
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-screen-lg">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="flex items-center space-x-2">
                <LogoIcon className="w-10 h-10" />
                <div className="flex items-baseline font-bold text-xl">
                  <span className="text-2xl font-bold text-[#0F172A] dark:text-white tracking-tighter">AURA</span>
                  <span className="text-2xl font-light text-[#F59E0B] ml-0.5">FINANCE</span>
                </div>
              </div>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6">
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                Blog
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                Support
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
            </nav>
            <div className="text-sm text-muted-foreground">© 2026 AuraFinance. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
