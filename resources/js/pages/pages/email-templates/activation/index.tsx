import logoDark from '@/images/logo-dark.png';
import { Link } from '@inertiajs/react';

const AccountActivationPage = () => {
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
                                itemProp="action"
                                itemScope
                                itemType="http://schema.org/ConfirmAction"
                                style={{
                                    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                    boxSizing: 'border-box',
                                    fontSize: 14,
                                    borderRadius: 3,
                                    margin: 0,
                                    border: 'none',
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
                                            className="content-wrap"
                                            style={{
                                                fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                boxSizing: 'border-box',
                                                fontSize: 14,
                                                verticalAlign: 'top',
                                                margin: 0,
                                                padding: 30,
                                                border: '3px solid #4fc6e1',
                                                borderRadius: 7,
                                                backgroundColor: '#fff',
                                            }}
                                            valign="top"
                                        >
                                            <meta
                                                itemProp="name"
                                                content="Confirm Email"
                                                style={{
                                                    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
                                                    boxSizing: 'border-box',
                                                    fontSize: 14,
                                                    margin: 0,
                                                }}
                                            />
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
                                                    <tr>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <Link href="" style={{ display: 'block', marginBottom: 10 }}>
                                                                {' '}
                                                                <img src={logoDark} height={24} alt="logo" />
                                                            </Link>{' '}
                                                            <br />
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
                                                            Please confirm your email address by clicking the link below.
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
                                                            We may need to send you critical information about our service and it is important that we
                                                            have an accurate email address.
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
                                                            itemProp="handler"
                                                            itemScope
                                                            itemType="http://schema.org/HttpActionHandler"
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
                                                            <Link
                                                                href=""
                                                                className="btn-primary"
                                                                itemProp="url"
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
                                                                    backgroundColor: '#6658dd',
                                                                    margin: 0,
                                                                    borderColor: '#6658dd',
                                                                    borderStyle: 'solid',
                                                                    borderWidth: '8px 16px',
                                                                }}
                                                            >
                                                                Confirm email address
                                                            </Link>
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
                                                            — <b>Osen</b> - Admin Dashboard
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

export default AccountActivationPage;
