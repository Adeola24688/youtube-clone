import './Recommended.css'
import thumbnail1 from '../../assets/thumbnail1.png'
import thumbnail2 from '../../assets/thumbnail2.png'
import thumbnail3 from '../../assets/thumbnail3.png'
import thumbnail4 from '../../assets/thumbnail4.png'
import thumbnail5 from '../../assets/thumbnail5.png'
import thumbnail6 from '../../assets/thumbnail6.png'
import thumbnail7 from '../../assets/thumbnail7.png'
import thumbnail8 from '../../assets/thumbnail8.png'
import { useState, useEffect } from 'react'
import { API_KEY, value_converter } from '../../data'
import { Link } from 'react-router-dom'
import moment from 'moment'


const Recommended = ({ categoryId }) => {

    const [apiData, setApiData] = useState([]);
    const fallbackThumbnails = [thumbnail1, thumbnail2, thumbnail3, thumbnail4, thumbnail5, thumbnail6, thumbnail7, thumbnail8];

    const fetchData = async () => {
        try {
            const relatedVideo_Url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&maxResults=45&videoCategoryId=${categoryId}&key=${API_KEY}`;
            const response = await fetch(relatedVideo_Url);
            const data = await response.json();
            
            // Filter out videos with missing thumbnails or statistics
            const validVideos = data.items?.filter(item => 
                item.snippet?.thumbnails && 
                item.statistics?.viewCount &&
                item.snippet.channelTitle
            ) || [];
            
            setApiData(validVideos);
        } catch (error) {
            console.error('Error fetching recommended videos:', error);
            setApiData([]);
        }
    }

    useEffect(() => {
        fetchData();
    }, [categoryId])






    return (
        <div className='recommended'>
            {apiData && apiData.length > 0 ? (
                apiData.map((item, index) => {
                    // Get the best available thumbnail with fallbacks
                    const thumbnail = 
                        item.snippet.thumbnails?.high?.url ||
                        item.snippet.thumbnails?.medium?.url ||
                        item.snippet.thumbnails?.default?.url;
                    
                    const fallback = fallbackThumbnails[index % fallbackThumbnails.length];
                    
                    return (
                        <Link to={`/video/${item.snippet.categoryId || 0}/${item.id}`} className="side-video-list" key={item.id}>
                            <img 
                                src={thumbnail || fallback} 
                                alt={item.snippet.title}
                                onError={(e) => { e.target.src = fallback; }}
                            />
                            <div className="vid-info">
                                <h4>{item.snippet.title}</h4>
                                <p>{item.snippet.channelTitle}</p>
                                <p>{value_converter(item.statistics.viewCount)} views • {moment(item.snippet.publishedAt).fromNow()}</p>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading recommended videos...</div>
            )}
        </div>
    )
}

export default Recommended
