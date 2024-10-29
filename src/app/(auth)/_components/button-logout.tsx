"use client";

import React from "react";
import { logoutAction } from "../auth.actions";

const initialState = {
	message: ""
};

export function LogoutButton() {
	const [, action] = React.useActionState(logoutAction, initialState);
	return (
		<form action={action}>
			<button>Sign out</button>
		</form>
	);
}
