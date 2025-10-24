const fs = require('fs');
const path = require('path');

console.log('🚀 docverse PWA Feature Test');
console.log('=============================');

// Check if required files exist
console.log('📁 Checking PWA Files...');

const files = [
    'public/manifest.json',
    'public/sw.js',
    'public/offline.html',
    'public/browserconfig.xml',
    'hooks/use-pwa-install.ts',
    'components/pwa-install-button.tsx',
    'components/pwa-banner.tsx',
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.log(`❌ ${file} missing`);
    }
});

console.log('');
console.log('📋 Manifest.json Validation...');

try {
    const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
    console.log('✅ manifest.json is valid JSON');

    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
    requiredFields.forEach(field => {
        if (manifest[field]) {
            console.log(`✅ Manifest has required field: ${field}`);
        } else {
            console.log(`❌ Manifest missing required field: ${field}`);
        }
    });
} catch (e) {
    console.log('❌ manifest.json is invalid JSON');
}

console.log('');
console.log('🔧 Next.js Configuration...');

try {
    const nextConfig = fs.readFileSync('next.config.js', 'utf8');
    if (nextConfig.includes('withPWA')) {
        console.log('✅ next-pwa configured in next.config.js');
    } else {
        console.log('❌ next-pwa not found in next.config.js');
    }
} catch (e) {
    console.log('❌ next.config.js not found');
}


console.log('');
console.log('📦 Dependencies...');

try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    if (dependencies['next-pwa']) {
        console.log('✅ next-pwa is installed');
    } else {
        console.log('❌ next-pwa is not installed');
    }
} catch (e) {
    console.log('❌ package.json not found');
}

console.log('');
console.log('🌐 Build Check...');

if (fs.existsSync('public/sw.js')) {
    console.log('✅ Service worker generated');
} else {
    console.log("⚠️  Service worker not found (run 'npm run build' first)");
}

const workboxFiles = fs.readdirSync('public').filter(file => file.startsWith('workbox-'));
if (workboxFiles.length > 0) {
    console.log('✅ Workbox files generated');
} else {
    console.log("⚠️  Workbox files not found (run 'npm run build' first)");
}


console.log('');
console.log('📱 PWA Components...');

try {
    const layout = fs.readFileSync('app/layout.tsx', 'utf8');
    if (layout.includes('PWABanner')) {
        console.log('✅ PWABanner imported in layout');
    } else {
        console.log('❌ PWABanner not imported in layout');
    }
} catch (e) {
    console.log('❌ app/layout.tsx not found');
}

try {
    const siteHeader = fs.readFileSync('components/site-header.tsx', 'utf8');
    if (siteHeader.includes('PWAInstallButton')) {
        console.log('✅ PWAInstallButton imported in header');
    } else {
        console.log('❌ PWAInstallButton not imported in header');
    }
} catch (e) {
    console.log('❌ components/site-header.tsx not found');
}

console.log('');
console.log('🔍 Manual Testing Instructions:');
console.log("1. Run 'npm run build && npm start'");
console.log('2. Open http://localhost:3000 in Chrome');
console.log('3. Open DevTools > Application tab');
console.log('4. Check Manifest and Service Workers sections');
console.log('5. Look for install button in header');
console.log('6. Test offline functionality by disabling network');
console.log('');
console.log('🏆 PWA Audit:');
console.log('1. Open DevTools > Lighthouse tab');
console.log("2. Select 'Progressive Web App' category");
console.log('3. Run audit to check PWA compliance');
console.log('');
console.log('✅ PWA Feature Test Complete!');