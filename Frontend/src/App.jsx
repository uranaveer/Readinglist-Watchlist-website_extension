import AuthProvider from "./provider/authProvider";
import Routes from "./routes";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;

// import React, { useEffect } from 'react';
// import axios from 'axios';

// function App() {
//   useEffect(() => {
//     axios.post("https://2ac2-103-37-201-222.ngrok-free.app/api/login/", {
//         "email":"uranaveer5238@gmail.com",
//         "password":"1234567890"
//     })
//     .then(response => {
//       console.log("✅ Response:", response.data);
//     })
//     .catch(error => {
//       console.error("❌ Error:", error);
//     });
//   }, []);

//   return (
//     <div>
//       <h1>CORS Test</h1>
//       <p>Check the browser console for API response.</p>
//     </div>
//   );
// }

// export default App;