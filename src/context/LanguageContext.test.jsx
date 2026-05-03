import { describe, it, expect, vi, beforeAll } from 'vitest';

let languageData;

beforeAll(async () => {
  // Unmock to get the real module
  vi.unmock('../context/LanguageContext');
  languageData = await import('../context/LanguageContext');
});

describe('LanguageContext configuration', () => {
  it('has 10 languages defined', () => {
    expect(languageData.languages).toHaveLength(10);
  });

  it('each language has a name and code', () => {
    languageData.languages.forEach(lang => {
      expect(lang).toHaveProperty('name');
      expect(lang).toHaveProperty('code');
      expect(typeof lang.name).toBe('string');
      expect(typeof lang.code).toBe('string');
    });
  });

  it('has translations for all defined languages', () => {
    languageData.languages.forEach(lang => {
      expect(languageData.translations).toHaveProperty(lang.name);
    });
  });

  it('English translations have all required keys', () => {
    const requiredKeys = [
      'heroTitle', 'heroDesc', 'beginJourney', 'locateStations',
      'digitalJourney', 'eligibility', 'registration', 'findBooth',
      'castVote', 'dashboard', 'journey', 'stations', 'candidates',
      'aiAssistant', 'joinNow', 'logout'
    ];
    requiredKeys.forEach(key => {
      expect(languageData.translations.English).toHaveProperty(key);
      expect(languageData.translations.English[key].length).toBeGreaterThan(0);
    });
  });

  it('all translations have essential navigation keys', () => {
    const navKeys = ['dashboard', 'journey', 'stations', 'candidates', 'aiAssistant'];
    Object.keys(languageData.translations).forEach(langName => {
      navKeys.forEach(key => {
        expect(languageData.translations[langName]).toHaveProperty(key);
      });
    });
  });
});
