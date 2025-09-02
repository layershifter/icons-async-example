const path = require('path');

function isChunkFile(filePath) {
    return /\/chunk-.*\.js$/.test(filePath);
}

const virtualLoaderPath = path.resolve(__dirname, 'virtual-loader.js');
const virtualPlaceholderPath = path.resolve(__dirname, 'virtual-placeholder.js');

function toURIComponent(text) {
  return encodeURIComponent(text).replace(/!/g, '%21');
}

/**
 * A custom loader that splits a chunk from `@fluentui/react-icons` package to separate virtual modules.
 */
function iconSplitLoader(source) {
    const callback = this.async();
    const resourcePath = this.resourcePath;

    // Process chunk files only
    if (!isChunkFile(resourcePath)) {
        return callback(null, source);
    }

    try {
        // Extract the chunk file name (e.g., 'chunk-0' from 'chunk-0.js')
        const chunkFileName = path.basename(resourcePath, '.js');

        // Parse the source to find all export const statements
        const exportRegex = /export const (\w+) = [^;]+;/g;
        const barrelExports = [];
        let match;

        while ((match = exportRegex.exec(source)) !== null) {
            const iconName = match[1];
            const fullExportStatement = match[0];

            // Create virtual module request following Griffel pattern
            const virtualRequest = `${virtualPlaceholderPath}!=!${virtualLoaderPath}!${virtualPlaceholderPath}?icon=${iconName}&export=${toURIComponent(fullExportStatement)}`;
            const stringifiedRequest = JSON.stringify(this.utils.contextify(this.context || this.rootContext, virtualRequest));

            // Add to barrel exports using the virtual module
            barrelExports.push(`export { ${iconName} } from ${stringifiedRequest};`);
        }

        if (barrelExports.length === 0) {
            return callback(null, source);
        }

        // Return the barrel file content
        const barrelContent = `"use client";\n${barrelExports.join('\n')}\n`;

        callback(null, barrelContent);
    } catch (error) {
        callback(error);
    }
}

// Export the loader
module.exports = iconSplitLoader;
