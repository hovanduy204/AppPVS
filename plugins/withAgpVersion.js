const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to:
 * 1. Force androidx.core dependencies to compatible versions
 * 2. Update AGP version if needed
 */
const withAgpVersion = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.platformProjectRoot;
      const buildGradlePath = path.join(projectRoot, 'build.gradle');
      const appBuildGradlePath = path.join(projectRoot, 'app', 'build.gradle');
      
      console.log(`[withAgpVersion] Plugin started`);
      console.log(`[withAgpVersion] Android project root: ${projectRoot}`);
      
      // Update root build.gradle (AGP version)
      if (fs.existsSync(buildGradlePath)) {
        let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
        
        // Update AGP version to 8.6.0 if needed
        const agpMatch = buildGradleContent.match(/com\.android\.tools\.build:gradle:([0-9.]+)/);
        if (agpMatch) {
          const currentVersion = agpMatch[1];
          const versionParts = currentVersion.split('.').map(Number);
          const major = versionParts[0] || 0;
          const minor = versionParts[1] || 0;
          
          if (major < 8 || (major === 8 && minor < 6)) {
            console.log(`[withAgpVersion] Updating AGP from ${currentVersion} to 8.6.0`);
            buildGradleContent = buildGradleContent.replace(
              /(com\.android\.tools\.build:gradle:)([0-9.]+)/g,
              '$18.6.0'
            );
            fs.writeFileSync(buildGradlePath, buildGradleContent, 'utf8');
            console.log(`[withAgpVersion] ✓ Updated AGP to 8.6.0`);
          }
        }
      }
      
      // Force androidx.core dependencies in app/build.gradle
      if (fs.existsSync(appBuildGradlePath)) {
        let appBuildGradleContent = fs.readFileSync(appBuildGradlePath, 'utf8');
        let updated = false;
        
        // Check if dependencies block exists
        if (appBuildGradleContent.includes('dependencies {')) {
          // Force androidx.core versions
          // Remove any existing androidx.core dependencies
          appBuildGradleContent = appBuildGradleContent.replace(
            /implementation\s+['"]androidx\.core:core[^'"]*['"]/g,
            ''
          );
          appBuildGradleContent = appBuildGradleContent.replace(
            /implementation\s+['"]androidx\.core:core-ktx[^'"]*['"]/g,
            ''
          );
          
          // Add forced versions
          const forceDependencies = `
    // Force androidx.core versions for AGP 8.2.1 compatibility
    implementation 'androidx.core:core:1.12.0'
    implementation 'androidx.core:core-ktx:1.12.0'`;
          
          // Insert after dependencies { or before first dependency
          if (!appBuildGradleContent.includes('androidx.core:core:1.12.0')) {
            appBuildGradleContent = appBuildGradleContent.replace(
              /(dependencies\s*\{)/,
              `$1${forceDependencies}`
            );
            updated = true;
            console.log(`[withAgpVersion] ✓ Added forced androidx.core dependencies`);
          }
        }
        
        if (updated) {
          fs.writeFileSync(appBuildGradlePath, appBuildGradleContent, 'utf8');
        }
      }
      
      return config;
    },
  ]);
};

module.exports = withAgpVersion;

