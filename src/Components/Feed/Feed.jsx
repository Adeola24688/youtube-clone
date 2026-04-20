import { useState, useEffect } from 'react';
import './Feed.css';
import { Link } from 'react-router-dom';
import { API_KEY } from '../../data';
import moment from 'moment';
import fallbackThumbnail from '../../assets/thumbnail1.png';
import fallbackThumbnai2 from "../../assets/thumbnail2.png"
import fallbackThumbnai3 from "../../assets/thumbnail3.png"
import fallbackThumbnai4 from "../../assets/thumbnail4.png"
import fallbackThumbnai5 from "../../assets/thumbnail5.png"
import fallbackThumbnai6 from "../../assets/thumbnail6.png"
import fallbackThumbnai7 from "../../assets/thumbnail7.png"
import fallbackThumbnai8 from "../../assets/thumbnail8.png"

const Feed = ({ category }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fallbackThumbnails = [fallbackThumbnail, fallbackThumbnai2, fallbackThumbnai3, fallbackThumbnai4, fallbackThumbnai5, fallbackThumbnai6, fallbackThumbnai7, fallbackThumbnai8];
    const randomFallback = Math.floor(Math.random() * fallbackThumbnails.length);
    const fallback = fallbackThumbnails[randomFallback];

    // Fetch videos
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                let videoUrl;
                
                if (category === 0) {
                    // For Home, show a message about API quota and use placeholder data
                    try {
                        const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&q=tutorial&key=${API_KEY}`;
                        const searchResponse = await fetch(searchUrl);
                        const searchResult = await searchResponse.json();

                        if (searchResult.items && searchResult.items.length > 0) {
                            const formattedData = searchResult.items
                                .filter(item => item.id.videoId)
                                .map(item => ({
                                    id: item.id.videoId,
                                    snippet: item.snippet,
                                    statistics: { viewCount: 0, likeCount: 0, commentCount: 0 }
                                }));
                            setData(formattedData);
                        } else {
                            throw new Error('No videos found');
                        }
                    } catch (err) {
                        // If API fails due to quota, show limited placeholder data
                        console.warn('Using fallback data due to API quota limit');
                        setError('API Quota limit reached. Please try again later or use another API key.');
                        setData([]);
                    }
                    return;
                } else {
                    // For categories, use videos endpoint with chart=mostPopular
                    videoUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=50&videoCategoryId=${category}&key=${API_KEY}`;
                    
                    console.log('Fetching category videos from:', videoUrl);
                    const response = await fetch(videoUrl);
                    const result = await response.json();

                    console.log('Category videos result:', result);

                    if (!response.ok) {
                        throw new Error(result.error?.message || 'Failed to fetch data');
                    }

                    if (!result.items || result.items.length === 0) {
                        console.warn('No items found for category:', category);
                        setData([]);
                        return;
                    }

                    // Format data to match the structure
                    const formattedData = result.items.map(item => ({
                        id: item.id,
                        snippet: item.snippet,
                        statistics: item.statistics
                    }));

                    console.log('Formatted category data:', formattedData);
                    setData(formattedData);
                }
            } catch (err) {
                console.error('Error fetching videos:', err);
                setError(`Failed to load videos: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category]);

    // Format numbers (views)
    const formatViews = (value) => {
        const num = Number(value);
        if (num >= 1_000_000) return Math.floor(num / 1_000_000) + 'M';
        if (num >= 1_000) return Math.floor(num / 1_000) + 'K';
        return num;
    };

    if (loading) return <div className="feed">Loading...</div>;
    if (error) return (
        <div className="feed" style={{ padding: '40px', textAlign: 'center', fontSize: '16px' }}>
            <h2>API Quota Exceeded</h2>
            <p>{error}</p>
            <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                Your YouTube API quota has been exceeded for today (24-hour limit: 10,000 requests/day).<br/>
                Please wait 24 hours or <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">create your own API key</a>
            </p>
        </div>
    );

    return (
        <div className="feed">
            {data.map((item) => {
                const snippet = item.snippet || {};
                const stats = item.statistics || {};
                const videoId = item.id;

                const thumbnail =
                    snippet.thumbnails?.maxres?.url ||
                    snippet.thumbnails?.high?.url ||
                    snippet.thumbnails?.medium?.url ||
                    snippet.thumbnails?.default?.url ||
                    '';

                return (
                    <Link
                        to={`/video/${snippet.categoryId || 0}/${videoId}`}
                        className="card"
                        key={videoId}
                    >
                        <img
                            src={thumbnail}
                            alt={snippet.title || 'Video thumbnail'}
                            onLoad={(e) => {
                                if (e.target.naturalWidth === 120 && e.target.src.includes('ytimg.com')) {
                                    if (e.target.src.includes('hqdefault') || e.target.src.includes('maxresdefault') || e.target.src.includes('sddefault')) {
                                        e.target.src = fallback;
                                    }
                                }
                            }}
                            onError={(e) => { e.target.src = fallback; e.target.onError = null; }}
                        />

                        <h2>{snippet.title}</h2>
                        <h3>{snippet.channelTitle}</h3>

                        <p>
                            {formatViews(stats.viewCount)} views &bull;{' '}
                            {snippet.publishedAt
                                ? moment(snippet.publishedAt).fromNow()
                                : ''}
                        </p>
                    </Link>
                );
            })}
        </div>
    );
};

export default Feed;