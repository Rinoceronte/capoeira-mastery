import {useState, useEffect} from 'react';

const getDimensions = () => {
    return { width: window.innerWidth, height: window.innerHeight}
}

function useDimensions() {
    const [dimensions, setDimensions] = useState(() => getDimensions());

    useEffect(() => {
        const resizeListener = () => {
            setDimensions(getDimensions());
        }
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener);
    }, [])

    return dimensions;
}

export default useDimensions;