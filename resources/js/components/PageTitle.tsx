import { Head, Link } from '@inertiajs/react';
import IconifyIcon from './wrappers/IconifyIcon';

const PageTitle = ({ title, subTitle }: { title: string; subTitle?: string }) => {
    return (
        <>
            <Head title={title} />
            <div className="page-title-head d-flex align-items-sm-center flex-sm-row flex-column gap-2">
                <div className="flex-grow-1">
                    <h4 className="fs-18 fw-semibold mb-0">{title}</h4>
                </div>
                <div className="text-end">
                    <ol className="breadcrumb m-0 py-0">
                        <li className="breadcrumb-item">
                            <Link href="">CCP Textil Lab</Link>
                        </li>
                        <div className="mx-1  flex-centered">
                            <IconifyIcon className="mt-0" icon="tabler:chevron-right" height={12} width={12} />
                        </div>
                        {subTitle && (
                            <>
                                <li className="breadcrumb-item">
                                    <Link href="">{subTitle}</Link>
                                </li>
                                <div className="mx-1  flex-centered">
                                    <IconifyIcon className="mt-0" icon="tabler:chevron-right" height={12} width={12} />
                                </div>
                            </>
                        )}

                        <li className="breadcrumb-item active">{title}</li>
                    </ol>
                </div>
            </div>
        </>
    );
};

export default PageTitle;
