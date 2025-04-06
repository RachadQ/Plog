import React, { useEffect} from 'react';
import BaseLayout from "./Default/BaseLayout";
const HomePage: React.FC<{}>  = () => {
  useEffect(() => {
    fetch("https://plog-api-proxy-function.azurewebsites.net/api/proxyFunction?")
     
  }, []);
  
  return (
        
        <div>
          <h1>Home Page</h1>
          {/* Add your home page content here */}
          
        </div>
     )
};

export default HomePage;