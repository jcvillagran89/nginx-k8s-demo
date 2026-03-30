import logo from '@/images/logo.png';

const BasicEmailPage = () => {
    return (
        <table
            className="body-wrap"
            style={{
                fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                boxSizing: 'border-box',
                fontSize: 14,
                width: '100%',
                height: '100vh',
                backgroundColor: '#f6f6f6',
                margin: 0,
            }}
            bgcolor="#f6f6f6"
        >
            <tbody>
                <tr style={{ fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif', boxSizing: 'border-box', fontSize: 14, margin: 0 }}>
                    <td
                        style={{
                            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                            boxSizing: 'border-box',
                            fontSize: 14,
                            verticalAlign: 'top',
                            margin: 0,
                        }}
                        valign="top"
                    />
                    <td
                        className="container"
                        width={600}
                        style={{
                            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                            boxSizing: 'border-box',
                            fontSize: 14,
                            verticalAlign: 'top',
                            display: 'block !important',
                            maxWidth: '600px !important',
                            margin: '0 auto',
                        }}
                        valign="top"
                    >
                        <div
                            className="content"
                            style={{
                                fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                boxSizing: 'border-box',
                                fontSize: 14,
                                maxWidth: 600,
                                display: 'block',
                                margin: '0 auto',
                                padding: 20,
                            }}
                        >
                            <table
                                className="main"
                                width="100%"
                                cellPadding={0}
                                cellSpacing={0}
                                style={{
                                    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                    boxSizing: 'border-box',
                                    fontSize: 14,
                                    borderRadius: 3,
                                    backgroundColor: '#fff',
                                    margin: 0,
                                    border: '1px solid #e9e9e9',
                                }}
                                bgcolor="#fff"
                            >
                                <tbody>
                                    <tr
                                        style={{
                                            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                            boxSizing: 'border-box',
                                            fontSize: 14,
                                            margin: 0,
                                        }}
                                    >
                                        <td
                                            style={{
                                                fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                boxSizing: 'border-box',
                                                fontSize: 16,
                                                verticalAlign: 'top',
                                                color: '#fff',
                                                fontWeight: 500,
                                                textAlign: 'center',
                                                borderRadius: '3px 3px 0 0',
                                                backgroundColor: '#38414a',
                                                margin: 0,
                                                padding: 20,
                                            }}
                                            align="center"
                                            valign="top"
                                        >
                                            <a href="#">
                                                {' '}
                                                <img src={logo} height={24} alt="logo" />
                                            </a>{' '}
                                            <br />
                                            <span style={{ marginTop: 10, display: 'block' }}>
                                                Warning: You&apos;re approaching your limit. Please upgrade.
                                            </span>
                                        </td>
                                    </tr>
                                    <tr
                                        style={{
                                            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                            boxSizing: 'border-box',
                                            fontSize: 14,
                                            margin: 0,
                                        }}
                                    >
                                        <td
                                            className="content-wrap"
                                            style={{
                                                fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                boxSizing: 'border-box',
                                                fontSize: 14,
                                                verticalAlign: 'top',
                                                margin: 0,
                                                padding: 20,
                                            }}
                                            valign="top"
                                        >
                                            <table
                                                width="100%"
                                                cellPadding={0}
                                                cellSpacing={0}
                                                style={{
                                                    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                    boxSizing: 'border-box',
                                                    fontSize: 14,
                                                    margin: 0,
                                                }}
                                            >
                                                <tbody>
                                                    <tr
                                                        style={{
                                                            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                            boxSizing: 'border-box',
                                                            fontSize: 14,
                                                            margin: 0,
                                                        }}
                                                    >
                                                        <td
                                                            className="content-block"
                                                            style={{
                                                                fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                                boxSizing: 'border-box',
                                                                fontSize: 14,
                                                                verticalAlign: 'top',
                                                                margin: 0,
                                                                padding: '0 0 20px',
                                                            }}
                                                            valign="top"
                                                        >
                                                            You have{' '}
                                                            <strong
                                                                style={{
                                                                    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                                    boxSizing: 'border-box',
                                                                    fontSize: 14,
                                                                    margin: 0,
                                                                }}
                                                            >
                                                                1 free report
                                                            </strong>{' '}
                                                            remaining.
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style={{
                                                            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                            boxSizing: 'border-box',
                                                            fontSize: 14,
                                                            margin: 0,
                                                        }}
                                                    >
                                                        <td
                                                            className="content-block"
                                                            style={{
                                                                fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                                boxSizing: 'border-box',
                                                                fontSize: 14,
                                                                verticalAlign: 'top',
                                                                margin: 0,
                                                                padding: '0 0 20px',
                                                            }}
                                                            valign="top"
                                                        >
                                                            Add your credit card now to upgrade your account to a premium plan to ensure you
                                                            don&apos;t miss out on any reports.
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style={{
                                                            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                            boxSizing: 'border-box',
                                                            fontSize: 14,
                                                            margin: 0,
                                                        }}
                                                    >
                                                        <td
                                                            className="content-block"
                                                            style={{
                                                                fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                                boxSizing: 'border-box',
                                                                fontSize: 14,
                                                                verticalAlign: 'top',
                                                                margin: 0,
                                                                padding: '0 0 20px',
                                                            }}
                                                            valign="top"
                                                        >
                                                            <a
                                                                href="#"
                                                                className="btn-primary"
                                                                style={{
                                                                    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                                    boxSizing: 'border-box',
                                                                    fontSize: 14,
                                                                    color: '#FFF',
                                                                    textDecoration: 'none',
                                                                    lineHeight: '2em',
                                                                    fontWeight: 'bold',
                                                                    textAlign: 'center',
                                                                    cursor: 'pointer',
                                                                    display: 'inline-block',
                                                                    borderRadius: 5,
                                                                    textTransform: 'capitalize',
                                                                    backgroundColor: '#465dff',
                                                                    margin: 0,
                                                                    borderColor: '#465dff',
                                                                    borderStyle: 'solid',
                                                                    borderWidth: '8px 16px',
                                                                }}
                                                            >
                                                                Upgrade my account
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style={{
                                                            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                            boxSizing: 'border-box',
                                                            fontSize: 14,
                                                            margin: 0,
                                                        }}
                                                    >
                                                        <td
                                                            className="content-block"
                                                            style={{
                                                                fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                                boxSizing: 'border-box',
                                                                fontSize: 14,
                                                                verticalAlign: 'top',
                                                                margin: 0,
                                                                padding: '0 0 20px',
                                                            }}
                                                            valign="top"
                                                        >
                                                            Thanks for choosing <b>Osen</b> Admin.
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div
                                className="footer"
                                style={{
                                    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                    boxSizing: 'border-box',
                                    fontSize: 14,
                                    width: '100%',
                                    clear: 'both',
                                    color: '#999',
                                    margin: 0,
                                    padding: 20,
                                }}
                            >
                                <table
                                    width="100%"
                                    style={{
                                        fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                        boxSizing: 'border-box',
                                        fontSize: 14,
                                        margin: 0,
                                    }}
                                >
                                    <tbody>
                                        <tr
                                            style={{
                                                fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                boxSizing: 'border-box',
                                                fontSize: 14,
                                                margin: 0,
                                            }}
                                        >
                                            <td
                                                className="aligncenter content-block"
                                                style={{
                                                    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                    boxSizing: 'border-box',
                                                    fontSize: 12,
                                                    verticalAlign: 'top',
                                                    color: '#999',
                                                    textAlign: 'center',
                                                    margin: 0,
                                                    padding: '0 0 20px',
                                                }}
                                                align="center"
                                                valign="top"
                                            >
                                                <a
                                                    href="#"
                                                    style={{
                                                        fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                        boxSizing: 'border-box',
                                                        fontSize: 12,
                                                        color: '#999',
                                                        textDecoration: 'underline',
                                                        margin: 0,
                                                    }}
                                                >
                                                    Unsubscribe
                                                </a>
                                                from these alerts.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </td>
                    <td
                        style={{
                            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                            boxSizing: 'border-box',
                            fontSize: 14,
                            verticalAlign: 'top',
                            margin: 0,
                        }}
                        valign="top"
                    />
                </tr>
            </tbody>
        </table>
    );
};

export default BasicEmailPage;
