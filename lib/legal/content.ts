import type { Locale } from '@/lib/i18n/locales'

export type LegalSlug = 'about' | 'privacy' | 'terms' | 'cookies'

export interface LegalSection {
  heading: string
  paragraphs: string[]
}

export interface LegalDoc {
  title: string
  description: string
  updated: string
  intro: string
  sections: LegalSection[]
}

const CONTACT = 'professor.cat.hk@gmail.com'
const SITE = 'https://catpawtrip.com'

const docs: Record<LegalSlug, Record<Locale, LegalDoc>> = {
  about: {
    en: {
      title: 'About Catpawtrip',
      description: 'Catpawtrip 貓爪印 is an AI travel companion that turns a chat into a day-by-day itinerary.',
      updated: '20 September 2026',
      intro:
        'Catpawtrip (貓爪印) is a small AI travel planner. You talk about where you want to go. A living itinerary appears beside the chat. Confirm it when it feels right, then keep it private, share a link, or publish it for other travelers.',
      sections: [
        {
          heading: 'What we are building',
          paragraphs: [
            'Most trip tools ask you to fill forms. We start with a conversation. Catpawtrip drafts days, meals, and walking routes, then lets you edit cards the way you would tweak a document.',
            'The Chinese name 貓爪印 means “cat paw print.” It is the same product, not a second brand.',
          ],
        },
        {
          heading: 'What Catpawtrip is not',
          paragraphs: [
            'We are not an airline, hotel, or travel agency. Booking buttons may open Trip.com or Maps. Those bookings happen with the third party, not with us.',
            'AI plans can miss a closed kitchen, a holiday crowd, or a last-minute rail change. Treat every draft as a starting point, then check opening hours before you go.',
          ],
        },
        {
          heading: 'Who runs this',
          paragraphs: [
            `Catpawtrip is operated as an independent web product at ${SITE}. For press, bugs, or a hello, write to ${CONTACT} or use the contact form.`,
          ],
        },
      ],
    },
    'zh-Hant': {
      title: '關於 Catpawtrip',
      description: 'Catpawtrip 貓爪印是把聊天變成每日行程的 AI 旅行陪伴。',
      updated: '2026年9月20日',
      intro:
        'Catpawtrip（貓爪印）是一個小型 AI 旅行規劃工具。你說想去哪，右側就會長出活的行程。覺得對了再確認，可以自己留著、傳連結給朋友，或公開到社群。',
      sections: [
        {
          heading: '我們在做什麼',
          paragraphs: [
            '多數行程工具要你填表。我們從對話開始。Catpawtrip 會草擬每天的景點、吃飯與走路路線，你也可以像改文件一樣直接改卡片。',
            '中文名「貓爪印」就是同一個產品，不是另一個品牌。',
          ],
        },
        {
          heading: '我們不是什麼',
          paragraphs: [
            '我們不是航空公司、飯店或旅行社。訂房或地圖按鈕可能會打開 Trip.com 或 Maps，交易發生在那些第三方，不是我們這裡。',
            'AI 行程可能漏掉公休、連假人潮或臨時停駛。請把草稿當起點，出門前再核對營業時間。',
          ],
        },
        {
          heading: '誰在營運',
          paragraphs: [
            `Catpawtrip 是獨立網站，網址 ${SITE}。媒體、問題或打招呼，請來信 ${CONTACT}，或用聯絡表單。`,
          ],
        },
      ],
    },
  },
  privacy: {
    en: {
      title: 'Privacy Policy',
      description: 'How Catpawtrip collects, uses, and stores your trip and account data.',
      updated: '20 September 2026',
      intro:
        'This policy explains what Catpawtrip 貓爪印 collects when you plan a trip, create an account, or write to us. We only keep what we need to run the planner.',
      sections: [
        {
          heading: 'Who we are',
          paragraphs: [
            `The service is Catpawtrip, available at ${SITE}. Questions about this policy: ${CONTACT}.`,
          ],
        },
        {
          heading: 'What we collect',
          paragraphs: [
            'Account data: email address, password hash (handled by Supabase Auth), and optional Google profile details if you sign in with Google.',
            'Trip data: destinations, dates, notes, itinerary cards, version history, visibility (private / link / public), ratings, and comments you post.',
            'Chat data: messages you send the planner, including optional photo or PDF attachments up to 5 MB. Heavy file data is stripped before we persist a conversation.',
            'Contact forms: name, email, and message if you write to us. We send those to our inbox with Resend.',
            'Device preferences stored on your browser: language, itinerary view style, guest drafts, and optional offline copies of a trip. Those stay on the device unless you sign in and save a trip.',
          ],
        },
        {
          heading: 'How we use it',
          paragraphs: [
            'To generate and update itineraries, keep version history, restore a guest draft after you sign in, show maps, and send a share or community page.',
            'To email you a confirmation link, recover a session, or reply if you contacted us.',
            'We do not sell your personal information. We do not use your chats to train a public model of our own.',
          ],
        },
        {
          heading: 'Who else sees it',
          paragraphs: [
            'Supabase stores accounts and trips. Vercel hosts the app. Mapbox renders maps. Wikipedia may be queried when you tap “What is this?”. Resend delivers contact mail. Trip.com sees only what you send after you click a booking link.',
            'Private trips stay with your account. A share link lets anyone with the URL view that plan. A public trip appears on Community, where signed-in people can rate and comment.',
          ],
        },
        {
          heading: 'How long we keep it',
          paragraphs: [
            'Account and saved trips stay until you delete the trip or ask us to close the account. Guest drafts and offline copies live in your browser until you clear site data.',
            'Contact emails are kept long enough to reply and then deleted from the mailbox in the ordinary course of mail.',
          ],
        },
        {
          heading: 'Your choices',
          paragraphs: [
            'You can edit or delete trips you own, change a public trip back to private, remove an offline copy, and sign out.',
            `To export or erase an account, email ${CONTACT} from the same address you use to sign in. We will confirm and then delete the profile and trips we store.`,
          ],
        },
        {
          heading: 'Children',
          paragraphs: [
            'Catpawtrip is not aimed at children under 16. If we learn we have an account for a younger child, we will delete it.',
          ],
        },
      ],
    },
    'zh-Hant': {
      title: '隱私權政策',
      description: 'Catpawtrip 如何蒐集、使用與保存你的行程與帳號資料。',
      updated: '2026年9月20日',
      intro:
        '這份政策說明你在規劃行程、建立帳號或聯絡我們時，Catpawtrip 貓爪印會蒐集什麼。我們只留運作規劃器需要的資料。',
      sections: [
        {
          heading: '我們是誰',
          paragraphs: [
            `服務名稱是 Catpawtrip，網站 ${SITE}。隱私問題請來信 ${CONTACT}。`,
          ],
        },
        {
          heading: '我們蒐集什麼',
          paragraphs: [
            '帳號：電子郵件、由 Supabase Auth 保存的密碼雜湊；若用 Google 登入，也會有 Google 提供的基本資料。',
            '行程：目的地、日期、備註、行程卡片、版本紀錄、可見度（僅自己／連結／公開）、評分與留言。',
            '聊天：你傳給規劃器的訊息，以及可選的 5 MB 以內照片或 PDF。較重的檔案內容在寫入對話前會被拿掉。',
            '聯絡表單：名字、電郵與內容。我們用 Resend 寄到信箱。',
            '存在瀏覽器裡的偏好：語言、行程版型、訪客草稿，以及你主動存的離線副本。未登入前，這些資料留在裝置上。',
          ],
        },
        {
          heading: '我們怎麼用',
          paragraphs: [
            '用來產生與更新行程、保留版本、登入後還原訪客草稿、顯示地圖，以及建立分享或社群頁。',
            '用來寄確認信、恢復登入，或回覆你的來信。',
            '我們不出售個人資料，也不會拿你的對話去訓練我們自己的公開模型。',
          ],
        },
        {
          heading: '還有誰看得到',
          paragraphs: [
            '帳號與行程存在 Supabase。網站託管在 Vercel。地圖由 Mapbox 繪製。點「這是哪裡？」時可能查詢 Wikipedia。聯絡信由 Resend 寄送。點訂房連結後，資料才會到 Trip.com。',
            '私人行程只留在你的帳號。分享連結讓拿到網址的人能看。公開行程會出現在社群，已登入的人可以評分與留言。',
          ],
        },
        {
          heading: '保存多久',
          paragraphs: [
            '帳號與已儲存行程會留到你刪除行程，或請我們關閉帳號。訪客草稿與離線副本留在瀏覽器，直到你清除網站資料。',
            '聯絡信件會留到我們回覆，之後依一般信件處理刪除。',
          ],
        },
        {
          heading: '你的選擇',
          paragraphs: [
            '你可以改或刪自己的行程、把公開行程改回私人、移除離線副本，以及登出。',
            `若要匯出或刪除帳號，請用登入的同一封信寄到 ${CONTACT}。我們確認後會刪除我們保存的個人檔案與行程。`,
          ],
        },
        {
          heading: '兒童',
          paragraphs: [
            'Catpawtrip 不是給未滿 16 歲的孩子用的。如果發現這樣的帳號，我們會刪除。',
          ],
        },
      ],
    },
  },
  terms: {
    en: {
      title: 'Terms of Use',
      description: 'The rules for using Catpawtrip, including accounts, AI plans, and community posts.',
      updated: '20 September 2026',
      intro:
        'By using Catpawtrip 貓爪印 you agree to these terms. If you do not agree, do not create an account or publish a trip.',
      sections: [
        {
          heading: 'The service',
          paragraphs: [
            'Catpawtrip is a web app that drafts travel itineraries from a chat. Features include guest drafts, signed-in saves, version history, share links, community publishing, maps, and optional booking links.',
            'We may change or pause features. The planner can be slow or fail when a map, weather, or AI provider is down.',
          ],
        },
        {
          heading: 'Accounts',
          paragraphs: [
            'You must give a real email you control. Keep your password to yourself. You are responsible for trips and comments posted from your account.',
            'We may suspend an account that is abusive, automated spam, or trying to break the service.',
          ],
        },
        {
          heading: 'AI plans are suggestions',
          paragraphs: [
            'Itineraries, prices, hours, and transit notes are generated or assembled from third-party data. They can be wrong. You are responsible for visas, tickets, safety, and whether a place is open.',
            'Catpawtrip is not a licensed travel agent and does not sell transport or lodging.',
          ],
        },
        {
          heading: 'Your content',
          paragraphs: [
            'You keep the rights to notes, comments, and photos you upload. You give us a licence to host them and, if you publish a trip, to show them on Community.',
            'Do not post illegal content, other people’s private data, or material you do not have the right to share. We may remove it.',
          ],
        },
        {
          heading: 'Booking links',
          paragraphs: [
            'Some “Book stay” buttons use Trip.com affiliate links. If you book there, Trip.com’s terms apply. We may receive a commission. That does not change the price you see.',
          ],
        },
        {
          heading: 'Liability',
          paragraphs: [
            'The service is provided as is. To the extent allowed by law, we are not liable for missed trains, closed venues, booking disputes, or losses from relying on an AI draft.',
            'These terms are governed by the laws of Hong Kong SAR. The courts of Hong Kong have exclusive jurisdiction, except where consumer law in your country says otherwise.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [`Questions about these terms: ${CONTACT}.`],
        },
      ],
    },
    'zh-Hant': {
      title: '使用條款',
      description: '使用 Catpawtrip 的規則，包含帳號、AI 行程與社群內容。',
      updated: '2026年9月20日',
      intro:
        '使用 Catpawtrip 貓爪印即表示你同意這些條款。若不同意，請不要建立帳號或公開行程。',
      sections: [
        {
          heading: '服務內容',
          paragraphs: [
            'Catpawtrip 是用聊天草擬旅行行程的網站。功能包含訪客草稿、登入後儲存、版本紀錄、分享連結、社群公開、地圖，以及可選的訂房連結。',
            '我們可能調整或暫停功能。地圖、天氣或 AI 服務中斷時，規劃器可能變慢或失敗。',
          ],
        },
        {
          heading: '帳號',
          paragraphs: [
            '請用你能收信的真實電郵。密碼請自己保管。從你帳號發出的行程與留言由你負責。',
            '若帳號濫用、發送垃圾訊息或嘗試破壞服務，我們可以停用。',
          ],
        },
        {
          heading: 'AI 行程只是建議',
          paragraphs: [
            '行程、價錢、營業時間與交通說明來自生成或第三方資料，可能有錯。簽證、票券、安全與店家是否開門，都要你自己確認。',
            'Catpawtrip 不是持牌旅行社，也不出售交通或住宿。',
          ],
        },
        {
          heading: '你的內容',
          paragraphs: [
            '你上傳的備註、留言與照片，權利仍是你的。你授權我們托管；若你公開行程，也授權我們在社群顯示。',
            '請勿發布違法內容、他人隱私，或你沒有權利分享的素材。我們可以移除。',
          ],
        },
        {
          heading: '訂房連結',
          paragraphs: [
            '部分「訂房」按鈕使用 Trip.com 聯盟連結。你在那邊訂房，就適用 Trip.com 的條款。我們可能收到佣金，這不會改變你看到的價格。',
          ],
        },
        {
          heading: '責任限制',
          paragraphs: [
            '服務依現況提供。在法律允許範圍內，我們不為誤點、店家公休、訂房糾紛，或依 AI 草稿造成的損失負責。',
            '條款適用香港特別行政區法律。除你所在地消費者保護法另有規定外，由香港法院專屬管轄。',
          ],
        },
        {
          heading: '聯絡',
          paragraphs: [`條款問題請來信 ${CONTACT}。`],
        },
      ],
    },
  },
  cookies: {
    en: {
      title: 'Cookies & local storage',
      description: 'How Catpawtrip uses cookies and browser storage to keep you signed in and remember drafts.',
      updated: '20 September 2026',
      intro:
        'Catpawtrip uses a few first-party cookies and browser storage keys so the planner can remember you. We do not run advertising cookies.',
      sections: [
        {
          heading: 'Sign-in cookies',
          paragraphs: [
            'Supabase Auth sets cookies so you stay signed in as you move between pages. They are required for My trips, confirm, share, and comments. Clearing them signs you out.',
          ],
        },
        {
          heading: 'Preferences on this device',
          paragraphs: [
            'Language is stored as levart-locale (and a matching cookie) so the header can keep 繁體中文 or English.',
            'Itinerary layout is stored as levart-view-style (Clean, Journal, or Compact).',
            'A homepage prompt can be stored as levart-hero-prompt so the planner opens with what you just typed.',
          ],
        },
        {
          heading: 'Drafts and offline copies',
          paragraphs: [
            'If you plan before signing in, the draft chat and itinerary are stored as levart-guest-draft. After you sign in we restore that draft, then you can confirm it.',
            'If you tap “Save to this phone”, a copy is stored under levart-offline-* so you can read the plan without signal. That copy never leaves the device unless you share the trip yourself.',
          ],
        },
        {
          heading: 'Third parties',
          paragraphs: [
            'Mapbox may set its own storage when a map loads. Google may set cookies if you choose “Continue with Google.” Wikipedia is only requested when you open a place hint.',
          ],
        },
        {
          heading: 'How to clear them',
          paragraphs: [
            'Use your browser’s site-data or cookie controls for catpawtrip.com. You will be signed out and guest drafts will disappear. Signed-in trips on the server are not deleted until you delete them in the app or ask us.',
          ],
        },
      ],
    },
    'zh-Hant': {
      title: 'Cookies 與本機儲存',
      description: 'Catpawtrip 如何用 cookie 與瀏覽器儲存來維持登入與草稿。',
      updated: '2026年9月20日',
      intro:
        'Catpawtrip 只用少量第一方 cookie 與瀏覽器儲存，讓規劃器記得你。我們沒有廣告 cookie。',
      sections: [
        {
          heading: '登入用 cookie',
          paragraphs: [
            'Supabase Auth 會設 cookie，讓你換頁時保持登入。我的行程、確認、分享與留言都需要它。清掉就等於登出。',
          ],
        },
        {
          heading: '這台裝置上的偏好',
          paragraphs: [
            '語言存在 levart-locale（以及對應 cookie），頁首才能記住繁體中文或 English。',
            '行程版型存在 levart-view-style（乾淨、手帳、精簡）。',
            '首頁剛輸入的句子可能存在 levart-hero-prompt，方便規劃器接著用。',
          ],
        },
        {
          heading: '草稿與離線副本',
          paragraphs: [
            '還沒登入就開始規劃時，聊天與行程會存在 levart-guest-draft。登入後我們會還原這份草稿，你再確認。',
            '若你點「儲存到這支手機」，副本會寫進 levart-offline-*，沒有訊號也能看。除非你自己分享行程，這份副本不會離開裝置。',
          ],
        },
        {
          heading: '第三方',
          paragraphs: [
            '地圖載入時 Mapbox 可能寫入自己的儲存。若你選「用 Google 繼續」，Google 可能設 cookie。只有在你打開地點提示時，才會向 Wikipedia 發請求。',
          ],
        },
        {
          heading: '怎麼清除',
          paragraphs: [
            '在瀏覽器的網站資料或 cookie 設定裡清除 catpawtrip.com。你會被登出，訪客草稿也會消失。已登入、存在伺服器的行程不會因此刪除，除非你在網站刪除或請我們處理。',
          ],
        },
      ],
    },
  },
}

export function getLegalDoc(slug: LegalSlug, locale: Locale): LegalDoc {
  return docs[slug][locale]
}
