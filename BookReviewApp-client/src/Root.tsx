import {
  BrowserRouter as Router, Routes, Route, Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import { AuthProvider } from './store/AuthContext';
import store from './store/ReduxStore';

import { App } from './App';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { CollectionPage } from './pages/CollectionPage';
import { BookInfoPage } from './pages/BookInfoPage';
import { RequireAuth } from './pages/AuthPage/components/RequireAuth';
import { UserPage } from './pages/UserPage';
import { AddBookPage } from './pages/AddBookPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const Root = () => (
  <AuthProvider>
    <Provider store={store}>
      <Router>
        {/* ↑ <HashRouter> for GitHub page */}
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="auth" element={<AuthPage />} />

            <Route path="books">
              <Route index element={<CollectionPage />} />
              <Route path=":bookId" element={<BookInfoPage />} />
            </Route>

            {/* Protected Routes: */}
            <Route path="user" element={<RequireAuth />}>
              <Route index element={<UserPage />} />

              <Route path="books">
                <Route index element={<CollectionPage />} />
                <Route path=":bookId" element={<BookInfoPage />} />
                <Route path="new" element={<AddBookPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  </AuthProvider>
);
