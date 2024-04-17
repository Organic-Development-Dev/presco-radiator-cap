
const getExcludePaths = () => {
    const exclude = [
        "/order/*",
        "/subscription/*",
    ];
    return exclude;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
    generateRobotsTxt: true, 
    exclude: getExcludePaths()
}