import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import { Card, CardBody, CardTitle, Col, ProgressBar, Row } from 'react-bootstrap';
import { abilitiesData, experienceData } from '../data';

const PersonalInformation = () => {
    return (
        <Card>
            <CardBody>
                <Row>
                    <Col xl={6} lg={12}>
                        <div>
                            <CardTitle as={'h4'}>Personal Information :</CardTitle>
                            <div className="table-responsive mt-3 border border-dashed rounded px-2 py-1">
                                <table className="table table-borderless m-0">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <p className="mb-0"> Doctor Name : </p>
                                            </td>
                                            <td className="px-2 text-dark fw-medium fs-14">James D. Roger</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0"> Position : </p>
                                            </td>
                                            <td className="px-2 text-dark fw-medium fs-14">General Cardiology , CHO</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0"> Mobile Number : </p>
                                            </td>
                                            <td className="px-2 text-dark fw-medium fs-14">+96 303-975-3491</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0">Email Address : </p>
                                            </td>
                                            <td className="px-2 text-dark fw-medium fs-14">jamesdroger@armyspy.com</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="mb-0">Location : </p>
                                            </td>
                                            <td className="px-2 text-dark fw-medium fs-14">1971 Carter Street Stoups, IL 63101, USA</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p className="d-flex mb-0 align-items-center gap-1">Web Site : </p>
                                            </td>
                                            <td className="px-2 text-dark fw-medium fs-14">
                                                <Link href="">www.coderthemes.com </Link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Col>
                    <Col xl={6} lg={12}>
                        <div>
                            <CardTitle as={'h4'}>Abilities :</CardTitle>
                            {abilitiesData.map((item, idx) => (
                                <Fragment key={idx}>
                                    <div className="d-flex align-items-center justify-content-between mt-4 mb-1">
                                        <p className="mb-0 fs-15 fw-medium text-dark">{item.title}</p>
                                        <div>
                                            <p className="mb-0 fs-15 fw-medium text-dark">{item.progress}%</p>
                                        </div>
                                    </div>
                                    <ProgressBar
                                        variant={item.variant}
                                        className={`progress-soft progress-md`}
                                        role="progressbar"
                                        now={item.progress}
                                    />
                                </Fragment>
                            ))}
                        </div>
                    </Col>
                </Row>
                <CardTitle as={'h4'} className="mt-3 pt-2">
                    Experience :
                </CardTitle>
                <Row className="g-3 mt-1">
                    {experienceData.map((item, idx) => (
                        <Col xl={6} lg={12} key={idx}>
                            <div className="d-flex flex-wrap p-2 align-items-center rounded gap-3 border">
                                <img src={item.image} alt="profile" className="avatar-xl" />
                                <div>
                                    <p className="text-dark fw-semibold mb-1 fs-16">{item.title}</p>
                                    <p className="text-dark fw-medium mb-1 fs-14">ETN Doctor - {item.subTitle}</p>
                                    <p className="mb-1">{item.description}</p>
                                    <p className="mb-1">{item.address}</p>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </CardBody>
        </Card>
    );
};

export default PersonalInformation;
