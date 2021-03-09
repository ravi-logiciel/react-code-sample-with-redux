import React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import { string } from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { SnackbarProvider } from 'notistack';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

import { APP_ROUTES } from './configs/routes';
import { getUserSession } from './utils/localStorage';

import { getTheme } from './reducers/Theme/selectors';

import AppSideBar from './components/AppSidebar';
import AppFooter from './components/AppFooter';
import SnackBar from './SnackBar';
import PrivateRoute from './PrivateRoute';

import Login from './views/Login';
import { getThemeConfigs, snackBarStyles } from './theme';

/**
 * Add action to all snackbars
 */
const notistackRef = React.createRef();
const onClickDismiss = key => () => {
  notistackRef.current.closeSnackbar(key);
};

/**
 * App Routes Component
 */
function AppRoutes({ theme, location }) {
  const snackbarClasses = snackBarStyles(theme)();
  const isAuthenticated = Boolean(getUserSession());

  const isShowSideBar =
    isAuthenticated && location.pathname != '/complete-signup';

  const themeStore = React.useMemo(
    () =>
      createMuiTheme({
        ...getThemeConfigs({
          theme,
          isAuthenticated: isShowSideBar,
        }),
      }),
    [theme, isShowSideBar]
  );

  let bodyClass = `theme-${theme}`;
  if (location.pathname == APP_ROUTES.FINANCIAL_ENV_SETUP) {
    bodyClass += ' env-container';
  }

  document.body.classList = [bodyClass];

  return (
    <ThemeProvider theme={themeStore}>
      <SnackbarProvider
        preventDuplicate
        maxSnack={50}
        ref={notistackRef}
        action={key => (
          <Close
            fontSize="small"
            className="cursor-pointer"
            onClick={onClickDismiss(key)}
          />
        )}
        classes={{
          variantSuccess: snackbarClasses.success,
          variantError: snackbarClasses.error,
          variantWarning: snackbarClasses.warning,
          variantInfo: snackbarClasses.info,
        }}
      >
        <SnackBar />
      </SnackbarProvider>

      <div className={isAuthenticated ? 'marginBase' : ''}>
        {isShowSideBar && <AppSideBar />}

        <Switch>
          {/* Login */}
          <PrivateRoute
            exact
            path={APP_ROUTES.LOGIN}
            isAuthenticated={isAuthenticated}
            component={Login}
          />

          {/* Default */}
          <PrivateRoute
            exact
            path="/"
            isAuthenticated={isAuthenticated}
            component={Dashboard}
          />
        </Switch>

        {isShowSideBar && <AppFooter />}
      </div>
    </ThemeProvider>
  );
}

AppRoutes.propTypes = {
  theme: string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  theme: getTheme(),
});

export default connect(mapStateToProps, null)(withRouter(AppRoutes));
