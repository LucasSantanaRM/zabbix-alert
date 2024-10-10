import React, { useState } from 'react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Bell, Settings, ChevronRight, ChevronLeft } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNavigate: (view: 'dashboard' | 'alerts') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', onClick: () => onNavigate('dashboard') },
    { icon: Bell, label: 'Alerts', onClick: () => onNavigate('alerts') },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16",
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4">
          <h2 className={cn("text-xl font-semibold text-gray-800 dark:text-white transition-opacity duration-300", 
            isOpen ? "opacity-100" : "opacity-0"
          )}>
            Zabbix
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto"
          >
            {isOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
          </Button>
        </div>
        <nav className="flex-1 space-y-2 p-2">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal",
                isOpen ? "px-4" : "px-2"
              )}
              onClick={item.onClick}
            >
              <item.icon className={cn("h-5 w-5", isOpen ? "mr-2" : "mx-auto")} />
              <span className={cn(
                "transition-all duration-300",
                isOpen ? "opacity-100 inline-block" : "opacity-0 w-0 overflow-hidden"
              )}>
                {item.label}
              </span>
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};