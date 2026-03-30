import 'jsvectormap';
import 'jsvectormap/dist/maps/canada.js';
import BaseVectorMap from './BaseVectorMap';

//components

interface CanadaVectorMapProps {
    width?: string;
    height?: string;
    options?: any;
}

const CanadaVectorMap = ({ width, height, options }: CanadaVectorMapProps) => {
    return (
        <>
            <BaseVectorMap width={width} height={height} options={options} type="canada" />
        </>
    );
};

export default CanadaVectorMap;
