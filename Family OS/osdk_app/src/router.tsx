import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import SelectUser from './components/SelectUser/SelectUser';
import Dashboard from './components/Dashboard/Dashboard';
import FoodPlanner from './components/FoodPlanner/FoodPlanner';
import Profile from './components/Profile/Profile';
import AuthCallback from "./components/AuthCallback";
import { AppLayout } from './components/AppLayout';
import { RequireUser } from './components/RequireUser';

const routes = createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
        <Route index element={<SelectUser />} />
        <Route path="dashboard" element={<RequireUser><Dashboard /></RequireUser>} />
        <Route path="food-planner" element={<RequireUser><FoodPlanner /></RequireUser>} />
        <Route path="profile" element={<RequireUser><Profile /></RequireUser>} />
        <Route path="auth/callback" element={<AuthCallback />} />
    </Route>
);

export const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });
