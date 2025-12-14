const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive config plugin to fix Android build issues:
 * 1. Update AGP to 8.6.0
 * 2. Force androidx.core dependencies to 1.12.0
 * 3. Add dependency resolution strategy in root build.gradle
 */
const withAgpVersion = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.platformProjectRoot;
      const buildGradlePath = path.join(projectRoot, 'build.gradle');
      const appBuildGradlePath = path.join(projectRoot, 'app', 'build.gradle');
      const gradlePropertiesPath = path.join(projectRoot, 'gradle.properties');
      
      console.log(`[withAgpVersion] ===== Plugin started =====`);
      console.log(`[withAgpVersion] Android project root: ${projectRoot}`);
      
      // 1. Update AGP version in root build.gradle
      if (fs.existsSync(buildGradlePath)) {
        let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
        let updated = false;
        
        // Update AGP version to 8.6.0
        buildGradleContent = buildGradleContent.replace(
          /(com\.android\.tools\.build:gradle:)([0-9.]+)/g,
          (match, prefix, version) => {
            const versionParts = version.split('.').map(Number);
            const major = versionParts[0] || 0;
            const minor = versionParts[1] || 0;
            
            if (major < 8 || (major === 8 && minor < 6)) {
              console.log(`[withAgpVersion] Updating AGP from ${version} to 8.6.0`);
              updated = true;
              return `${prefix}8.6.0`;
            }
            return match;
          }
        );
        
        // Add dependency resolution strategy to force androidx.core versions
        if (!buildGradleContent.includes('androidx.core:core:1.12.0')) {
          // Find allprojects or subprojects block
          if (buildGradleContent.includes('allprojects {')) {
            const resolutionStrategy = `
    configurations.all {
        resolutionStrategy {
            force 'androidx.core:core:1.12.0'
            force 'androidx.core:core-ktx:1.12.0'
        }
    }`;
            
            buildGradleContent = buildGradleContent.replace(
              /(allprojects\s*\{[^}]*repositories\s*\{[^}]*\})/s,
              `$1${resolutionStrategy}`
            );
            updated = true;
            console.log(`[withAgpVersion] ✓ Added dependency resolution strategy`);
          } else if (buildGradleContent.includes('subprojects {')) {
            const resolutionStrategy = `
    configurations.all {
        resolutionStrategy {
            force 'androidx.core:core:1.12.0'
            force 'androidx.core:core-ktx:1.12.0'
        }
    }`;
            
            buildGradleContent = buildGradleContent.replace(
              /(subprojects\s*\{[^}]*repositories\s*\{[^}]*\})/s,
              `$1${resolutionStrategy}`
            );
            updated = true;
            console.log(`[withAgpVersion] ✓ Added dependency resolution strategy`);
          }
        }
        
        if (updated) {
          fs.writeFileSync(buildGradlePath, buildGradleContent, 'utf8');
          console.log(`[withAgpVersion] ✓ Updated root build.gradle`);
        }
      } else {
        console.log(`[withAgpVersion] WARNING: Root build.gradle not found at ${buildGradlePath}`);
      }
      
      // 2. Force androidx.core in app/build.gradle
      if (fs.existsSync(appBuildGradlePath)) {
        let appBuildGradleContent = fs.readFileSync(appBuildGradlePath, 'utf8');
        let updated = false;
        
        // Remove any existing androidx.core dependencies
        const beforeRemove = appBuildGradleContent;
        appBuildGradleContent = appBuildGradleContent.replace(
          /^\s*implementation\s+['"]androidx\.core:core[^'"]*['"]\s*$/gm,
          ''
        );
        appBuildGradleContent = appBuildGradleContent.replace(
          /^\s*implementation\s+['"]androidx\.core:core-ktx[^'"]*['"]\s*$/gm,
          ''
        );
        
        if (appBuildGradleContent !== beforeRemove) {
          updated = true;
        }
        
        // Add forced versions at the beginning of dependencies block
        if (appBuildGradleContent.includes('dependencies {')) {
          if (!appBuildGradleContent.includes('androidx.core:core:1.12.0')) {
            const forceDeps = `
    // Force androidx.core versions for compatibility
    implementation('androidx.core:core:1.12.0') {
        force = true
    }
    implementation('androidx.core:core-ktx:1.12.0') {
        force = true
    }`;
            
            appBuildGradleContent = appBuildGradleContent.replace(
              /(dependencies\s*\{)/,
              `$1${forceDeps}`
            );
            updated = true;
            console.log(`[withAgpVersion] ✓ Added forced dependencies in app/build.gradle`);
          }
        }
        
        if (updated) {
          fs.writeFileSync(appBuildGradlePath, appBuildGradleContent, 'utf8');
        }
      } else {
        console.log(`[withAgpVersion] WARNING: app/build.gradle not found at ${appBuildGradlePath}`);
      }
      
      // 3. Add to gradle.properties if exists
      if (fs.existsSync(gradlePropertiesPath)) {
        let gradleProps = fs.readFileSync(gradlePropertiesPath, 'utf8');
        
        if (!gradleProps.includes('android.suppressUnsupportedCompileSdk')) {
          gradleProps += '\nandroid.suppressUnsupportedCompileSdk=35\n';
          fs.writeFileSync(gradlePropertiesPath, gradleProps, 'utf8');
          console.log(`[withAgpVersion] ✓ Updated gradle.properties`);
        }
      }
      
      console.log(`[withAgpVersion] ===== Plugin completed =====`);
      return config;
    },
  ]);
};

module.exports = withAgpVersion;

