import { useState, useEffect } from 'react';

/**
 * Get connection status
 * 
 * @returns {Object}
 */
const getConnection = () => {
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
}

/**
 * Get active window connection
 * 
 * @returns {Object}
 */
export const useNetworkStatus = () => {
  let [connection, updateNetworkConnection] = useState(getConnection());

  useEffect(() => {
    const updateConnectionStatus = () => {
      updateNetworkConnection(getConnection());
    }

    connection.addEventListener("change", updateConnectionStatus);
    return () => {
      connection.removeEventListener("change", updateConnectionStatus);
    };
  }, [connection]);

  return connection;
};
