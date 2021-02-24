import ReactPlayer from 'react-player';
import './video.css';
import Personal from '../personal/Personal';
import {useSelector} from 'react-redux';

const Video = () => {
    const moveInfo = useSelector(({moveReducer}) => moveReducer);
    return (
        <div className='vid'>
            {/* <video controls={true}>
                <source src={`${moveInfo.video}`} type="video/mp4"/>
            </video> */}
            <ReactPlayer url={`${moveInfo.video}`} controls={true} className='video'/>
            <Personal />
        </div>
    )
}

export default Video;