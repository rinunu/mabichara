from ragendja.settings_post import settings

settings.add_app_media('combined-%(LANGUAGE_CODE)s.js',
                       'mabi/enchants.js',
                       'mabi/weapons.js',
)
settings.add_app_media('combined-%(LANGUAGE_DIR)s.css',
    'mabi/common.css',
)