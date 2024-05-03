import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, About, CreatePost, Dashboard, PostPage, Projects, Search, SignIn, SignUp, UpdatePost } from './pages'
import {PrivateRoute,OnlyAdminPrivateRoute, Header, Footer} from './components'

let count = 0;
const App = () => {
  console.log("app render", ++count);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/projects" element={<Projects />} />
        // todo need to understand
        <Route path="/blog/:blogSlug" element={<PostPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}/>
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-blog" element={<CreatePost />} />
          <Route path="/update-blog/:blogId" element={<Projects />} />
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App