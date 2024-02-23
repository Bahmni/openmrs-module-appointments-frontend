import classNames from "classnames";
import { FormattedMessage, useIntl } from "react-intl";
import React, {useEffect, useState} from "react";
import {
    Modal,
    RadioButton,
    RadioButtonGroup
} from "carbon-components-react";
import Title from "../Title/Title.jsx";
import { title } from './UpdateButtons.module.scss'
const UpdateButtonsModal = props => {
    const { show, checkAndSave, updateOptionsVisibleStatus } = props;
    const intl = useIntl()
    const [updateAllOccurrences, setUpdateAllOccurrences] = useState(true);
    const [open, setOpen] = useState(true);
    const [updateDisabled, setUpdateDisabled] = useState(true);
    const updateAllTitle = intl.formatMessage( { id: 'APPOINTMENT_UPDATE_TITLE',  defaultMessage: "Update occurrences"});
    const updateAll = <FormattedMessage id={'APPOINTMENT_UPDATE_ALL_LABEL'} defaultMessage={"All occurrences"}/>
    const updateSingle = <FormattedMessage id={'APPOINTMENT_UPDATE_ONE_LABEL'} defaultMessage={"This occurrence"}/>
    const primaryButtonText = <FormattedMessage id={'OK_KEY'} defaultMessage={'Ok'}/>
    const secondaryButtonText = <FormattedMessage id={'CANCEL_KEY'} defaultMessage={'Cancel'}/>
    const titleText = <Title style={classNames(title)} text={updateAllTitle} isRequired={true}/>

    useEffect(()=>{
        setOpen(true);
    }, [show])

    const closeModal = () =>{
        setOpen(false);
        updateOptionsVisibleStatus(false);
    }
    const changeState = (updateAll) => {
        setUpdateAllOccurrences(updateAll);
        setUpdateDisabled(false);
    }

    return (
        <div data-testid={"update-buttons"}>
        <Modal
            open={open}
            onRequestClose={closeModal}
            onSecondarySubmit={closeModal}
            preventCloseOnClickOutside={true}
            modalHeading={titleText}
            primaryButtonText={primaryButtonText}
            primaryButtonDisabled={updateDisabled}
            secondaryButtonText={secondaryButtonText}
            onRequestSubmit={() => {
                checkAndSave(updateAllOccurrences)
                closeModal()
            }}>
            <RadioButtonGroup
                name="occurences-update-option"
                orientation={"vertical"}>
                <RadioButton
                    labelText={updateSingle}
                    value={"single"}
                    onClick={()=>{changeState(false);}}
                />
                <RadioButton
                    labelText={updateAll}
                    value={"all"}
                    onClick={()=>{changeState(true);}}
                />
            </RadioButtonGroup>
        </Modal>
        </div>
    );
};

export default UpdateButtonsModal;
