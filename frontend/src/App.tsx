import "./App.css";
import { Routes, Route } from "react-router";
import { Signin } from "./components/page/signin/Signin";
import { Home } from "./components/page/home/Home";
import { MyPage } from "./components/page/mypage/MyPage";

function App() {
  return (
    <Routes>
      <Route path="signin" element={<Signin type="signin" />} />
      <Route path="signup" element={<Signin type="signup" />} />
      <Route path="home" element={<Home />} />
      <Route path="mypage" element={<MyPage />} />
    </Routes>
  );
}

export default App;
