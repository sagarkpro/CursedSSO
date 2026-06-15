import { lazy, Suspense, type ComponentType } from "react";
import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "./components/shared/NotFound";
import { GlobalLoader } from "./components/shared/GlobalLoader";
import { Layout } from "./Layout";

const withSuspense = (Component: ComponentType) => (
	<Suspense fallback={<GlobalLoader />}>
		<Component />
	</Suspense>
);

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{ index: true, element: withSuspense(lazy(() => import("@/pages/login/LoginPage"))) },
			{ path: "login", element: withSuspense(lazy(() => import("@/pages/login/LoginPage"))) },
			{ path: "register", element: withSuspense(lazy(() => import("@/pages/register/RegisterPage"))) },
			{ path: "verify", element: withSuspense(lazy(() => import("@/pages/verify/VerifyPage"))) },
			{ path: "reset-password", element: withSuspense(lazy(() => import("@/pages/reset-password/ResetPasswordPage"))) },
			{ path: "*", element: <NotFound /> },
		],
	},
]);
