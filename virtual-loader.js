const { URLSearchParams } = require('url');

/**
 * Virtual loader that returns module content based on query parameters
 */
function virtualLoader() {
  const query = new URLSearchParams(this.resourceQuery);
  const iconName = query.get('icon');
  const exportStatement = query.get('export');

  if (!iconName || !exportStatement) {
    return '';
  }

  return `"use client";
import { createFluentIcon } from "@fluentui/react-icons";
${exportStatement}
`;
}

module.exports = virtualLoader;
