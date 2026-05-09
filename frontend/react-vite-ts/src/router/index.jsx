import { createBrowserRouter } from "react-router-dom";
import Entry from "../pages/entry/index.jsx";
import Choose from "../pages/choose/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Entry />,
  },
  {
    path: "/choose",
    element: <Choose />,
  },
]);

export default router;
