import React from 'react'
import ReactDOM from 'react-dom'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import renderer from 'react-test-renderer'
import SingleDatePicker from './SingleDatePicker'
import DatePicker from 'react-datepicker'
import { subDays, addDays } from "date-fns"

it("should render without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SingleDatePicker></SingleDatePicker>, div);
})
describe("<DatePicker/>", () => {
    it("should render DatePicker component ", () => {
        const container = render(<DatePicker />);
        expect(container).toBeTruthy();
    });
    it("should render correctly DatePicker component", () => {
        let props = {
            selected: new Date(),
            onChange: () => { }
        }
        const DatePickerInputComponent = renderer.create(<DatePicker {...props} />).toJSON();
        expect(DatePickerInputComponent).toMatchSnapshot();
    });
});
jest.mock("react-datepicker", () => props => (
    <input data-testid="mockedDateField"
        onChange={e => {
            props.onChange(e);
        }}
    />
));
it("should display previous date upon clicking left arrow", () => {
    const { getByTestId, queryByTestId } = render(<SingleDatePicker />);
    const button = getByTestId("prev");
    fireEvent.click(button);
    const mockedDateField = getByTestId("mockedDateField");
    fireEvent.change(mockedDateField, { target: { value: subDays(new Date(), 1) } });
    expect(new Date(mockedDateField.value).getDate()).toBe(30);
})
it("should display next date upon clicking right arrow", () => {
    const { getByTestId, queryByTestId } = render(<SingleDatePicker />);
    const button = getByTestId("next");
    fireEvent.click(button);
    const mockedDateField = getByTestId("mockedDateField");
    fireEvent.change(mockedDateField, { target: { value: addDays(new Date(), 1) } });
    expect(new Date(mockedDateField.value).getDate()).toBe(1);
})
it("should render next button", () => {
    let props = {
        onClick: () => { },
        className: "app-view-next"
    }
    const nextButtonComponent = renderer.create(<button {...props} />).toJSON();
    expect(nextButtonComponent).toMatchSnapshot();
})

it("should render prev button", () => {
    let props = {
        onClick: {
            date: subDays(new Date(), 1)
        },
        className: "app-view-prev"
    }
    const prevButtonComponent = renderer.create(<button {...props} />).toJSON();
    const dateInputComp = renderer.create(<DatePicker />).toJSON();
    expect(dateInputComp.onChange).toMatchSnapshot();
})
