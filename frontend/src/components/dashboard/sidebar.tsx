import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faUser, 
  faChartBar, 
  faComments,
} from "@fortawesome/free-regular-svg-icons";
import { faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  activeItem: number;
  onItemClick: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const icons = [
    { icon: faHome, label: "Dashboard", active: true },
    { icon: faUser, label: "Users", active: false },
    { icon: faChartBar, label: "Analytics", active: false },
    { icon: faComments, label: "Messages", active: false },
    { icon: faGear, label: "Settings", active: false }
  ];

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <>
      {/* Desktop / large screens */}
      <motion.aside 
        className= "hidden lg:flex flex-col items-center gap-3 py-6 w-18 bg-gray-50 shadow-md rounded-2xl ml-[50px] my-6 border border-gray-100 min-h-[calc(100vh-4rem)]"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-blue-600 font-bold text-xl mb-4 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Tc
        </motion.div>
        {icons.map((item, idx) => (
          <motion.div
            key={idx}
            variants={iconVariants}
            custom={idx}
            initial="hidden"
            animate="visible"
            className="relative group"
          >
            <Button
              size="icon"
              variant="ghost"
              className={`h-11 w-11 rounded-xl transition-all duration-200 ${
                activeItem === idx 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg" 
                  : "hover:bg-blue-50 text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => onItemClick(idx)}
            >
              <FontAwesomeIcon icon={item.icon} className="text-lg" />
            </Button>
            {/* Tooltip */}
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.label}
            </div>
          </motion.div>
        ))}
        <div className="mt-auto">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-11 w-11 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
            </Button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Mobile / small screens bottom bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <motion.div 
          className="bg-white shadow-lg rounded-2xl px-3 py-2 flex items-center gap-1 border border-gray-100"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {icons.map((item, idx) => (
            <Button
              key={idx}
              size="icon"
              variant="ghost"
              className={`h-10 w-10 rounded-xl transition-all duration-200 ${
                activeItem === idx 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-blue-50 text-gray-600"
              }`}
              onClick={() => onItemClick(idx)}
            >
              <FontAwesomeIcon icon={item.icon} className="text-lg" />
            </Button>
          ))}
        </motion.div>
      </nav>
    </>
  );
};

export default Sidebar;