"use strict"

const DefaultSettings = {
	"enabled" : true,
	"myPing" : 25,
	"instantHit" : true,
	"instantLock" : true,
	"instantCast" : true,
	"autoAim" : true,
	"hitBossOnly" : true,
	"forcePrimeFlame" : true,
	"_forcePrimeFlame" : "Requires auto-aim to be set to true",
	"predictArcanePulseManaCost" : true,
	"predictArcanePulseCharge" : true,
	"fastImplosion" : true,
	"fastFusion" : true,
	"comboPrimeFlameInManaBoost": true,
	"lanceMacro" : true,
	"autoLances" : true,
	"_autoLances" : "comboAPNovaMeteorVPLSFP into Lances, cba to list, take a hint",
	"instaHitSkills" : [
		1,
		2,
		4,
		12,
		33,
		35
	],
	"instaLockSkills" : [
		20,
		21,
		22,
		23
	],
	"maxDistance" : 19,
	"_maxDistance" : "This value is used for lockons",
	"delay" : 1600,
	"_delay" : "This value is used for prime flame weaving in mana boost",
	"ethicalDistance" : true,
	"_ethicalDistance" : 'If set to true, it will get range data from the server and might miss if skills aimed at the ground. If set to false, script will try to hit from a longer distance.'
}

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
        // Migrate from older version (using the new system) to latest one
        if (from_ver + 1 < to_ver) {
            // Recursively upgrade in one-version steps
            settings = MigrateSettings(from_ver, from_ver + 1, settings);
            return MigrateSettings(from_ver + 1, to_ver, settings);
        }

        // If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
        // a switch for each version step that upgrades to the next version. This enables us to
        // upgrade from any version to the latest version without additional effort!
		
        switch(to_ver)
        {
			// keep old settings, add new ones
			case 4:
			case 3:
				break;
			case 2:
				break;
			default:
				let oldsettings = settings
				
				settings = Object.assign(DefaultSettings, {});
				
				for(let option in oldsettings) {
					if(settings[option]) {
						settings[option] = oldsettings[option]
					}
				}

				if(from_ver < to_ver) console.log('[Sorcy Sorc] Your settings have been updated to version ' + to_ver + '. You can edit the new config file after the next relog.')
				break;
        }

        return settings;
    }
}