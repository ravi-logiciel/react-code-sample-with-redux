import { makeStyles } from '@material-ui/core/styles';
import { APP_THEMES, DEFAULT_THEME } from './reducers/Theme/constants';

const [lightTheme, darkTheme, yellowTheme] = APP_THEMES;

const COMMOM_THEME_CONFIGS = {
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: 300,
    },
    // ...Other configs
  },
};

export const THEME_CONFIGS = {
  [lightTheme]: {
    palette: {
      type: 'light',
      primary: {
        main: '#0094FF',
        contrastText: '#fff',
        light: 'rgba(0, 148, 255, 0.2)',
      },
    }
    // ...Other configs
  },
  [darkTheme]: {
    palette: {
      type: 'dark',
      primary: {
        main: '#00B398',
        contrastText: '#fff',
        light: 'rgba(0, 179, 152, 0.2)',
      },
    },
    // ...Other configs
  },
  [yellowTheme]: {
    palette: {
      type: 'dark',
      primary: {
        main: '#FFC001',
        contrastText: '#000',
        light: 'rgba(255, 192, 1, 0.2)',
      },
    },
    // ...Other configs
  },
};

/**
 * Get Theme Configs
 *
 * @param {Object}
 *
 * @return {Object}
 */
export const getThemeConfigs = ({ theme, isAuthenticated }) => {
  if (!isAuthenticated) {
    return THEME_CONFIGS[lightTheme];
  }

  return THEME_CONFIGS[theme] || THEME_CONFIGS[darkTheme];
};

export const snackBarStyles = theme => {
  if (!APP_THEMES.includes(theme)) theme = DEFAULT_THEME;

  return makeStyles({
    success: THEME_CONFIGS[theme || lightTheme].snackBar,
    error: THEME_CONFIGS[theme || lightTheme].snackBar,
    warning: THEME_CONFIGS[theme || lightTheme].snackBar,
    info: THEME_CONFIGS[theme || lightTheme].snackBar,
  });
};
