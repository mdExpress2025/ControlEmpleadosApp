import React from 'react';
import SideBar from './Sidebar';
import Footer from './Footer';
import Header from './Header';

const MainLayout = ({ children,disabled }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <SideBar disabled={disabled} />
      <main className="flex-1 lg:ml-64">
        <Header/>
        <div className="min-h-[calc(100vh-64px)]">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default MainLayout;