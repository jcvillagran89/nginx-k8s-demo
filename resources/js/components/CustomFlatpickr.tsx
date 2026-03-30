import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";

type FlatpickrProps = {
    className?: string;
    value?: any; // para rangos es más cómodo dejarlo flexible
    options?: any;
    placeholder?: string;
    onChange?: (selectedDates: Date[], dateStr: string, instance: any) => void;
};

const CustomFlatpickr = ({
    className,
    value,
    options,
    placeholder,
    onChange,
}: FlatpickrProps) => {
    return (
        <Flatpickr
            className={className}
            value={value}
            options={{
                locale: Spanish,
                ...options,
            }}
            placeholder={placeholder}
            onChange={onChange}  // 👈 AQUÍ ESTABA EL PECADO
        />
    );
};

export default CustomFlatpickr;
