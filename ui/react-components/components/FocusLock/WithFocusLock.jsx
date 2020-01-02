import FocusLock from "react-focus-lock";
import React from "react";

const WithFocusLock = WrappedComponent => {
    return class WithFocusLock extends React.Component {
        render() {
            return (
                <FocusLock>
                    <WrappedComponent {...this.props} />
                </FocusLock>
            )
        }
    }
};
export default WithFocusLock;
