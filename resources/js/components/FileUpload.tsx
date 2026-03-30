import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import DropzoneFormInput from './form/DropzoneFormInput';

const FileUpload = ({ title }: { title: string }) => {
    return (
        <Card>
            <CardHeader className="border-bottom border-dashed">
                <CardTitle className="mb-0" as={'h4'}>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardBody>
                <DropzoneFormInput
                    className=""
                    iconProps={{ icon: 'tabler:cloud-upload', height: 32, width: 32, className: 'mb-1' }}
                    text="Drop your images here, or click to browse"
                    helpText={<span className="text-muted fs-13 ">(1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed )</span>}
                    showPreview
                />
            </CardBody>
        </Card>
    );
};

export default FileUpload;
