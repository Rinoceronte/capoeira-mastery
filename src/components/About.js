import React, { useState, useEffect } from 'react'

const About = () => {
    
    const [visited, setVisited] = useState(false);
    useEffect(() => {
        let visited = localStorage["alreadyVisited"];
        console.log(localStorage);
        if(visited) {
            setVisited(false);
        } else {
            setVisited(true);
        }
    }, []);

        return <div>{!visited ? <p className="about">
                        Lets help you improve your Capoeira skills! Click on video names to see instructions for new skills, add your own personal notes for each video at the bottom! Follow along and lets enjoy Capoeira together!
                    <span onClick={() => {
                        localStorage["alreadyVisited"] = true;
                        setVisited(true);
                    }} className="close">X</span></p> : <p className="about"></p>}
                </div>
}

export default About;