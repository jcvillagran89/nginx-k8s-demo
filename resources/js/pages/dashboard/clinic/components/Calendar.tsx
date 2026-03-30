import CustomFlatpickr from '@/components/CustomFlatpickr';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button, Card, CardBody, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';

const Calendar = () => {
    return (
        <Col lg={4}>
            <Card>
                <div className="d-flex card-header justify-content-between align-items-center border-bottom border-dashed">
                    <h4 className="header-title">My Calendar</h4>
                    <Dropdown align={'end'}>
                        <DropdownToggle as={'a'} className="drop-arrow-none card-drop p-0" data-bs-toggle="dropdown" aria-expanded="false">
                            <IconifyIcon icon="tabler-dots-vertical" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem>Refresh Report</DropdownItem>
                            <DropdownItem>Export Report</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <CardBody>
                    <CustomFlatpickr
                        className="form-control d-none"
                        placeholder="Inline Calender"
                        options={{
                            inline: true,
                            enableTime: false,
                        }}
                    />
                    <div className="text-center mt-2">
                        <Button size="sm" variant="primary">
                            Schedule a Metting <IconifyIcon icon="tabler:arrow-right" className="ms-1" />
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
};

export default Calendar;
