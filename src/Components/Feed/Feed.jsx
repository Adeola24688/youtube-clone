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
                const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;

                const response = await fetch(url);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error?.message || 'Failed to fetch data');
                }

                setData(result.items || []);
            } catch (err) {
                console.error('Error fetching videos:', err);
                setError('Failed to load videos');
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
    if (error) return <div className="feed">{error}</div>;

    return (
        <div className="feed">
            {data.map((item) => {
                const snippet = item.snippet || {};
                const stats = item.statistics || {};

                const thumbnail =
                    snippet.thumbnails?.maxres?.url ||
                    snippet.thumbnails?.high?.url ||
                    snippet.thumbnails?.medium?.url ||
                    snippet.thumbnails?.default?.url ||
                    '';

                return (
                    <Link
                        to={`/video/${snippet.categoryId}/${item.id}`}
                        className="card"
                        key={item.id}
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