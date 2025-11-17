# EmailJS ?¤ì • ê°€?´ë“œ

## 1. EmailJS ê³„ì • ?ì„± ë°??¤ì •

### ?Œì›ê°€??ë°??œë¹„???ì„±
1. [EmailJS](https://www.emailjs.com/) ë°©ë¬¸
2. ê³„ì • ?ì„± (ë¬´ë£Œ ?Œëœ: ??200??ë¬´ë£Œ)
3. ???œë¹„???ì„± (Gmail, Outlook ???°ë™)

### ?´ë©”???œí”Œë¦??ì„±
EmailJS ?€?œë³´?œì—???´ë©”???œí”Œë¦¿ì„ ?¤ìŒê³?ê°™ì´ ?ì„±:

```html
Subject: [?¬íŠ¸?´ë¦¬???¼ë“œë°? {{subject}}

From: {{from_name}} <{{from_email}}>
To: {{to_email}}

HTML ?œí”Œë¦?
{{{html_content}}}

Plain Text ?œí”Œë¦?
{{{plain_content}}}
```

## 2. ?˜ê²½ ë³€???¤ì •

`.env` ?Œì¼???ì„±?˜ì—¬ ?¤ìŒ ë³€?˜ë“¤???¤ì •:

```env
# EmailJS ?¤ì •
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here  
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_FEEDBACK_EMAIL=your.email@example.com

# ê¸°í? ?¤ì •
VITE_USE_BACKEND_API=false
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 3. ?¤ì • ê°??•ì¸ ë°©ë²•

EmailJS ?€?œë³´?œì—??
- **Service ID**: Email Services > ?œë¹„??? íƒ > Service ID
- **Template ID**: Email Templates > ?œí”Œë¦?? íƒ > Template ID  
- **Public Key**: Account > API Keys > Public Key

## 4. ?ŒìŠ¤??

ê°œë°œ???„êµ¬ ì½˜ì†”?ì„œ ?¤ì • ?íƒœ ?•ì¸:
```javascript
// EmailJS ?¤ì • ?íƒœ ì²´í¬
import { getEmailConfigStatus } from '@services/email'
console.log(getEmailConfigStatus())

// ?ŒìŠ¤???´ë©”???„ì†¡
import { testEmailConnection } from '@services/email'
testEmailConnection()
```

## 5. ì£¼ì˜?¬í•­

- `.env` ?Œì¼?€ `.gitignore`??ì¶”ê??˜ì–´ ?ˆì–´ Git??ì»¤ë°‹?˜ì? ?ŠìŠµ?ˆë‹¤
- ?„ë¡œ?•ì…˜ ?˜ê²½?ì„œ???˜ê²½ ë³€?˜ë? ë³„ë„ë¡??¤ì •?´ì•¼ ?©ë‹ˆ??
- EmailJS ë¬´ë£Œ ?Œëœ ?œí•œ: ??200?? ì´ˆë‹¹ 1??
- ?¤ì œ ?´ë©”???„ì†¡???„í•´?œëŠ” ? íš¨??EmailJS ?¤ì •???„ìš”?©ë‹ˆ??
