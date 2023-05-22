import '@testing-library/jest-dom/extend-expect';
import {render, fireEvent} from "@testing-library/react";
import Tags from "./Tags.jsx";
import React from "react";

jest.mock('../../utils/CookieUtil');

describe('Tags', () => {

    it('should return null when empty array is passed', () => {
        const onChangeSpy = jest.fn();
        const {container} = render(<Tags selectedTags={[]} onChange={onChangeSpy}/>);
        expect(container.querySelector('.tag')).toBeNull();
    });

    it('should return null when null is passed', () => {
        const onChangeSpy = jest.fn();
        const {container} = render(<Tags selectedTags={null} onChange={onChangeSpy}/>);
        expect(container.querySelector('.tag')).toBeNull();
    });

    it('should render the list of strings as individual tags', () => {
        const tags = [{label: 'One', value: '1'}, {label: 'Two', value: '2'}, {label: 'Three', value: '3'}];
        const onChangeSpy = jest.fn();
        const {container} = render(<Tags selectedTags={tags} onChange={onChangeSpy}/>);
        expect(container.querySelector('.newTag').children.length).toBe(1);
        container.querySelectorAll('.tagLabel').forEach((tagLabel, ind) => expect(tags[ind].label).toBe(tagLabel.textContent));
    })

    it('should trigger onChange function on click of remove icon', () => {
        const tags = [{label: 'One', value: '1'}, {label: 'Two', value: '2'}, {label: 'Three', value: '3'}];
        const onChangeSpy = jest.fn();
        const {getByText} = render(<Tags selectedTags={tags} onChange={onChangeSpy}/>);
        fireEvent.click(getByText('One').nextSibling);
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should have disable class for all tags', () => {
        const tags = [{label: 'One', value: '1'}, {label: 'Two', value: '2'}, {label: 'Three', value: '3'}];
        const onChangeSpy = jest.fn();
        const {container} = render(<Tags selectedTags={tags} onChange={onChangeSpy} isDisabled={true}/>);

        expect(container.querySelectorAll('.disable').length).toBe(3);
    });

});

