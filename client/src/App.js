import './App.css';
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
//All componenents
import Username from './components/Username';
import Reset from './components/Reset';
import Register from './components/Register';
import Password from './components/Password';
import Pagenotfound from './components/Pagenotfound';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import {Authorized,ProtectRoute} from './middleware/auth'


const router = createBrowserRouter([
  {
    path:'/',  
    element: <Username/>
  },
  {
    path:'/register',
    element:<Register />
  },
  {
    path:'/password',
    element:<ProtectRoute><Password/></ProtectRoute>
  },
  {
    path:'/recovery',
    element:<Recovery/>
  },
  {
    path:'/reset',
    element:<Reset/>
  },
  {
    path:'/profile',
    element:<Authorized><Profile/></Authorized> 
  },
  {
    path:'*',
    element:<Pagenotfound/>
  },
])

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
