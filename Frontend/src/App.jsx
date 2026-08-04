import { Routes, Route } from "react-router-dom";
import AcceptInvitation from "./pages/AcceptInvitation";
import Login from "./pages/Login";

function App() {
    return (
        <Routes>

            <Route
                path="/login"
                element={<Login />}
            />
            <Route
                path="/accept-invitation/:token"
                element={<AcceptInvitation />}
            />
        </Routes>
    );
}

export default App;