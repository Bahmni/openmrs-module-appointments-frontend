import FocusLock from "react-focus-lock";
import React from "react";

const useFocusLock = WrappedComponent => props =>
    (<FocusLock>
            <WrappedComponent {...props} />
        </FocusLock>);

export default useFocusLock;
