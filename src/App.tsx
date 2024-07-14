import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import ResponsiveAppBar from "./components/ui/AppBar";
import Login from "./components/auth/Login";
import { RecoilRoot } from "recoil";
import Home from "./components/quiz/Home";
import Join from "./components/quiz/Join";
import { AuthProtectedRoute } from "./components/auth/AuthProtectedRoute";
import CreateQuize from "./components/quiz/manageQuiz/Create";
import JoinGamePage from "./components/quiz/JoinGamePage";
import Created from "./components/quiz/manageQuiz/Created";
import Completed from "./components/quiz/manageQuiz/Completed";
import AboutUs from "./components/quiz/AboutUs";


function App() {
  return (
    <RecoilRoot>
      <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />

        <Router>
          <ResponsiveAppBar />
          <Routes>
            <Route path="/register" Component={Register} />
            <Route path="/login" Component={Login} />
            <Route path="/aboutus" Component={AboutUs} />
            <Route path="/" Component={AuthProtectedRoute}>
              <Route path="/" Component={Join} />
              <Route path="/home" Component={Home} />
              <Route path="/created" Component={Created} />
              <Route path="/completed" Component={Completed} />
              <Route path="/create" Component={CreateQuize} />
              <Route path="/join/game/:activeQuizId" Component={JoinGamePage} />
            </Route>
          </Routes>
        </Router>
      </div>
    </RecoilRoot>
  );
}

export default App;
