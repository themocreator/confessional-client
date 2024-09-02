import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import DisplayPage from "./Pages/DisplayPage";
import TabletPage from "./Pages/TabletPage";
import { useState } from "react";

const Root = () => {
  const [active, setActive] = useState("home");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const sendText = async (base64) => {
    // fetch('https://mixingmos-api.vercel.app/textPhotosVideos', {
    console.log('sending text...')
    // const blob = fetch(base64).then((res) => res.blob()).then((blob) => setUrl(blob))
    // const formData = new FormData();
    // formData.append('file', blob, 'image.png');

    return await fetch("http://localhost:8080/textPhotosVideos", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: "+18137149450",
        url: base64
      }),
    }).then((res) => res.json());
  };
  const context = {
    active,
    setActive,
    image,
    setImage,
    url,
    setUrl,
    sendText,
  };
  return (
    <div style={{ height: "100vh" }}>
      <Outlet context={context} />
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<DisplayPage />} />
      <Route path="/tablet" element={<TabletPage />} />
    </Route>
  )
);
function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
