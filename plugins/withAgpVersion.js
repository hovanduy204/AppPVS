const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to ensure Android Gradle Plugin version 8.6.0+ is used
 * This is required for androidx.core:core:1.16.0 and compileSdkVersion 35
 */
const withAgpVersion = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.platformProjectRoot;
      const buildGradlePath = path.join(projectRoot, 'build.gradle');
      
      console.log(`[withAgpVersion] Checking build.gradle at: ${buildGradlePath}`);
      
      if (fs.existsSync(buildGradlePath)) {
        let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
        let updated = false;
        const originalContent = buildGradleContent;
        
        // Update AGP version to 8.6.0 if it's lower
        buildGradleContent = buildGradleContent.replace(
          /(com\.android\.tools\.build:gradle:)([0-9.]+)/g,
          (match, prefix, version) => {
            const versionParts = version.split('.').map(Number);
            const major = versionParts[0] || 0;
            const minor = versionParts[1] || 0;
            
            // If version is less than 8.6.0, update it
            if (major < 8 || (major === 8 && minor < 6)) {
              updated = true;
              console.log(`[withAgpVersion] Updating AGP from ${version} to 8.6.0`);
              return `${prefix}8.6.0`;
            }
            return match;
          }
        );
        
        if (updated) {
          fs.writeFileSync(buildGradlePath, buildGradleContent, 'utf8');
          console.log(`[withAgpVersion] Successfully updated build.gradle`);
        } else {
          console.log(`[withAgpVersion] AGP version is already 8.6.0 or higher`);
        }
      } else {
        console.log(`[withAgpVersion] WARNING: build.gradle not found at ${buildGradlePath}`);
      }
      
      return config;
    },
  ]);
};

module.exports = withAgpVersion;

