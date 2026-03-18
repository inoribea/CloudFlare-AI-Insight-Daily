// src/helpers.js

/**
 * Gets the current date or a specified date in YYYY-MM-DD format.
 * @param {Date} [dateObj] - Optional Date object. Defaults to current date.
 * @returns {string} Date string in YYYY-MM-DD format.
 */
export function getISODate(dateObj = new Date()) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Shanghai'
    };
    // 使用 'en-CA' 語言環境，因為它通常會產生 YYYY-MM-DD 格式的日期字串
    return dateObj.toLocaleDateString('en-CA', options);
}

export function getFetchDate() {
    // 优先返回当前日期，格式为 YYYY-MM-DD
    return getISODate();
}

export function setFetchDate(date) {
    // 这是一个占位符，如果未来需要支持手动设置日期，可以扩展
    console.log(`Setting fetch date to: ${date}`);
}

/**
 * Escapes HTML special characters in a string.
 * @param {*} unsafe The input to escape. If not a string, it's converted. Null/undefined become empty string.
 * @returns {string} The escaped string.
 */
export function escapeHtml(unsafe) {
    if (unsafe === null || typeof unsafe === 'undefined') {
        return '';
    }
    const str = String(unsafe);
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Generic fetch wrapper with JSON parsing and error handling.
 * @param {string} url - The URL to fetch.
 * @param {object} [options] - Fetch options.
 * @returns {Promise<object>} The JSON response or text for non-JSON.
 * @throws {Error} If the fetch fails or response is not ok.
 */
export async function fetchData(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}, url: ${url}`);
    }
    return response.json();
}

/**
 * Removes markdown code block fences (```json or ```) from a string.
 * @param {string} text - The input string potentially containing markdown code fences.
 * @returns {string} The string with markdown code fences removed.
 */
export function removeMarkdownCodeBlock(text) {
    if (!text) return '';
    let cleanedText = text.trim();

    const jsonFence = "```json";
    const genericFence = "```";

    if (cleanedText.startsWith(jsonFence)) {
        cleanedText = cleanedText.substring(jsonFence.length);
    } else if (cleanedText.startsWith(genericFence)) {
        cleanedText = cleanedText.substring(genericFence.length);
    }

    if (cleanedText.endsWith(genericFence)) {
        cleanedText = cleanedText.substring(0, cleanedText.length - genericFence.length);
    }
    return cleanedText.trim();
}

/**
 * Strips HTML tags from a string and normalizes whitespace.
 * @param {string} html - The HTML string.
 * @returns {string} The text content without HTML tags.
 */
export function stripHtml(html) {
    if (!html) return "";

    // 處理 img 標籤，保留其 src 和 alt 屬性
    let processedHtml = html.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, (match, src, alt) => {
        return alt ? `[图片: ${alt} ${src}]` : `[图片: ${src}]`;
    });
    processedHtml = processedHtml.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '[图片: ${src}]');

    // 处理 video 标签，保留其 src 属性
    processedHtml = processedHtml.replace(/<video[^>]*src="([^"]*)"[^>]*>.*?<\/video>/gi, '[视频: $1]');

    // 移除所有其他 HTML 标签，并规范化空白
    return processedHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Converts a date string to a Date object representing the time in Asia/Shanghai timezone.
 * This is crucial for consistent date comparisons across different environments.
 * @param {string} dateString - The date string to convert.
 * @returns {Date} A Date object set to the specified date in Asia/Shanghai timezone.
 */
export function convertToShanghaiTime(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'Asia/Shanghai'
    };
    const shanghaiDateString = new Intl.DateTimeFormat('en-US', options).format(date);
    return new Date(shanghaiDateString);
}

export function getShanghaiTime() {
    const date = new Date();
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'Asia/Shanghai'
    };
    const shanghaiDateString = new Intl.DateTimeFormat('en-US', options).format(date);
    return new Date(shanghaiDateString);
}

/**
 * Checks if a given date string is within the last specified number of days (inclusive of today).
 * @param {string} dateString - The date string to check (YYYY-MM-DD or ISO format).
 * @param {number} days - The number of days to look back.
 * @returns {boolean} True if the date is within the last 'days', false otherwise.
 */
export function isDateWithinLastDays(dateString, days) {
    const itemDate = convertToShanghaiTime(dateString);
    const today = new Date(getFetchDate());
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - itemDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays < days;
}

/**
 * Formats an ISO date string to "YYYY年M月D日" format.
 */
export function formatDateToChinese(isoDateString) {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timeZone: 'Asia/Shanghai'
    };
    return new Intl.DateTimeFormat('zh-CN', options).format(date);
}

export function formatDateToChineseWithTime(isoDateString) {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Shanghai'
    };
    return new Intl.DateTimeFormat('zh-CN', options).format(date);
}

export function formatRssDate(date) {
    if (!date) return new Date().toUTCString();
    return date.toUTCString();
}

export function formatDateToGMT0WithTime(isoDateString) {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'GMT'
    };
    return new Intl.DateTimeFormat('zh-CN', options).format(date);
}

export function formatDateToGMT8WithTime(isoDateString) {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Shanghai'
    };
    return new Intl.DateTimeFormat('zh-CN', options).format(date);
}

export function convertEnglishQuotesToChinese(text) {
    const str = String(text);
    return str.replace(/"/g, '“');
}

export function formatMarkdownText(text) {
    const str = String(text);
    return str.replace(/“/g, '"');
}

export function getRandomUserAgent() {
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
        "Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function replaceImageProxy(proxy, content) {
    const str = String(content);
    return str.replace(/upload.chinaz.com/g, 'pic.chinaz.com').replace(/https:\/\/pic.chinaz.com/g, proxy+'https:\/\/pic.chinaz.com');
}