import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({children }) => {

  
    return (
      <div>
        <Header />
        {/*kind of iffy of the main look*/ }
        <main className="min-h-screen bg-white text-gray-800 p-6">{children}
        <Footer />
        </main>

        
      </div>
    );
  };
  
  export default BaseLayout;