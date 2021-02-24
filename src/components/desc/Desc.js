import './desc.css';
import {useSelector} from 'react-redux';

const Desc = () => {
    const moveInfo = useSelector(({moveReducer}) => moveReducer);
return (
    <div className='desc'>
        <p>{moveInfo.description}</p>
    </div>
);
}

export default Desc;