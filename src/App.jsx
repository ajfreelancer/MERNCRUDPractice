import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EditProduct from './pages/EditProducts';
import CreateProduct from './pages/CreateProduct';
import Footer from './components/footer'; // adjust path if needed


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/create" element={<CreateProduct />} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
