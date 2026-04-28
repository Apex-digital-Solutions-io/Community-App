import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div style={s.layout}>
      <Navbar />
      <main style={s.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const s = {
  layout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '84px',
  },
};
