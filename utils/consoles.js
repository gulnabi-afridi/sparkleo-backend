export const LogError = (path, method, endpoint, error) => {
    console.log(`❌ Path: `, path);
    console.log(`❌ Method: `, method);
    console.log(`❌ Endpoint: `, endpoint);
    console.log(`❌ Error: `, error);
  };
  
  export const LogSuccess = (path, message) => 
    console.log(`✅  [${path}] 👉`, message);
  
  export const LogInfo = (path, message) => 
    console.log(`▶️  [${path}] 👉`, message);
  
  export const LogWarning = (path, message) => 
    console.log(`⚠️  [${path}] 👉`, message);
  