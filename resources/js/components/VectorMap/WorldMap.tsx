import 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import BaseVectorMap from './BaseVectorMap';

//components

interface WorldVectorMapProps {
    width?: string;
    height?: string;
    options?: any;
}

const WorldVectorMap = ({ width, height, options }: WorldVectorMapProps) => {
    return (
        <>
            <BaseVectorMap width={width} height={height} options={options} type="world" />
        </>
    );
};

export default WorldVectorMap;
