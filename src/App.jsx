
import Login from "./pages/login"
import Home from "./pages/home";
import Sign_up from "./pages/sign_up";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/sign_up" element={<Sign_up></Sign_up>}></Route>
      </Routes>
    </Router>
  )
}

export default App
