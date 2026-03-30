import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Icon } from '@iconify/react';
import { Button, Col, ProgressBar, Row } from 'react-bootstrap';
import { Wizard, useWizard } from 'react-use-wizard';

const Header = ({ showProgress }: { showProgress?: boolean }) => {
    const { goToStep, activeStep, stepCount } = useWizard();

    return (
        <>
            <ul className="nav nav-pills nav-justified form-wizard-header mb-4" role="tablist">
                <li className="nav-item">
                    <a href="#" className={`nav-link rounded-0 py-2 ${activeStep === 0 ? 'active' : ''}`} onClick={() => goToStep(0)}>
                        <Icon icon="bi:person-circle" className="fs-18 align-middle me-1" />
                        <span className="d-none d-sm-inline">Account</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className={`nav-link rounded-0 py-2 ${activeStep === 1 ? 'active' : ''}`} onClick={() => goToStep(1)}>
                        <Icon icon="bi:emoji-smile" className="fs-18 align-middle me-1" />
                        <span className="d-none d-sm-inline">Profile</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className={`nav-link rounded-0 py-2 ${activeStep === 2 ? 'active' : ''}`} onClick={() => goToStep(2)}>
                        <Icon icon="bi:check2-circle" className="fs-18 align-middle me-1" />
                        <span className="d-none d-sm-inline">Finish</span>
                    </a>
                </li>
            </ul>
            {showProgress && (
                <ProgressBar animated striped variant="success" now={((activeStep + 1) / stepCount) * 100} className="mb-3 progress-sm" />
            )}
        </>
    );
};
const Step1 = () => {
    return (
        <form>
            <div id="basicwizard">
                <Row>
                    <Col xs={12}>
                        <Row className="mb-3">
                            <label className="col-md-3 col-form-label" htmlFor="userName">
                                User name
                            </label>
                            <Col md={9}>
                                <input type="text" className="form-control" id="userName" name="userName" defaultValue="johne" />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <label className="col-md-3 col-form-label" htmlFor="password">
                                {' '}
                                Password
                            </label>
                            <Col md={9}>
                                <input type="password" id="password" name="password" className="form-control" defaultValue={123456789} />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <label className="col-md-3 col-form-label" htmlFor="confirm">
                                Re Password
                            </label>
                            <Col md={9}>
                                <input type="password" id="confirm" name="confirm" className="form-control" defaultValue={123456789} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </form>
    );
};

const Step2 = () => {
    return (
        <form>
            <div id="basicwizard">
                <Row>
                    <Col xs={12}>
                        <Row className="mb-3">
                            <label className="col-md-3 col-form-label" htmlFor="name">
                                {' '}
                                First name
                            </label>
                            <Col md={9}>
                                <input type="text" id="name" name="name" className="form-control" defaultValue="Francis" />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <label className="col-md-3 col-form-label" htmlFor="surname">
                                {' '}
                                Last name
                            </label>
                            <Col md={9}>
                                <input type="text" id="surname" name="surname" className="form-control" defaultValue="Brinkman" />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <label className="col-md-3 col-form-label" htmlFor="email">
                                Email
                            </label>
                            <Col md={9}>
                                <input type="email" id="email" name="email" className="form-control" defaultValue="cory1979@hotmail.com" />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </form>
    );
};

const Step3 = () => {
    return (
        <form>
            <div id="basicwizard">
                <Row>
                    <Col xs={12}>
                        <div className="text-center">
                            <h2 className="mt-0">
                                <IconifyIcon icon="bi:check2-all" />
                            </h2>
                            <h3 className="mt-0">Thank you !</h3>
                            <p className="w-75 mb-2 mx-auto">
                                Quisque nec turpis at urna dictum luctus. Suspendisse convallis dignissim eros at volutpat. In egestas mattis dui.
                                Aliquam mattis dictum aliquet.
                            </p>
                            <div className="mb-3">
                                <div className="form-check d-inline-block">
                                    <input type="checkbox" className="form-check-input fs-15" id="customCheck1" />
                                    <label className="form-check-label" htmlFor="customCheck1">
                                        I agree with the Terms and Conditions
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </form>
    );
};

const Footer = () => {
    const { goToStep, nextStep, previousStep } = useWizard();

    return (
        <div className="d-flex wizard justify-content-between flex-wrap gap-2 mt-3">
            <div className="first">
                <Button variant="primary" onClick={() => goToStep(0)}>
                    First
                </Button>
            </div>
            <div className="d-flex flex-wrap gap-2">
                <div className="previous">
                    <Button variant="primary" onClick={previousStep}>
                        <IconifyIcon icon="bx:left-arrow-alt" className="me-2" />
                        Back To Previous
                    </Button>
                </div>
                <div className="next">
                    <Button variant="primary" className="mt-3 mt-md-0" onClick={nextStep}>
                        Next Step
                        <IconifyIcon icon="bx:right-arrow-alt" className="ms-2" />
                    </Button>
                </div>
            </div>
            <div className="last">
                <Button variant="primary" className="mt-3 mt-md-0" onClick={() => goToStep(2)}>
                    Finish
                </Button>
            </div>
        </div>
    );
};

const BasicWizard = () => {
    return (
        <ComponentContainerCard title="A Basic Wizard">
            <Wizard header={<Header />} footer={<Footer />}>
                <Step1 />
                <Step2 />
                <Step3 />
            </Wizard>
        </ComponentContainerCard>
    );
};

const WizardWithProgressBar = () => {
    return (
        <ComponentContainerCard title="Wizard With Progress Bar">
            <Wizard header={<Header showProgress />} footer={<Footer />}>
                <Step1 />
                <Step2 />
                <Step3 />
            </Wizard>
        </ComponentContainerCard>
    );
};
const AllWizard = () => {
    return (
        <Row>
            <Col lg={6}>
                <BasicWizard />
            </Col>
            <Col lg={6}>
                <WizardWithProgressBar />
            </Col>
        </Row>
    );
};

export default AllWizard;
