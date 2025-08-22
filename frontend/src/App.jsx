import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import Login from './pages/Login';
import Tracker from './pages/Tracker';
import Signup from './pages/Signup';
import { AuthProvider } from "./AuthContext"; 

const App = () => {
  return (
    <div>
      <Navbar/>
      <AuthProvider>
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/signup" element = {<Signup/>}/>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/tracker" element = {<Tracker/>}/>
      </Routes>
      </AuthProvider>
    </div>
      
  );
};

export default App;
