import { useState } from 'react'
import Recovery from './components/Recovery';
import Register from './components/Register';
import Username from './components/Username';
import Password from './components/Password';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
import Profile from './components/Profile';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

/**auth middleware  */
import { AuthorizeUser } from './middleware/auth';
import { ProtectUser } from './middleware/auth';
import { ProtectResetPassword} from './middleware/auth';
function App() {
  
  return (
    <>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Username />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/password" element={<ProtectUser><Password /></ProtectUser>} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/profile" element={<AuthorizeUser><Profile/></AuthorizeUser>} />
          <Route path="/reset" element={<ProtectResetPassword><Reset /></ProtectResetPassword>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
