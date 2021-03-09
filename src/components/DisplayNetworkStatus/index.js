import React from 'react';
import useNetworkStatus from "../../hooks"

export default function DisplayNetworkStatus() {
  let connection = useNetworkStatus();

	return (
		<div className="section-body">
			Network: "{connection.effectiveType ? "Fast" : "Slow"}"
		</div>
	)
};
