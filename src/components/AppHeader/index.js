import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  func,
  string,
  oneOfType,
  shape,
  bool,
  number,
  arrayOf,
} from 'prop-types';

import {
  Typography,
  Breadcrumbs,
  Grid,
  Box,
  Button,
  Link,
  CircularProgress,
} from '@material-ui/core';
import { ArrowBackIos as ArrowBackIosIcon } from '@material-ui/icons';

import { APP_ROUTES_BREADCRUMBS } from '../../configs/routes';
import './styles.scss';

function AppHeader({
  onCancel,
  onSave,
  saveText,
  cancelText,
  header,
  match,
  history,
  showLoader,
  totalRecords,
  headerActions,
  cancelColor,
  showBreadcrumbs,
  breadcrumb,
  onBack,
  backText,
  readOnly,
}) {
  if (!breadcrumb) breadcrumb = APP_ROUTES_BREADCRUMBS[match.path] || [];

  const goToRoute = route => () => {
    if (route) history.push(route);
  };

  return (
    <div className="app-header">
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Box>
          {showBreadcrumbs && (
            <Breadcrumbs aria-label="breadcrumb">
              {breadcrumb.map(({ url, name }, key) => {
                if (url) {
                  return (
                    <Link color="inherit" key={key} onClick={goToRoute(url)}>
                      <span className="breadcrumbs cursor-pointer">{name}</span>
                    </Link>
                  );
                }

                return (
                  <Typography color="textPrimary" key={key}>
                    <span className="breadcrumbs">{name}</span>
                  </Typography>
                );
              })}
            </Breadcrumbs>
          )}

          <Box my={1} display="flex" alignItems="center">
            <Typography variant="h2">
              {typeof header == 'object' ? { ...header } : header}
            </Typography>

            {header && totalRecords > 0 && (
              <Typography>&nbsp;({totalRecords})</Typography>
            )}

            {readOnly && (
              <Box
                bgcolor="primary.main"
                color="primary.contrastText"
                px={0.5}
                ml={0.5}
                borderRadius={3}
              >
                <Typography variant="caption">Read Only</Typography>
              </Box>
            )}
          </Box>
          
          {backText && onBack && (
            <Box className="cursor-pointer" mt={-1} onClick={onBack}>
              <Typography variant="body2" color="primary">
                {backText}
              </Typography>
            </Box>
          )}
        </Box>

        <Box>
          {headerActions && { ...headerActions }}

          {cancelText && (
            <Button
              variant="outlined"
              color={cancelColor}
              className="title-button"
              onClick={onCancel}
              disabled={showLoader}
            >
              {cancelText}
            </Button>
          )}

          {saveText && (
            <Button
              variant="contained"
              color="primary"
              className="title-button"
              onClick={onSave}
              disabled={showLoader}
            >
              {saveText}
              {showLoader && (
                <CircularProgress size={24} className="save-btn-loader" />
              )}
            </Button>
          )}
        </Box>
      </Grid>
    </div>
  );
}

AppHeader.propTypes = {
  backText: string,
  breadcrumb: arrayOf(shape({})),
  cancelColor: string,
  cancelText: string,
  header: oneOfType([string, shape({})]),
  headerActions: oneOfType([string, shape({})]),
  onBack: func,
  onCancel: func,
  onSave: func,
  readOnly: bool,
  saveText: string,
  showBreadcrumbs: bool,
  showLoader: bool,
  totalRecords: number,
};

AppHeader.defaultProps = {
  cancelColor: 'primary',
  cancelText: '',
  header: '',
  onCancel: () => {},
  onSave: () => {},
  saveText: '',
  showBreadcrumbs: true,
  showLoader: false,
  totalRecords: 0,
  headerActions: '',
  backText: '',
  readOnly: false,
};

export default withRouter(AppHeader);
