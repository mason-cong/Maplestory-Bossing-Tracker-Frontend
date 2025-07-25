import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from './pages/Home';
import Login from './pages/Login';
import Tracker from './pages/Tracker';
import Signup from './pages/Signup';

//<Route path="/signup" element = {<Signup/>}/> - add backin after making signup page
const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/signup" element = {<Signup/>}/>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/tracker" element = {<Tracker/>}/>
      </Routes>
    </div>
      
  );
};

export default App;
