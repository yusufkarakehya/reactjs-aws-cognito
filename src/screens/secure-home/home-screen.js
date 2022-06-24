import React, { useEffect, useState } from 'react';
import { Auth } from "aws-amplify";
import { Logger } from "@aws-amplify/core";

export function HomeScreen() {
    const [loggedIn, setLoggedIn] = useState(false);
    const logger = new Logger("HomeScreen");

    useEffect(() => {
        Auth.currentAuthenticatedUser({
            bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then(user => {
            if (!user) {
                setLoggedIn(false);
            }
            else {
                setLoggedIn(true);
                logger.log("User is logged-in");
            }
        }).catch(err => {
            logger.log("Couldn't get the logged-in user for some reason: " + err);
        }
        );
    })

    return <div>
        {loggedIn && <h1>You Logged In</h1>}
        {!loggedIn && <h1>Please Log In</h1>}
    </div>
}
