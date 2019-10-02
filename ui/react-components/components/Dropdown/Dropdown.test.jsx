import {render} from "@testing-library/react";
import React from "react";
import Dropdown from "./Dropdown.jsx";

describe ('Dropdown', () => {
   it('should render dropdown component and should child component', () => {
       const { container } = render(<Dropdown />);
       expect(container.hasChildNodes()).toBeTruthy();
   });

    it('should have an asyncSelect div', () => {
        const {getByTestId} = render(<Dropdown/>);
        expect(getByTestId('asyncSelect')).not.toBeNull();
    });
});