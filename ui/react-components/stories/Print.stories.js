import React from 'react';
import Print from '../components/Print/Print';

export default { title: 'Print' };

export const basic = () => (
    <Print>
        <>
            <div>Appointments</div>
            <p>This print icon prints all the elements provided as children to it</p>
        </>
    </Print>
);
