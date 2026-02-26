import { Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import Header from './components/Header';
import Login from './components/Login';
import DashBoard from './components/dashboard/DashBoard';
import { useState } from 'react';
import UserContext from './utils/UserContext';
import Error from './components/Error';

function App() {
  
  const [isLogin, setIsLogin]= useState(false);
  return (
    <UserContext.Provider value={{loggedInUser: isLogin, setIsLogin}}>
   <div className='app'>
    <Header/>
    <Routes>
      <Route path = "/" element= {<Login/>}/>
      <Route path='/signup' element ={<SignUp/>}/>
      
      <Route path='/login' element ={<Login/>}/>
      <Route path="*" element = {<Error/>}/>
      <Route path="/dashboard" element={<DashBoard/>}/>
      {/* <Route path="/dashboard/:email" element={
                    <ProtectedRoute>
                        <DashBoard/>
                    </ProtectedRoute>
                } />       */}
    </Routes>
    
   </div>
   </UserContext.Provider>
  );
}

export default App;
