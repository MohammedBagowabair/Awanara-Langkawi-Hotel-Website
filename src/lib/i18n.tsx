import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DICT } from './i18n-dict';

export type Lang = 'en' | 'ar' | 'zh' | 'ms';

export const LANGS: { code: Lang; label: string; short: string; html: string }[] = [
  { code: 'en', label: 'English', short: 'EN', html: 'en' },
  { code: 'ar', label: 'العربية', short: 'عربي', html: 'ar' },
  { code: 'zh', label: '简体中文', short: '中文', html: 'zh-Hans' },
  { code: 'ms', label: 'Bahasa Melayu', short: 'BM', html: 'ms' },
];

const STORAGE_KEY = 'site-lang';
const isLang = (v: unknown): v is Lang => v === 'en' || v === 'ar' || v === 'zh' || v === 'ms';

const FONT_URLS: Partial<Record<Lang, string>> = {
  ar: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap',
  zh: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;600&display=swap',
};

export function detectLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const p = new URLSearchParams(window.location.search).get('lang');
    if (isLang(p)) return p;
    const s = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(s)) return s;
  } catch {
    /* storage unavailable */
  }
  return 'en';
}

function loadFonts(lang: Lang) {
  const url = FONT_URLS[lang];
  if (!url || document.querySelector(`link[data-lang-font="${lang}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.setAttribute('data-lang-font', lang);
  document.head.appendChild(link);
}

export function translate(lang: Lang, key: string): string {
  if (lang === 'en') return key;
  return DICT[lang]?.[key] ?? key;
}

function applyLang(lang: Lang, titleKey: string, descKey?: string) {
  const root = document.documentElement;
  root.lang = LANGS.find((l) => l.code === lang)!.html;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  loadFonts(lang);
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
  const url = new URL(window.location.href);
  if (lang === 'en') url.searchParams.delete('lang');
  else url.searchParams.set('lang', lang);
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url);
  document.title = translate(lang, titleKey);
  if (descKey) document.querySelector('meta[name="description"]')?.setAttribute('content', translate(lang, descKey));
}

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key?: string) => string;
  h: (key?: string) => { dangerouslySetInnerHTML: { __html: string } };
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children, titleKey, descKey, detectOnMount = false }: { children: ReactNode; titleKey: string; descKey?: string; detectOnMount?: boolean }) {
  const [lang, setLang] = useState<Lang>(() => (detectOnMount ? 'en' : detectLang()));
  useEffect(() => {
    if (!detectOnMount) return;
    const d = detectLang();
    if (d !== 'en') setLang(d);
  }, [detectOnMount]);
  useEffect(() => {
    applyLang(lang, titleKey, descKey);
  }, [lang, titleKey, descKey]);
  const t = useCallback((key?: string) => translate(lang, key ?? ''), [lang]);
  const h = useCallback((key?: string) => ({ dangerouslySetInnerHTML: { __html: translate(lang, key ?? '') } }), [lang]);
  const value = useMemo(() => ({ lang, setLang, t, h }), [lang, t, h]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

/** Accessible language picker built on a native <select>.
 *  compact: shows a short code (EN / عربي / 中文 / BM) over an invisible native select.
 *  full: a visible select listing every language name. */
export function LangSelect({ id, variant = 'compact', className = '' }: { id: string; variant?: 'compact' | 'full'; className?: string }) {
  const { lang, setLang, t } = useI18n();
  const current = LANGS.find((l) => l.code === lang)!;
  return (
    <div className={`lang-select lang-select--${variant} ${className}`}>
      <label htmlFor={id} className="lang-select__label">{t('Language')}</label>
      <svg className="lang-select__globe" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></svg>
      {variant === 'compact' && <span className="lang-select__value" aria-hidden="true" lang={current.html}>{current.short}</span>}
      <select id={id} value={lang} onChange={(e) => setLang(e.target.value as Lang)} className="lang-select__native">
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} lang={l.html}>{l.label}</option>
        ))}
      </select>
      <svg className="lang-select__chev" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </div>
  );
}
