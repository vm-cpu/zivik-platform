# Запуск: чекліст публічного відкриття

Сьогодні сайт живе на `https://nasvitlo.vm-55d.workers.dev`, закритий від
пошуковиків (`noindex`) і без аналітики. Усе, що потрібно для запуску, уже
є в коді й **вимкнено**, доки власник не дасть значення. Цей документ — у
якому порядку ці значення давати і куди клацати.

Усі змінні нижче — **змінні збірки**: сторінки пререндерені, тож нове
значення діє лише після нової збірки. Де їх задавати:

- **Cloudflare** (основний сайт): Workers & Pages → **nasvitlo** →
  **Settings** → **Build** → **Variables and secrets** → **Add**. Після
  зміни — **Deployments** → **Retry deployment** на останньому деплої (або
  будь-яка публікація в адмінці).
- **Vercel** (поки працює): Project → **Settings** → **Environment
  Variables** → Production → Redeploy.

| Змінна | Що вмикає | Без неї |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | канонічні URL, `hreflang`, Open Graph, sitemap, `legalHost` | `*.workers.dev` / Vercel / localhost |
| `SITE_INDEXABLE=true` | індексацію: знімає `noindex` (мета-тег і `X-Robots-Tag`), додає sitemap у `robots.txt` | `noindex, nofollow` на кожній сторінці |
| `GOOGLE_SITE_VERIFICATION` | `<meta name="google-site-verification">` на всіх сторінках | тега немає |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | маячок Cloudflare Web Analytics, два джерела в CSP, абзац про аналітику в політиці конфіденційності й нову дату редакції | ні маячка, ні джерел у CSP, політика каже «аналітики немає» |
| `FEATURE_GLOSSARY=true` | «Словник» | прихований (див. `src/lib/flags.ts`) |

---

## 1. Домен

- [ ] **Вирішити, який домен.** Варіанти: піддомен університету
      (`nasvitlo.ucu.edu.ua` — потрібна згода й DNS-запис від ІТ УКУ) або
      окремий домен (`nasvitlo.org` тощо — купити й перенести DNS у
      Cloudflare). Від цього залежить, хто керує DNS, — а від того, чи
      можна підтвердити Search Console записом DNS (крок 4).
- [ ] **Додати домен у Cloudflare.**
  - *Домен у зоні Cloudflare* (свій домен, NS на Cloudflare):
    Workers & Pages → **nasvitlo** → **Settings** → **Domains & Routes** →
    **Add** → **Custom domain** → ввести `nasvitlo.…` → **Add domain**.
    Cloudflare сам створить DNS-запис і сертифікат.
  - *Піддомен чужого DNS* (напр. `ucu.edu.ua` не в Cloudflare): Custom
    domain так не підключити — або ІТ УКУ делегує піддомен у Cloudflare
    (NS-записи на окрему зону), або домен переходить у Cloudflare цілком.
    Обговорити з ІТ до того, як обіцяти адресу.
- [ ] Перевірити: `https://<домен>/uk` відкривається, сертифікат дійсний,
      `https://<домен>/_emdash/admin` пускає в адмінку.
- [ ] Passkey адмінки прив'язані до домену: після переїзду редакторам
      доведеться зареєструвати їх заново на новій адресі. Попередити.

## 2. Адреса сайту в збірці

- [ ] `NEXT_PUBLIC_SITE_URL=https://<домен>` (без скісної риски в кінці) —
      у змінних збірки Cloudflare (і Vercel, якщо він ще живий).
- [ ] Перезібрати (Retry deployment).
- [ ] Перевірити у вихідному коді сторінки (`view-source:`):
      `<link rel="canonical" href="https://<домен>/uk">`,
      `og:url` — з новим доменом.
- [ ] Старі адреси (`*.workers.dev`, `zivik-platform.vercel.app`) — або
      вимкнути, або переадресувати на новий домен (Vercel: Domains →
      Redirect; workers.dev: Settings → Domains & Routes → вимкнути
      `workers.dev`), щоб у пошуку не було двох копій сайту.

## 3. Правові сторінки

- [ ] Перечитати `/uk/privacy` і `/uk/terms` на новому домені. Домен у
      тексті не названо (сайт скрізь — «НаСвітло» / «Сайт»), тож переїзд
      тексту не змінює; `legalHost` у `src/content/legal.ts` тепер
      похідний від `NEXT_PUBLIC_SITE_URL`.
- [ ] Якщо щось у тексті змінюється — оновити `legalRevisedIso` там же.

## 4. Google Search Console

- [ ] <https://search.google.com/search-console> → **Add property**.
  - **Domain** (рекомендовано, якщо є доступ до DNS): ввести домен →
    Google дасть TXT-запис `google-site-verification=…` → Cloudflare →
    зона домену → **DNS** → **Records** → **Add record** → Type **TXT**,
    Name `@`, Content — рядок від Google → Save → у Search Console
    **Verify**. Змінна в збірці тоді не потрібна.
  - **URL prefix** (якщо DNS недоступний): ввести `https://<домен>/` →
    метод **HTML tag** → скопіювати лише значення `content="…"` →
    змінна збірки `GOOGLE_SITE_VERIFICATION=<значення>` → Retry
    deployment → перевірити, що тег є у `view-source:` головної →
    **Verify**. Не видаляйте змінну після підтвердження — Google
    перевіряє тег і згодом.
- [ ] (За бажання) Bing Webmaster Tools → **Import from Google Search
      Console** — підтвердження підтягнеться.

## 5. Відкрити індексацію

Лише коли контент готовий показувати світові (див. docs/GAPS.md, 3.1).

- [ ] `SITE_INDEXABLE=true` у змінних збірки → Retry deployment. Лог
      збірки має сказати «SITE_INDEXABLE=true — this build may be
      indexed».
- [ ] Перевірити: `curl -sI https://<домен>/uk | grep -i x-robots` — порожньо;
      у `view-source:` немає `<meta name="robots" content="noindex…">`;
      `https://<домен>/robots.txt` містить `Sitemap: https://<домен>/sitemap.xml`;
      `https://<домен>/sitemap.xml` перелічує сторінки (доки індексацію
      закрито, sitemap навмисно порожній).
- [ ] Search Console → **Sitemaps** → ввести `sitemap.xml` → **Submit**.
- [ ] Search Console → **URL inspection** → `https://<домен>/uk` →
      **Request indexing** (і так само для `/en`).

## 6. Аналітика (Cloudflare Web Analytics, без cookie)

- [ ] Cloudflare → **Analytics & Logs** → **Web Analytics** → **Add a
      site** → ввести домен → **Done**. Якщо домен у зоні Cloudflare,
      запропонують «automatic setup» — **не вмикати**: маячок уже
      вставляє сам сайт, і автоматичне вбудовування рахувало б кожен
      перегляд двічі. Потрібен ручний варіант: **Manage site** → вкладка
      з JS snippet.
- [ ] Зі сніпета скопіювати лише токен — значення `"token": "…"` в
      `data-cf-beacon`.
- [ ] `NEXT_PUBLIC_CF_ANALYTICS_TOKEN=<токен>` у змінних збірки → Retry
      deployment.
- [ ] Перевірити: у `view-source:` будь-якої сторінки є
      `static.cloudflareinsights.com/beacon.min.js`; у DevTools → Console
      немає помилок CSP; `/uk/privacy` у розділі «Файли cookie та
      аналітика» називає Cloudflare Web Analytics, дата редакції —
      26 вересня 2026. Через кілька хвилин у Web Analytics з'являться
      перші перегляди.
- [ ] Абзац у політиці описує Cloudflare Web Analytics так, як її описує
      Cloudflare (без cookie, IP не зберігається, звіти за 6 місяців).
      Якщо колись підключите інший сервіс — спершу текст у
      `src/content/legal.ts`, потім токен.
- Google Analytics не додавати: cookie, передача даних рекламній
  платформі й банер згоди, якого на сайті немає.

## 7. Пошта для EmDash

*Розділ-заглушка: інтеграцію пошти (вхід за посиланням, відновлення
доступу, запрошення редакторів) робить окрема сесія; сюди — кроки, які
вона залишить власникові.*

- [ ] Провайдер і адреса відправника: …
- [ ] Секрети Worker-а: …
- [ ] Перевірка: запросити тестового редактора з адмінки — лист доходить.

## 8. Картки для соцмереж (Open Graph)

- [ ] Після зміни домену перевірити картку головної і 2–3 оглядів:
      <https://www.opengraph.xyz/> або LinkedIn Post Inspector
      (<https://www.linkedin.com/post-inspector/>) — картинка, заголовок,
      опис, адреса з новим доменом.
- [ ] Огляди, створені в адмінці, поки не мають власної картки
      (`/og/cases/<slug>.png` генерує `scripts/og-cards.py` вручну — docs/GAPS.md,
      3.2): згенерувати картки для всіх опублікованих оглядів перед
      анонсом.
- [ ] Facebook кешує картки: після зміни — Sharing Debugger
      (<https://developers.facebook.com/tools/debug/>) → **Scrape Again**.

## 9. Резервні копії

- [ ] Налаштувати нічний бекап D1 — docs/BACKUPS.md, «Увімкнути» (токен
      *Account · D1 · Read*, два секрети в GitHub, ручний запуск).
- [ ] Один раз пройти навчальне відновлення з того самого документа —
      **до** анонсу, а не після першої втрати.

## 10. День запуску

- [ ] Остання збірка зелена, лог друкує `SITE_INDEXABLE=true`.
- [ ] Головна, бібліотека, 2–3 огляди, `/privacy`, `/terms` — обома мовами.
- [ ] Адмінка: вхід, публікація дрібної правки доходить до сайту.
- [ ] Web Analytics показує перегляди; Search Console — sitemap «Success».
- [ ] Останній нічний бекап — не старший за добу.
