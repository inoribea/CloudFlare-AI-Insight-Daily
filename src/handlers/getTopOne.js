// src/handlers/getTopOne.js
import { fetchData } from '../helpers.js';

/**
 * 抓取 GitHub Trending 数据的核心逻辑
 * 支持多镜像源自动回退，确保稳定性
 */
export async function getTopOneLogic(since = 'daily') {
    const mirrors = [
        `https://api.gitterapp.com/repositories?since=${since}`,
        `https://github-trending-api.knicola.com/repositories?since=${since}`,
        `https://github-trending-api.vercel.app/repositories?since=${since}`
    ];

    let lastError = null;

    for (const url of mirrors) {
        try {
            console.log(`Trying to fetch GitHub Trending from: ${url}`);
            const data = await fetchData(url);
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        } catch (err) {
            console.warn(`Mirror failed: ${url}, error: ${err.message}`);
            lastError = err;
        }
    }

    throw new Error(`All GitHub Trending mirrors failed. Last error: ${lastError?.message}`);
}

/**
 * 处理 /topone 路由的 Handler
 */
export async function handleGetTopOne(request, env) {
    const url = new URL(request.url);
    const since = url.searchParams.get('since') || 'daily';

    try {
        const data = await getTopOneLogic(since);
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to fetch trending data', details: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}