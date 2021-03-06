const fs = require('fs');
const path = require('path');

let dictionary = [
    // Branding.
    /HiveMP(\.|\'s)?/i,
    'IAM',
    'Redpoint',
    'Redpoint\'s',
    'BigQuery',
    'UGC',
    /punchthrough/i,
    'Auth',
    'OpenAPI',
    'Datastore',
    'Reddit',
    'Integrations',
    'macOS',
    'CMake',
    'GitLab',
    'GCR',
    'AWS',
    'aws',
    'AKS',
    'DNS',
    'BizSpark',
    'Stackdriver',
    'GKE',
    'Xonotic',
    'EC2',
    'Multiplay',
    'Nginx',
    'ReadLine',

    // Terms.
    'OAuth',
    'non-OAuth',
    'HTTPS',
    'HTTP',
    'URI',
    'JSON',
    'TXT',
    '2FA',
    /sdk(s?)/i,
    'SHA256',
    'API',
    'APIs',
    'HTML5',
    'UI',
    'base64-encoded',
    'USD',
    'TODO',
    'Ltd',
    'Pty',
    /UDP/i,
    /TCP/i,
    'ToS',
    /WebSocket(s?)/,
    'Kubernetes',
    'DDoS',
    'NATs',
    'NAT',
    'UE4',
    /MENUID-([^\ ]+)/,
    /codegen/i,
    'ActionScript',
    'CLI',
    'NuGet',
    /NPM/i,
    'DLL',
    'unitypackage',
    'IPv4',
    'IPv6',
    'Base64',
    /pos/i,
    'hachque',
    'css-test',
    'SKU',
    'VM',
    'vCPU',
    'detrate',
    'xonotic-docker',
    'ExternalIP',
    /([0-9]+)MB/,
    'WebAPI',
    'pre-built',
    
    // Code and URL references.
    'v1',
    'redirect_uri',
    'flowSession',
    'startingUrl',
    'iam',
    '2xx',
    '3xx',
    '4xx',
    '5xx',
    'dotnet',
    'powershell',
    'yarn',
    'PaginatedResults',
    'revshare',
    'batchInsert',
    /Event_[A-Za-z]+_v[1-9]/,
    'amazon-web-services-eks-support',
    /sessionId/i,
    'auth',

    // Hugo shortcodes.
    'toc',
    'selfref',
    'linkref',
    'coderef',
    'readref',
    'relref',
    'ref',

    // HTML tags. Eventually HTML tags should only be
    // used in shortcodes themselves and we can remove
    // these entries.
    'li',
    'pre',
    'code',
    'href',

    // Other words that are correct, but not in the
    // built-in dictionary.
    'unmetered',
    /[Rr]uleset(s?)/,
    /[Dd]iscoverable/,
    /[Qq]uickstart(s?)/,
    'onboarding',
    'wishlist',
    'reseller',
    /[Aa]nalytics/,
    'merchantability',
    /autocomplete/i,
    /scalable/i,
    /enablement/i,
    /runtime/i,
    /dropdown/i,
    /backend/i,
    /pre-fill/i,
    /dataset/i,
    'integrations',
    /roadmap/i,
    /dialog/i,
    /hotpatch(es|ed|)/i,
    /combinatory/i,
    /[0-9]+kb/i,
    /orchestrator/i,
    /json/i,
    /wishlisting/i,
    /userdata/i,
    /namespace(s?)/i,
    /programmatically/i,

    /sublevel/i,
    /rsi/i,
    /procedurally/i,
    /BeginPlay/i,
    /MapManager/i,
    /MyMainLevel/i,
    /platformer/i,
    /Xbox/i,
    /gamepad/i,
    /leaderboard/i,
    /fullscreen/i,
];

// Dynamically add the names of all the shortcodes.
const files = fs.readdirSync(path.join(process.cwd(), './layouts/shortcodes/'));
for (let file of files) {
    const basename = path.basename(file);
    if (basename.endsWith('.html')) {
        dictionary.push(basename.substr(0, basename.length - '.html'.length));
    }
}

module.exports = dictionary;