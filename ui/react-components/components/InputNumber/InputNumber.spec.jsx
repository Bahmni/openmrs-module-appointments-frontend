import React from "react";
import InputNumber from "./InputNumber";
import {fireEvent, render} from "@testing-library/react";


describe('Input Number', () => {
    it('should render an input number', () => {
        const {container} = render(<InputNumber onChange={jest.fn()}/>);
        expect(container.querySelector('.inputNumberContainer')).not.toBeNull();
        expect(container.querySelectorAll('.inputButton').length).toBe(2);
    });

    it('should set value on change', () => {
        const onChangeSpy = jest.fn();
        const {getByTestId} = render(<InputNumber onChange={onChangeSpy}/>);
        const input = getByTestId('input-box');
        fireEvent.change(input, {target: {value: 4}});
        expect(input.value).toBe("4");
        expect(onChangeSpy).toHaveBeenCalled();
    });

    it('should call onChange of input box on click of right button', () => {
        const onChangeSpy = jest.fn();
        const {container} = render(<InputNumber onChange={onChangeSpy}/>);
        const rightButton = container.querySelectorAll('.inputButton')[1];
        fireEvent.click(rightButton);
        expect(onChangeSpy).toHaveBeenCalled();
    });


    it('should call onChange of input box on click of left button', () => {
        const onChangeSpy = jest.fn();
        const {container} = render(<InputNumber onChange={onChangeSpy} defaultValue={3}/>);
        const leftButton = container.querySelectorAll('.inputButton')[0];
        fireEvent.click(leftButton);
        expect(onChangeSpy).toHaveBeenCalled();
    });

    it('should not call onChange of input box on click of left button when defaultValue is <= 1', () => {
        const onChangeSpy = jest.fn();
        const {container} = render(<InputNumber onChange={onChangeSpy} defaultValue={1}/>);
        const leftButton = container.querySelectorAll('.inputButton')[0];
        fireEvent.click(leftButton);
        expect(onChangeSpy).not.toHaveBeenCalled();
    });

    it('should have disable class', () => {
        const {container} = render(<InputNumber onChange={() => {}} isDisabled={true}/>);
        expect(container.querySelector('.disable')).not.toBeNull();
    })
});

