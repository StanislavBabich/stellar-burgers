import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useEffect } from 'react';
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
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { selectIngredientsHasLoaded } from '../../services/selectors/ingredientsSelectors';

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const dispatch = useDispatch();
  const hasLoadedIngredients = useSelector(selectIngredientsHasLoaded);

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!hasLoadedIngredients) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, hasLoadedIngredients]);

  const orderInfoPage = (
    <main style={{ padding: '20px' }}>
      <OrderInfo />
    </main>
  );

  const ingredientDetailsPage = (
    <main style={{ padding: '20px' }}>
      <IngredientDetails />
    </main>
  );

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={orderInfoPage} />
        <Route path='/ingredients/:id' element={ingredientDetailsPage} />
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
          element={<ProtectedRoute element={orderInfoPage} />}
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleGoBack}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleGoBack}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal title='' onClose={handleGoBack}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
