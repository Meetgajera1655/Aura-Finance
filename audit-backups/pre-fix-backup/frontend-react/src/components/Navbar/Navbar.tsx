import React from "react";
import { Button } from "@/components/ui/button";
import { Crown, User, LogOut, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/auth/authSlice";
import MainTicker from "../Ticker/MainTicker";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import { ModeToggle } from "@/components/mode-toggle";
import LogoIcon from "../LogoIcon";
import { useTheme } from "@/components/theme-provider";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Function to close the mobile sheet when navigating
  const handleMobileNavigation = () => {
    setIsSheetOpen(false);
  };

  // Function to handle logo click - navigate to homepage
  const handleLogoClick = () => {
    navigate('/');
  };

  const getUserName = () => {
    if (!user) return "Unknown User";
    if (user.username) return user.username;
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    if (typeof user === "string") return user;
    return "User";
  };

  // Shared hover style for desktop nav links:
  // - inline-flex limits underline to text width
  // - after pseudo adds animated underline without layout shift
  // - uniform timing/colors for both themes
  const navLink =
    "relative inline-flex items-center font-medium " +
    "text-gray-700 dark:text-gray-300 " +
    "transition-colors duration-200 ease-out " +
    "hover:text-gray-900 dark:hover:text-white " +
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 " +
    "after:bg-current after:transition-all after:duration-200 hover:after:w-full";

  return (
    <div className="flex flex-col justify-center items-center">
      <nav className="bg-white dark:bg-black shadow-md w-full">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo - Clickable and navigates to homepage */}
          <div
            className="flex items-center space-x-4 cursor-pointer transition-opacity hover:opacity-80"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
            aria-label="Go to homepage"
          >
            <div className="flex items-center space-x-2">
              <LogoIcon className="w-10 h-10" />
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-[#0F172A] dark:text-white tracking-tighter">AURA</span>
                <span className="text-2xl font-light text-[#F59E0B] ml-0.5">FINANCE</span>
              </div>
            </div>
          </div>

          {/* Desktop navigation with standardized hover */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Removed hover:font-bold to avoid size shift; underline and color now consistent */}
            <Link to="/" className={navLink}>Home</Link>
            <Link to="/dashboard" className={navLink}>Dashboard</Link>
            <Link to="/News" className={navLink}>News</Link>
            <Link to="/About" className={navLink}>About</Link>
            <Link to="/Premium" className={navLink}>
              Premium <Crown className="ml-1 h-4 w-4 text-yellow-500" />
            </Link>
            <Link to="/Pricing" className={navLink}>Pricing</Link>
            <Link to="/Community" className={navLink}>Community</Link>
            <Link to="/faq" className={navLink}>FAQ</Link>
            <Link to="/feedback" className={navLink}>Feedback</Link>
          </div>

          {/* Auth actions (desktop) */}
          {!isLoggedIn && (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
              <ModeToggle />
            </div>
          )}

          {/* Logged-in user menu (Unified for Desktop and Mobile) */}
          {isLoggedIn && user && (
            <div className="flex items-center gap-2 sm:gap-4 ml-auto md:ml-0 mt-2 sm:mt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div 
                    role="button" 
                    className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50 rounded-full p-1 pr-4 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <UserAvatar />
                    <div className="hidden sm:flex flex-col items-start justify-center mr-1">
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold leading-none mb-0.5">Welcome</span>
                      <span className="text-sm font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-none group-hover:from-blue-600 group-hover:to-purple-600 transition-colors duration-300">
                        {getUserName()}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-4 mt-2 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                  <div className="pb-3 mb-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="font-semibold text-gray-800 dark:text-white text-lg">{getUserName()}</div>
                    <div className="text-sm text-green-500 flex items-center font-medium mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div> Active now
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer py-3 px-2 my-1 flex items-center rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <User className="mr-3 h-5 w-5 text-blue-500" /> <span className="font-medium text-gray-700 dark:text-gray-200">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer py-3 px-2 my-1 flex items-center rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span className="font-medium text-gray-700 dark:text-gray-200">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(logout());
                      navigate("/login");
                    }}
                    className="cursor-pointer py-3 px-2 my-1 flex items-center rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                  >
                    <LogOut className="mr-3 h-5 w-5" /> <span className="font-medium">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="hidden md:block">
                <ModeToggle />
              </div>
            </div>
          )}

          {/* Mobile: Sheet-trigger */}
          <div className="md:hidden flex items-center ml-2">
            {!isLoggedIn && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col space-y-4 mt-4">
                    <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={handleMobileNavigation}>Home</Link>
                    <Link to="/Features" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={handleMobileNavigation}>Features</Link>
                    <Link to="/About" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={handleMobileNavigation}>About</Link>
                    <Link to="/Premium" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center" onClick={handleMobileNavigation}>
                      Premium <Crown className="ml-1 h-4 w-4 text-yellow-500" />
                    </Link>
                    <Link to="/Pricing" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center" onClick={handleMobileNavigation}>Pricing</Link>
                    <Link to="/faq" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center" onClick={handleMobileNavigation}>FAQ</Link>
                    <Link to="/feedback" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center" onClick={handleMobileNavigation}>Feedback</Link>
                    <Link to="/Login" onClick={handleMobileNavigation}>
                      <Button variant="outline">Log In</Button>
                    </Link>
                    <Link to="/SignUp" onClick={handleMobileNavigation}>
                      <Button>Sign Up</Button>
                    </Link>
                    <ModeToggle />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {isLoggedIn && (
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col space-y-4 mt-4">
                    <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={handleMobileNavigation}>Home</Link>
                    <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={handleMobileNavigation}>Dashboard</Link>
                    <Link to="/News" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={handleMobileNavigation}>News</Link>
                    <Link to="/About" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={handleMobileNavigation}>About</Link>
                    <Link to="/Premium" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center" onClick={handleMobileNavigation}>
                      Premium <Crown className="ml-1 h-4 w-4 text-yellow-500" />
                    </Link>
                    <Link to="/Pricing" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center" onClick={handleMobileNavigation}>Pricing</Link>
                    <Link to="/Community" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center" onClick={handleMobileNavigation}>Community</Link>
                    <Link to="/faq" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center" onClick={handleMobileNavigation}>FAQ</Link>
                    <Link to="/feedback" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center" onClick={handleMobileNavigation}>Feedback</Link>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <ModeToggle />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </nav>

      <MainTicker theme={theme === "dark" ? "dark" : "light"} />
    </div>
  );
};

export default Navbar;
