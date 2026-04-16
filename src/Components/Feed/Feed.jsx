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
                // Build search URL based on category
                let searchUrl;
                if (category === 0) {
                    // For Home, use most popular videos
                    searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&regionCode=US&type=video&order=viewCount&key=${API_KEY}`;
                } else {
                    // For other categories, filter by videoCategoryId
                    searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&regionCode=US&type=video&videoCategoryId=${category}&order=viewCount&key=${API_KEY}`;
                }

                const searchResponse = await fetch(searchUrl);
                const searchResult = await searchResponse.json();

                if (!searchResponse.ok) {
                    throw new Error(searchResult.error?.message || 'Failed to fetch data');
                }

                // Get video IDs from search results
                const videoIds = searchResult.items?.map(item => item.id.videoId).join(',') || '';

                if (!videoIds) {
                    setData([]);
                    return;
                }

                // Fetch detailed video stats
                const videosUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`;
                const videosResponse = await fetch(videosUrl);
                const videosResult = await videosResponse.json();

                // Merge search results with statistics
                const mergedData = searchResult.items.map((searchItem, index) => ({
                    ...searchItem,
                    id: searchItem.id.videoId,
                    statistics: videosResult.items?.[index]?.statistics || { viewCount: 0 }
                }));

                setData(mergedData);
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