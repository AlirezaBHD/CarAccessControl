export const formatPlate = (plateText) => {
    if (!plateText || typeof plateText !== 'string') {
        return '';
    }

    const cleanPlate = plateText.replace(/\s/g, '');

    if (cleanPlate.length < 7) {
        return cleanPlate;
    }

    const firstTwoDigits = cleanPlate.substring(0, 2);
    const lastFiveDigits = cleanPlate.substring(cleanPlate.length - 5);
    const middlePart = cleanPlate.substring(2, cleanPlate.length - 5);

    return `${firstTwoDigits} ${middlePart} ${lastFiveDigits.substring(0, 3)} | ${lastFiveDigits.substring(3, 5)}`.trim();
};

export const PersianPlate = ({ plate, className = '' }) => {
    const formattedPlate = formatPlate(plate);

    return (
        <span dir='ltr' className={`font-bold border-1 rounded-xs p-0.5 text-primary ${className}`}>
            {formattedPlate}
        </span>
    );
};



export default {
    formatPlate,
    PersianPlate
};