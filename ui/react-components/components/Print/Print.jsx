import React, { useState } from 'react'
import { createPortal } from 'react-dom'

import './Print.module.scss'

export default function Print({ children, ...props }) {
    const [printRef, setPrintRef] = useState(null)
    const mountNode = printRef && printRef.contentWindow.document.body

    function handlePrint() {
        printRef.contentWindow.print();

        return false;
    }

    return (
        <>
            <iframe {...props} ref={setPrintRef} style={{ display: 'none' }} data-testid="printFrame">
                {mountNode &&
                    createPortal(
                        React.Children.only(children),
                        mountNode
                    )}
            </iframe>
            <i className="fa fa-print" onClick={() => handlePrint()} data-testid="printIcon"></i>
        </>
    )
}