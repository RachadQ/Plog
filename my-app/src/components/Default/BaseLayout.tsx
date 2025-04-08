import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import children from "../../types/BaseLayout.interface"
const BaseLayout: React.FC<children> = ({children }) => {

  
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