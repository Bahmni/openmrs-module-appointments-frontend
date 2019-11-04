import React from "react";
import Conflicts from "./Conflicts";
import {renderWithReactIntl} from "../../utils/TestUtil";

describe('Conflicts', () => {
    it('should render conflicts footer component', () => {
        const {container} = renderWithReactIntl(<Conflicts conflicts={{}}/>, {});
        expect(container.querySelector('.conflicts')).not.toBeNull();
        expect(container.querySelector('.conflicts .footer')).not.toBeNull();
        expect(container.querySelector('.conflicts .body')).not.toBeNull();
    });
});
