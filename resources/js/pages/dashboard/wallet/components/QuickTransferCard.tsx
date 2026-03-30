import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import avatar2 from '@/images/users/avatar-2.jpg';
import avatar3 from '@/images/users/avatar-3.jpg';
import avatar4 from '@/images/users/avatar-4.jpg';
import avatar5 from '@/images/users/avatar-5.jpg';
import avatar8 from '@/images/users/avatar-8.jpg';

import { Button, Card, CardBody, CardHeader, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';

const QuickTransferCard = () => {
    return (
        <Card>
            <CardHeader className="d-flex border-bottom border-dashed align-items-center">
                <h4 className="header-title me-auto">
                    Quick Transfer &nbsp;
                    <IconifyIcon
                        icon="tabler:info-octagon"
                        className="text-muted ms-1 icons-center"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="This top tooltip is themed via CSS variables."
                    >
                        {' '}
                    </IconifyIcon>
                </h4>
                <Dropdown>
                    <DropdownToggle as={'a'} className="drop-arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                        <IconifyIcon icon="tabler-dots-vertical" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem>Sales Report</DropdownItem>
                        <DropdownItem>Export Report</DropdownItem>
                        <DropdownItem>Profit</DropdownItem>
                        <DropdownItem>Action</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </CardHeader>
            <CardBody>
                <div className="d-flex gap-1 justify-content-center">
                    <div className="avatar">
                        <img
                            src={avatar4}
                            data-bs-toggle="tooltip"
                            data-bs-title="Alexa Newsome"
                            alt="avatar"
                            className="rounded-circle img-thumbnail avatar-lg"
                        />
                    </div>
                    <div className="avatar">
                        <img
                            src={avatar5}
                            data-bs-toggle="tooltip"
                            data-bs-title="Shelly Dorey"
                            alt="avatar"
                            className="rounded-circle img-thumbnail border-primary avatar-lg"
                        />
                    </div>
                    <div className="avatar">
                        <img
                            src={avatar3}
                            data-bs-toggle="tooltip"
                            data-bs-title="Fredrick Arnett"
                            alt="avatar"
                            className="rounded-circle img-thumbnail avatar-lg"
                        />
                    </div>
                    <div className="avatar">
                        <img
                            src={avatar8}
                            data-bs-toggle="tooltip"
                            data-bs-title="Barbara Frink"
                            alt="avatar"
                            className="rounded-circle img-thumbnail avatar-lg"
                        />
                    </div>
                    <div className="avatar">
                        <img
                            src={avatar2}
                            data-bs-toggle="tooltip"
                            data-bs-title="Adam M"
                            alt="avatar"
                            className="rounded-circle img-thumbnail avatar-lg"
                        />
                    </div>
                </div>
                <div className="mt-3 mb-2">
                    <label htmlFor="cardnumber" className="form-label">
                        Card Number
                    </label>
                    <input type="text" id="cardnumber" className="form-control" defaultValue="3658 9857 5820 0039" />
                </div>
                <div className="mt-3 mb-2">
                    <label htmlFor="enterAmount" className="form-label">
                        Enter Amount
                    </label>
                    <input type="text" id="enterAmount" className="form-control" defaultValue={`${currency}963.25`} />
                </div>
                <Row className="g-2 mt-3">
                    <Col>
                        <Button variant="primary" className="w-100">
                            Send Money
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="outline-info" className="w-100">
                            Save as Draft
                        </Button>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default QuickTransferCard;
