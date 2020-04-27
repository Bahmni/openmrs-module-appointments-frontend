import React, { useState } from 'react'
import { createPortal } from 'react-dom'

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
            <a onClick={() => handlePrint()} data-testid="printIcon"><i className="fas fa-print"></i></a>
        </>
    )
}