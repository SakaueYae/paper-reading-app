import "./App.css";
import { Routes, Route } from "react-router";
import { Login } from "./components/page/login/Login";
import { Home } from "./components/page/home/Home";
import { MyPage } from "./components/page/mypage/MyPage";

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="home" element={<Home />} />
      <Route path="mypage" element={<MyPage />} />
    </Routes>
  );
}

export default App;
