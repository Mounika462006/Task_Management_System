import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext({
  isOpen: false,
  toggle: () => {},
  close: () => {},
});

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );  
};

export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext;
