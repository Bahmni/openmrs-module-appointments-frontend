import React from "react";
import Conflicts from "./Conflicts";
import {renderWithReactIntl} from "../../utils/TestUtil";

describe('Conflicts', () => {
    it('should render conflicts footer component', () => {
        const {getByTestId, container} = renderWithReactIntl(<Conflicts conflicts={{}} service={{}}/>, {});
        expect(getByTestId('conflicts')).not.toBeNull();
        expect(getByTestId('conflicts-footer')).not.toBeNull();
        expect(getByTestId('conflicts-body')).not.toBeNull();
        expect(container.querySelector('.button')).not.toBeNull();
    });
});
