import React, {useState, useRef} from "react";
import { createPortal } from 'react-dom'
import {
    ComposedModal,
    ModalFooter,
    Button,
    ModalBody,
    ModalHeader
} from 'carbon-components-react';
import Label from "../components/Label/Label.jsx";
import {FormattedMessage} from "react-intl";

export const CustomModal = props => {
    const { triggerComponent, titleKey, defaultTitle, body, primaryButton } = props;
    const title = <FormattedMessage id={titleKey} defaultMessage={defaultTitle} />
    const closeButton = useRef();
    const ModalStateManager = ({
       renderLauncher: LauncherContent,
       children: ModalContent,
       }) => {
        const [open, setOpen] = useState(false);
        return (
              <>
                {!ModalContent || typeof document === 'undefined'
                  ? null
                      : createPortal(
                          <ModalContent open={open} setOpen={setOpen} />,
                     document.body
                    )}
            {LauncherContent && <LauncherContent open={open} setOpen={setOpen} />}
          </>
        );
      };
    return (
        <ModalStateManager
            renderLauncher={({ setOpen }) => (
                <span ref={closeButton} onClick={() => setOpen(true)}>
                    {triggerComponent}
                </span>
            )}>
            {({ open, setOpen }) => (
                <ComposedModal
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setTimeout(() => {
                            closeButton.current.focus();
                        });
                    }}
                    preventCloseOnClickOutside={true}
                    >
                    <ModalHeader title={title} />
                    <ModalBody>
                        {body}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            kind="secondary"
                            onClick={() => {setOpen(false); }}>
                            <Label translationKey={'CANCEL_KEY'} defaultValue={'Cancel'}/>
                        </Button>
                        {primaryButton}
                    </ModalFooter>
                </ComposedModal>
            )}
        </ModalStateManager>
    );
}
export default CustomModal;