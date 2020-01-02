import FocusLock from "react-focus-lock";
import React from "react";

const WithFocusLock = WrappedComponent => props =>
    (<FocusLock>
            <WrappedComponent {...props} />
        </FocusLock>);

export default WithFocusLock;
