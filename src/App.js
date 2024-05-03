import './App.css';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom'
import DisplayPage from './Pages/DisplayPage';
import TabletPage from './Pages/TabletPage';

const Root = () => {
  return (
    <div style={{height: '100vh'}}>
      <Outlet />
    </div>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Root />}>
      <Route index element={<DisplayPage />} />
      <Route path="/tablet" element={<TabletPage />} />
    </Route>
  )
)
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
