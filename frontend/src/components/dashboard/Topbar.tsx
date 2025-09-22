import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell, 
  faSun, 
  faMoon, 
  faUser
} from "@fortawesome/free-regular-svg-icons";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

interface TopbarProps {
  userName?: string;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ 
  userName, 
  onSearch, 
  onNotificationClick,
  onProfileClick 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const topbarVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const clearNotifications = () => {
    setNotificationCount(0);
    onNotificationClick?.();
  };

  return (
    <motion.header 
      className="sticky top-0 z-40 flex items-center gap-2 py-4 justify-between bg-white w-100vw"
      variants={topbarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex-1 max-w-lg">
        <form onSubmit={handleSearch} className="relative">
          <Input
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-2xl pl-11 pr-4 bg-white w-full border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          {searchQuery && (
            <motion.button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </motion.button>
          )}
        </form>
      </div>
      
      <div className="flex items-center gap-3 md:mr-[170px]">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-11 w-11 rounded-full border border-gray-200 hover:bg-gray-50"
            onClick={clearNotifications}
          >
            <FontAwesomeIcon icon={faBell} className="text-lg" />
          </Button>
          <AnimatePresence>
            {notificationCount > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {notificationCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-11 w-11 rounded-full border border-gray-200 hover:bg-gray-50"
            onClick={toggleDarkMode}
          >
            <FontAwesomeIcon 
              icon={isDarkMode ? faSun : faMoon} 
              className="text-lg" 
            />
          </Button>
        </motion.div>
        
        <div className="h-9 w-px bg-gray-400 mx-2 border border-gray-400" />
        
        <motion.div 
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={onProfileClick}
        >
          <motion.div 
            className="h-11 w-11 rounded-full bg-yellow-400 flex items-center justify-center text-gray-600"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon icon={faUser} className="text-xl" />
          </motion.div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-gray-900">{userName || "Raghavendar Reddy"}</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Topbar;