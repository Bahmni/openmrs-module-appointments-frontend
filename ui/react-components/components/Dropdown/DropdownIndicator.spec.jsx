import React from "react";
import {render} from '@testing-library/react';
import {DropdownIndicator} from "./DropdownIndicator";

describe('DropdownIndicator', () => {
    it('should render dropdown indicator icon', function () {
        const {container} = render(<DropdownIndicator/>);
        const icon = container.querySelector('.fa-angle-down');
        expect(icon).not.toBeNull();
    });
});
