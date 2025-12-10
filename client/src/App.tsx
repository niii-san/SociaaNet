import {
    createRootRoute,
    createRouter,
    Outlet,
    RouterProvider,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
});

const routeTree = rootRoute.addChildren([
    // ... other routes
]);

const router = createRouter({
    routeTree,
});

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}
export default App;
