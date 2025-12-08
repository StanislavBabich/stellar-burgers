import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import {
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute
} from '@components';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';

const OrderInfoRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.state?.background) {
    const handleClose = () => {
      navigate(location.state.background.pathname || '/feed', {
        replace: true
      });
    };

    return (
      <Modal title='' onClose={handleClose}>
        <OrderInfo />
      </Modal>
    );
  }

  return (
    <main style={{ padding: '20px' }}>
      <OrderInfo />
    </main>
  );
};

const IngredientDetailsRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.state?.background) {
    const handleClose = () => {
      navigate(location.state.background.pathname || '/', { replace: true });
    };

    return (
      <Modal title='Детали ингредиента' onClose={handleClose} hideCloseButton>
        <IngredientDetails />
      </Modal>
    );
  }

  return (
    <main style={{ padding: '20px' }}>
      <IngredientDetails />
    </main>
  );
};

const App = () => (
  <BrowserRouter>
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfoRoute />} />
        <Route path='/ingredients/:id' element={<IngredientDetailsRoute />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfoRoute />} />}
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
