import "./App.css";
import { Routes, Route } from "react-router";
import { Signin } from "./components/page/signin/Signin";
import { Home } from "./components/page/home/Home";
import { MyPage } from "./components/page/mypage/MyPage";
import { AuthGuard } from "./components/context/AuthGuard";

function App() {
  return (
    <Routes>
      <Route path="signin" element={<Signin type="signin" />} />
      <Route path="signup" element={<Signin type="signup" />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <Home />
          </AuthGuard>
        }
      />
      <Route
        path="/:session_id"
        element={
          <AuthGuard>
            <Home />
          </AuthGuard>
        }
      />
      <Route
        path="mypage"
        element={
          <AuthGuard>
            <MyPage />
          </AuthGuard>
        }
      />
    </Routes>
  );
}

export default App;
