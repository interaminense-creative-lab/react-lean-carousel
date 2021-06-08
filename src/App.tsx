import React from 'react';
import Carousel from './carousel/Carousel';

import Image01 from './assets/image-01.png';
import Image02 from './assets/image-02.png';
import Image03 from './assets/image-03.png';
import Image04 from './assets/image-04.png';

import './App.css';

function Artist() {
    return (
        <a className="artist" href="https://www.behance.net/Mambeska" rel="noreferrer" target="_blank">
            <img className="artist__thumbnail" src="https://mir-s3-cdn-cf.behance.net/user/230/cb6ffc2121887.59f851b39a4cc.jpg" alt="Julia Molchanova"/>
            <div className="artist__content">
                <small>Artist</small>
                <span>Julia Molchanova</span>
            </div>
        </a>
    );
}

function App() {
    return (
        <div className="App">
            <h1>React <span className="lights-on">Lean</span> Carousel</h1>

            <Carousel width={850} height={412} config={{
                autoPlaySpeed: 5000,
                enableAutoPlay: false,
                enableIndicators: true,
                enableKeyDown: true,
            }}>
                <Artist />

                <Carousel.Items>
                    <Carousel.Item>
                        <img width={850} height={412} src={Image01} alt="1" />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={850} height={412} src={Image02} alt="2" />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={850} height={412} src={Image03} alt="3" />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={850} height={412} src={Image04} alt="4" />
                    </Carousel.Item>
                </Carousel.Items>

                <Carousel.Controls
                    prevTrigger={<button className="btn">Prev</button>}
                    nextTrigger={<button className="btn">Next</button>}
                />
            </Carousel>
        </div>
    );
}

export default App;