import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/login";
import Sign_up from "../pages/sign_up";
import Home from "../pages/home";
import UserHome from "../pages/userhome";
import Profile from "../pages/profile";
import AccountProfile from "../pages/accountprofile";
import NotFoundPage from "../pages/notfoundPage"; // adjust path as needed


const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "",
          element: <UserHome/>,
        },
        {
          path: "/profile",
          element: <Profile/>
        },
        {
          path : "/profile/:username",
           element:  <AccountProfile />
        },
        {
    path: "*",
    element: <NotFoundPage />,   // wildcard route
  },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/sign_up",
      element: <Sign_up/>
    },
    {
    path: "*",
    element: <NotFoundPage />,   // wildcard route
  },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;