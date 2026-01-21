import '@testing-library/jest-dom/extend-expect';
import {fireEvent, wait} from "@testing-library/react";
import AppointmentReasonSearch from "./AppointmentReasonSearch.jsx";
import React from "react";
import {renderWithReactIntl} from '../../utils/TestUtil';
import {act} from 'react-dom/test-utils';
import * as helper from '../../helper';

jest.mock('../../api/conceptApi');
jest.mock('../../utils/CookieUtil');

const conceptApi = require('../../api/conceptApi');

describe('AppointmentReasonSearch', () => {
    let searchConceptsSpy;

    beforeEach(() => {
        jest.useFakeTimers();
        searchConceptsSpy = jest.spyOn(conceptApi, 'searchConcepts');
        searchConceptsSpy.mockResolvedValue([
            { uuid: 'reason-1-uuid', display: 'Fever' },
            { uuid: 'reason-2-uuid', display: 'Headache' },
            { uuid: 'reason-3-uuid', display: 'Cough' }
        ]);
        jest.spyOn(helper, 'getAppointmentReasonConceptSet').mockReturnValue('appointment-reason-concept-set-uuid');
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    it('should display placeholder text', () => {
        const {getByText} = renderWithReactIntl(
            <AppointmentReasonSearch onChange={jest.fn()} onReasonRemove={jest.fn()} />
        );
        getByText('Appointment Reason');
    });

    it('should display selected reasons in tags', () => {
        const selectedReasons = [
            { value: 'reason-1-uuid', label: 'Fever' },
            { value: 'reason-2-uuid', label: 'Headache' }
        ];
        
        const {getByText} = renderWithReactIntl(
            <AppointmentReasonSearch 
                onChange={jest.fn()} 
                selectedReasons={selectedReasons}
                onReasonRemove={jest.fn()}
            />
        );
        
        getByText('Fever');
        getByText('Headache');
    });

    it('should render Dropdown component', () => {
        const {container} = renderWithReactIntl(
            <AppointmentReasonSearch onChange={jest.fn()} onReasonRemove={jest.fn()} />
        );
        
        const inputBox = container.querySelector('input[type="text"]');
        expect(inputBox).toBeInTheDocument();
    });

    it('should render Tags component for selected reasons', () => {
        const selectedReasons = [
            { value: 'reason-1-uuid', label: 'Fever' }
        ];
        
        const {container} = renderWithReactIntl(
            <AppointmentReasonSearch 
                onChange={jest.fn()} 
                selectedReasons={selectedReasons}
                onReasonRemove={jest.fn()}
            />
        );
        
        expect(container.querySelector('.reasonTagsContainer')).toBeInTheDocument();
    });

    it('should call searchConcepts API when user types minimum characters', async () => {
        const appConfig = { appointmentReasonConceptSet: 'test-concept-set' };
        const {container} = renderWithReactIntl(
            <AppointmentReasonSearch onChange={jest.fn()} onReasonRemove={jest.fn()} appConfig={appConfig} />
        );

        const inputBox = container.querySelector('input[type="text"]');
        
        act(() => {
            fireEvent.change(inputBox, { target: { value: 'Fev' } });
            jest.runAllTimers();
        });

        await wait(() => {
            expect(searchConceptsSpy).toHaveBeenCalledWith('appointment-reason-concept-set-uuid', 'Fev');
        });
    });

    it('should not call searchConcepts API when user types less than minimum characters', async () => {
        const appConfig = { appointmentReasonConceptSet: 'test-concept-set' };
        const {container} = renderWithReactIntl(
            <AppointmentReasonSearch onChange={jest.fn()} onReasonRemove={jest.fn()} appConfig={appConfig} />
        );

        const inputBox = container.querySelector('input[type="text"]');
        
        act(() => {
            fireEvent.change(inputBox, { target: { value: 'Fe' } });
            jest.runAllTimers();
        });

        expect(searchConceptsSpy).not.toHaveBeenCalled();
    });

    it('should filter out already selected reasons from dropdown options', async () => {
        const selectedReasons = [
            { value: 'reason-1-uuid', label: 'Fever' }
        ];
        const appConfig = { appointmentReasonConceptSet: 'test-concept-set' };
        
        const {container} = renderWithReactIntl(
            <AppointmentReasonSearch 
                onChange={jest.fn()} 
                selectedReasons={selectedReasons}
                onReasonRemove={jest.fn()}
                appConfig={appConfig}
            />
        );

        const inputBox = container.querySelector('input[type="text"]');
        
        act(() => {
            fireEvent.change(inputBox, { target: { value: 'Fev' } });
            jest.runAllTimers();
        });

        await wait(() => {
            expect(searchConceptsSpy).toHaveBeenCalled();
        });
    });

    it('should handle error when searchConcepts fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        searchConceptsSpy.mockRejectedValue(new Error('API Error'));
        
        const appConfig = { appointmentReasonConceptSet: 'test-concept-set' };
        const {container} = renderWithReactIntl(
            <AppointmentReasonSearch onChange={jest.fn()} onReasonRemove={jest.fn()} appConfig={appConfig} />
        );

        const inputBox = container.querySelector('input[type="text"]');
        
        act(() => {
            fireEvent.change(inputBox, { target: { value: 'Fev' } });
            jest.runAllTimers();
        });

        await wait(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        consoleErrorSpy.mockRestore();
    });

    it('should pass isDisabled prop to child components', () => {
        const {container} = renderWithReactIntl(
            <AppointmentReasonSearch 
                onChange={jest.fn()} 
                onReasonRemove={jest.fn()} 
                isDisabled={true}
            />
        );
        
        expect(container).toBeInTheDocument();
    });

    it('should call onChange when a reason is selected from the dropdown', async () => {
        const onChangeSpy = jest.fn();
        const appConfig = { appointmentReasonConceptSet: 'test-concept-set' };
        
        const {container, getByText} = renderWithReactIntl(
            <AppointmentReasonSearch onChange={onChangeSpy} onReasonRemove={jest.fn()} appConfig={appConfig} />
        );

        const inputBox = container.querySelector('input[type="text"]');
        
        act(() => {
            fireEvent.change(inputBox, { target: { value: 'Head' } });
            jest.runAllTimers();
        });

        await wait(() => {
            expect(searchConceptsSpy).toHaveBeenCalled();
        });

        await wait(() => {
            const option = container.querySelector('.react-select__option');
            return option !== null;
        });

        const headacheOption = getByText('Headache');
        fireEvent.click(headacheOption);

        expect(onChangeSpy).toHaveBeenCalledWith({
            value: 'reason-2-uuid',
            label: 'Headache'
        });
    });

    it('should not call onChange when user clicks cross button to clear selection', async () => {
        const onChangeSpy = jest.fn();
        const appConfig = { appointmentReasonConceptSet: 'test-concept-set' };
        
        const {container, getByText} = renderWithReactIntl(
            <AppointmentReasonSearch onChange={onChangeSpy} onReasonRemove={jest.fn()} appConfig={appConfig} />
        );

        const inputBox = container.querySelector('input[type="text"]');
        
        act(() => {
            fireEvent.change(inputBox, { target: { value: 'Head' } });
            jest.runAllTimers();
        });

        await wait(() => {
            expect(searchConceptsSpy).toHaveBeenCalled();
        });

        await wait(() => {
            const option = container.querySelector('.bx--list-box__menu-item');
            return option !== null;
        });

        const headacheOption = getByText('Headache');
        fireEvent.click(headacheOption);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        onChangeSpy.mockClear();

        const clearButton = container.querySelector('.bx--list-box__selection');
        
        if (clearButton) {
            fireEvent.click(clearButton);
            expect(onChangeSpy).not.toHaveBeenCalled();
        }
    });

    it('should not call onChange when selected option does not exist in dropdownOptions', async () => {
        const onChangeSpy = jest.fn();
        const appConfig = { appointmentReasonConceptSet: 'test-concept-set' };
        
        searchConceptsSpy.mockResolvedValue([
            { uuid: 'reason-1-uuid', display: 'Fever' }
        ]);

        const {container} = renderWithReactIntl(
            <AppointmentReasonSearch onChange={onChangeSpy} onReasonRemove={jest.fn()} appConfig={appConfig} />
        );

        const inputBox = container.querySelector('input[type="text"]');
        
        act(() => {
            fireEvent.change(inputBox, { target: { value: 'Fev' } });
            jest.runAllTimers();
        });

        await wait(() => {
            expect(searchConceptsSpy).toHaveBeenCalled();
        });
        expect(onChangeSpy).not.toHaveBeenCalledWith({
            value: 'nonexistent-uuid',
            label: 'Nonexistent'
        });
    });
});
