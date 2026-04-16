import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { useState } from 'react'
import { value_converter } from '../../data'
import moment from 'moment'


const PlayVideo = ({ videoId }) => {

       const [apiData, setApiData] = useState(null);

       const fetchVideoData = async () => {

        const videoDetails_Url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        await fetch(videoDetails_Url).then(res => res.json()).then(data => setApiData(data.items[0]));


         }

         useEffect(() => {
            fetchVideoData();
            }, [])





    return (
        <div className='play-video'>
             <iframe  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <h3>{apiData ? apiData.snippet.title : "Title Here"} </h3>
            
            <div className='play-video-info'>
                <p>{apiData?value_converter(apiData.statistics.viewCount) : "16k"} Views &bull; {moment(apiData.snippet.publishedAt).fromNow()} </p>
                <div>
                    <span><img src={like} alt="" /> 125</span>
                    <span><img src={dislike} alt="" /> 2</span>
                    <span><img src={share} alt="" /> Share</span>
                    <span><img src={save} alt="" /> Save</span>


                </div>
            </div>

            <hr />
            <div className='publisher'>
                <img src={jack} alt="" />
                <div>
                    <p>GreatStack</p>
                    <span>1M Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className='vid-description'>
                <p>Channel that makes learning Easy</p>
                <p>Subscribe GreatStack to watch more Tutorials on web development</p>
                <hr />
                <h4>130 Comments</h4>
                <div className='comment'>
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Jack Nicholson <span>1 day ago</span></h3>
                        <p>Web development is the process of building and maintaining websites. It involves creating how a website looks (front-end) and how it works behind the scenes (back-end). Web development is important because it powers many online services and offers great career opportunities.
                        </p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>244</span>
                            <img src={dislike} alt="" />
                        </div>

                    </div>
                </div>
                <div className='comment'>
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Jack Nicholson <span>1 day ago</span></h3>
                        <p>Web development is the process of building and maintaining websites. It involves creating how a website looks (front-end) and how it works behind the scenes (back-end). Web development is important because it powers many online services and offers great career opportunities.
                        </p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>244</span>
                            <img src={dislike} alt="" />
                        </div>

                    </div>
                </div>
                <div className='comment'>
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Jack Nicholson <span>1 day ago</span></h3>
                        <p>Web development is the process of building and maintaining websites. It involves creating how a website looks (front-end) and how it works behind the scenes (back-end). Web development is important because it powers many online services and offers great career opportunities.
                        </p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>244</span>
                            <img src={dislike} alt="" />
                        </div>

                    </div>
                </div>
                <div className='comment'>
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Jack Nicholson <span>1 day ago</span></h3>
                        <p>Web development is the process of building and maintaining websites. It involves creating how a website looks (front-end) and how it works behind the scenes (back-end). Web development is important because it powers many online services and offers great career opportunities.
                        </p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>244</span>
                            <img src={dislike} alt="" />
                        </div>

                    </div>
                </div>
                <div className='comment'>
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Jack Nicholson <span>1 day ago</span></h3>
                        <p>Web development is the process of building and maintaining websites. It involves creating how a website looks (front-end) and how it works behind the scenes (back-end). Web development is important because it powers many online services and offers great career opportunities.
                        </p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>244</span>
                            <img src={dislike} alt="" />
                        </div>

                    </div>
                </div>
                <div className='comment'>
                    <img src={user_profile} alt="" />
                    <div>
                        <h3>Jack Nicholson <span>1 day ago</span></h3>
                        <p>Web development is the process of building and maintaining websites. It involves creating how a website looks (front-end) and how it works behind the scenes (back-end). Web development is important because it powers many online services and offers great career opportunities.
                        </p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>244</span>
                            <img src={dislike} alt="" />
                        </div>

                    </div>
                </div>
            </div>




        </div>
    )
}

export default PlayVideo
