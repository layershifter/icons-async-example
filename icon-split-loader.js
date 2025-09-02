const path = require('path');

function isChunkFile(filePath) {
    return /\/chunk-.*\.js$/.test(filePath);
}

// Store virtual modules in memory
const virtualModules = new Map();

/**
 * A custom loader that splits a chunk from `@fluentui/react-icons` package to separate virtual modules.
 *
 * @this {import('webpack').LoaderContext<{}>}
 */
module.exports = function (source) {
    const callback = this.async();
    const loader = this;

    // Check if this is a request for a virtual module
    const virtualModuleMatch = this.resourcePath.match(/(.+\/chunk-[^\/]+)\/([^\/]+)\.js$/);
    if (virtualModuleMatch) {
        const [, basePath, iconName] = virtualModuleMatch;
        const virtualKey = `${basePath}/${iconName}`;

        if (virtualModules.has(virtualKey)) {
            return callback(null, virtualModules.get(virtualKey));
        }

        // If virtual module not found, return error
        return callback(new Error(`Virtual module not found: ${this.resourcePath}`));
    }

    // Process chunk files
    if (!isChunkFile(this.resourcePath)) {
        return callback(null, source);
    }

    // Extract the chunk file name (e.g., 'chunk-0' from 'chunk-0.js')
    const chunkFileName = path.basename(this.resourcePath, '.js');
    const basePath = path.dirname(this.resourcePath);

    // Parse the source to find all export const statements
    const exportLines = source.split('\n').filter(line => line.trim().startsWith('export const'));

    if (exportLines.length === 0) {
        return callback(null, source);
    }

    const barrelExports = [];

    // Process each export and create virtual modules
    exportLines.forEach((line, i) => {
        const match = line.match(/export const (\w+) =/);

        if (match) {
            const iconName = `${match[1]}`;
            const virtualKey = `${basePath}/${chunkFileName}/${iconName}`;
            const iconSource = `// Auto-generated virtual module by icon-split-loader.js\n${line}\n`;

            // Store virtual module content in memory
            virtualModules.set(virtualKey, iconSource);

            // Add virtual dependency so webpack knows about this module
            const virtualModulePath = `${basePath}/${chunkFileName}/${iconName}.js`;
            loader.addDependency(virtualModulePath);

            // Add to barrel exports
            barrelExports.push(`export { ${iconName} } from './${chunkFileName}/${iconName}.js';`);
        }
    });

    // Return the barrel file content
    const barrelContent = `// Auto-generated barrel file by icon-split-loader.js\n${barrelExports.join('\n')}\n`;

    callback(null, barrelContent);
};

// Export the virtual modules map for potential debugging
module.exports.virtualModules = virtualModules;
