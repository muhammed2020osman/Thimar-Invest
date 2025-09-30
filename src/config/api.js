// config.js

// تحديد ما إذا كنا في بيئة التطوير المحلية أو بيئة الإنتاج
const isLocalEnvironment = () => {
    if (typeof window === 'undefined') {
      // We are on the server, check for environment variable or assume local for development
      return process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_API_URL?.includes('localhost');
    }
    // return false;
    return window.location.hostname === 'localhost' ;
  };
  
  // تكوين ديناميكي يعتمد على البيئة الحالية
  const config = {
    
    get apiUrl() {
      return isLocalEnvironment() 
        ? 'http://localhost:8000/api/v1/'
        : 'https://thimarapi.gumra-ai.com/api/v1/';
    },
    get assetUrl() {
      return isLocalEnvironment() 
        ? 'http://localhost:8000/uploads/'
        : 'https://thimarapi.gumra-ai.com/';
    }
  };
  
  
  
  export default config;
    