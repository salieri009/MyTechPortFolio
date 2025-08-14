// 미래지향적 이메일 템플릿
import { FeedbackData, EmailTemplate, CategoryType } from './types'

// 카테고리 정보 매핑
const getCategoryInfo = (category: string) => {
  const categoryMap: Record<string, { label: string; emoji: string; color: string }> = {
    'general': { label: '일반 피드백', emoji: '💬', color: '#3b82f6' },
    'technical': { label: '기술적 제안', emoji: '⚙️', color: '#059669' },
    'design': { label: '디자인 개선', emoji: '🎨', color: '#dc2626' },
    'collaboration': { label: '협업 제안', emoji: '🤝', color: '#7c3aed' },
    'bug': { label: '버그 리포트', emoji: '🐛', color: '#ea580c' },
    'other': { label: '기타', emoji: '📝', color: '#6b7280' }
  }
  return categoryMap[category] || categoryMap['other']
}

// HTML 이스케이프 함수
const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

export const buildEmailTemplate = (data: FeedbackData): EmailTemplate => {
  const timestamp = new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const categoryInfo = getCategoryInfo(data.category)
  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourportfolio.com'

  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>포트폴리오 피드백</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #f8fafc;
            line-height: 1.6;
            color: #1e293b;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            border-radius: 16px;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.1;
            background-image: 
                radial-gradient(circle at 25% 25%, white 2px, transparent 2px), 
                radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
            background-size: 50px 50px;
        }
        
        .logo {
            display: inline-block;
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            position: relative;
            z-index: 1;
        }
        
        .logo-text {
            font-size: 28px;
            font-weight: bold;
            color: white;
        }
        
        .header-title {
            color: white;
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
            position: relative;
            z-index: 1;
        }
        
        .header-subtitle {
            color: rgba(255,255,255,0.9);
            margin: 0;
            font-size: 16px;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .sender-card {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 30px;
            border: 1px solid #e2e8f0;
        }
        
        .card-title {
            margin: 0 0 20px 0;
            color: #1e293b;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
        }
        
        .title-accent {
            display: inline-block;
            width: 8px;
            height: 20px;
            background: linear-gradient(135deg, #3b82f6, #a855f7);
            border-radius: 4px;
            margin-right: 12px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }
        
        .info-item {
            margin: 0;
        }
        
        .info-label {
            margin: 0 0 4px 0;
            color: #64748b;
            font-size: 14px;
            font-weight: 500;
        }
        
        .info-value {
            margin: 0;
            color: #1e293b;
            font-size: 16px;
            font-weight: 600;
        }
        
        .info-email {
            color: #3b82f6;
            font-weight: 500;
        }
        
        .category-badge {
            display: inline-block;
            padding: 6px 12px;
            background: ${categoryInfo.color};
            color: white;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .info-time {
            color: #1e293b;
            font-size: 14px;
        }
        
        .subject-section {
            margin-bottom: 30px;
        }
        
        .subject-title {
            margin: 0 0 10px 0;
            color: #1e293b;
            font-size: 20px;
            font-weight: 700;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .message-card {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 30px;
            position: relative;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .message-accent {
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(135deg, #3b82f6, #a855f7);
            border-radius: 2px 0 0 2px;
        }
        
        .message-content {
            margin-left: 16px;
        }
        
        .message-title {
            margin: 0 0 16px 0;
            color: #1e293b;
            font-size: 16px;
            font-weight: 600;
        }
        
        .message-text {
            color: #374151;
            font-size: 15px;
            line-height: 1.7;
            white-space: pre-wrap;
        }
        
        .action-section {
            text-align: center;
            margin-top: 40px;
        }
        
        .reply-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #a855f7);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .footer {
            background: #1e293b;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer-link {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
            font-size: 18px;
            margin-bottom: 20px;
            display: inline-block;
        }
        
        .footer-text {
            margin: 0;
            color: #94a3b8;
            font-size: 14px;
        }
        
        /* 모바일 최적화 */
        @media only screen and (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 12px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .header-title {
                font-size: 24px;
            }
            
            .reply-button {
                padding: 12px 24px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        
        <!-- 헤더: 미래지향적 그라데이션 -->
        <div class="header">
            <div class="logo">
                <span class="logo-text">MT</span>
            </div>
            <h1 class="header-title">${categoryInfo.emoji} 새로운 피드백</h1>
            <p class="header-subtitle">MyTech Portfolio에서 새로운 메시지가 도착했습니다</p>
        </div>

        <!-- 본문 내용 -->
        <div class="content">
            
            <!-- 발신자 정보 카드 -->
            <div class="sender-card">
                <h2 class="card-title">
                    <span class="title-accent"></span>
                    발신자 정보
                </h2>
                
                <div class="info-grid">
                    <div class="info-item">
                        <p class="info-label">이름</p>
                        <p class="info-value">${escapeHtml(data.name)}</p>
                    </div>
                    <div class="info-item">
                        <p class="info-label">이메일</p>
                        <p class="info-value info-email">${escapeHtml(data.email)}</p>
                    </div>
                </div>
                
                <div class="info-grid">
                    <div class="info-item">
                        <p class="info-label">카테고리</p>
                        <span class="category-badge">${categoryInfo.emoji} ${categoryInfo.label}</span>
                    </div>
                    <div class="info-item">
                        <p class="info-label">수신 시간</p>
                        <p class="info-time">${timestamp}</p>
                    </div>
                </div>
            </div>

            <!-- 제목 -->
            <div class="subject-section">
                <h3 class="subject-title">
                    📝 ${escapeHtml(data.subject)}
                </h3>
            </div>

            <!-- 메시지 내용 -->
            <div class="message-card">
                <div class="message-accent"></div>
                <div class="message-content">
                    <h4 class="message-title">메시지 내용</h4>
                    <div class="message-text">${escapeHtml(data.message)}</div>
                </div>
            </div>

            <!-- 액션 버튼 -->
            <div class="action-section">
                <a href="mailto:${escapeHtml(data.email)}?subject=Re: ${encodeURIComponent(data.subject)}" 
                   class="reply-button">
                    ↩️ 답장하기
                </a>
            </div>
        </div>

        <!-- 푸터 -->
        <div class="footer">
            <a href="${websiteUrl}" class="footer-link">
                🌐 MyTech Portfolio 방문하기
            </a>
            <p class="footer-text">
                이 메시지는 ${websiteUrl}에서 자동으로 전송되었습니다.<br>
                © 2024 MyTech Portfolio. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`

  const plain = `
${categoryInfo.emoji} 새로운 포트폴리오 피드백

발신자: ${data.name}
이메일: ${data.email}
카테고리: ${categoryInfo.label}
제목: ${data.subject}
수신 시간: ${timestamp}

메시지 내용:
${data.message}

---
이 메시지는 ${websiteUrl}에서 전송되었습니다.
답장: ${data.email}

MyTech Portfolio: ${websiteUrl}
© 2024 MyTech Portfolio. All rights reserved.
`

  return { html, plain }
}
