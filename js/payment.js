// 송금 연동 기능
class PaymentManager {
    constructor() {
        this.accountInfo = {
            groom: {
                name: '박현국',
                bank: '하나은행',
                account: '423-910004-73108'
            },
            bride: {
                name: '조수민',
                bank: '농협은행',
                account: '312-5094-9336-71'
            }
        };
    }
    
    // 카카오페이 송금 연동
    openKakaoPay(recipient) {
        const account = this.accountInfo[recipient];
        
        if (!account) {
            this.showError('계좌 정보를 찾을 수 없습니다.');
            return;
        }
        
        try {
            // 카카오페이 송금 URL 스키마
            // supertoss://send?bank={은행코드}&accountno={계좌번호}&amount={금액}&msg={메시지}
            
            const bankCode = this.getBankCode(account.bank);
            const accountNumber = account.account.replace(/-/g, '');
            const message = encodeURIComponent(`${account.name} 결혼 축하금`);
            
            // 카카오페이 앱 실행 URL
            const kakaoPayUrl = `kakaopay://money/to/bank?bank=${bankCode}&account=${accountNumber}&name=${encodeURIComponent(account.name)}&memo=${message}`;
            
            // 모바일에서 앱 실행 시도
            if (this.isMobile()) {
                this.openMobileApp(kakaoPayUrl, () => {
                    // 앱 설치되지 않은 경우 웹 버전으로 이동
                    this.openKakaoPayWeb(account, message);
                });
            } else {
                // 데스크톱에서는 웹 버전으로 이동
                this.openKakaoPayWeb(account, message);
            }
            
        } catch (error) {
            console.error('카카오페이 연동 오류:', error);
            this.showError('카카오페이 연동 중 오류가 발생했습니다.');
        }
    }
    
    openKakaoPayWeb(account, message) {
        // 카카오페이 웹 버전 또는 계좌 정보 안내 팝업
        this.showPaymentModal('kakaopay', account, message);
    }
    
    // 토스 송금 연동
    openToss(recipient) {
        const account = this.accountInfo[recipient];
        
        if (!account) {
            this.showError('계좌 정보를 찾을 수 없습니다.');
            return;
        }
        
        try {
            const bankCode = this.getTossBankCode(account.bank);
            const accountNumber = account.account.replace(/-/g, '');
            const message = encodeURIComponent(`${account.name} 결혼 축하금`);
            
            // 토스 앱 실행 URL 스키마
            const tossUrl = `supertoss://send?bank=${bankCode}&accountno=${accountNumber}&msg=${message}`;
            
            if (this.isMobile()) {
                this.openMobileApp(tossUrl, () => {
                    // 앱이 설치되지 않은 경우 토스 다운로드 페이지로 이동
                    this.openTossWeb(account, message);
                });
            } else {
                // 데스크톱에서는 토스 웹 버전 안내
                this.openTossWeb(account, message);
            }
            
        } catch (error) {
            console.error('토스 연동 오류:', error);
            this.showError('토스 연동 중 오류가 발생했습니다.');
        }
    }
    
    openTossWeb(account, message) {
        // 토스 웹 버전 또는 앱 다운로드 안내
        this.showPaymentModal('toss', account, message);
    }
    
    // 모바일 앱 실행 시도
    openMobileApp(url, fallbackCallback) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        // 3초 후 앱이 실행되지 않으면 폴백 실행
        setTimeout(() => {
            document.body.removeChild(iframe);
            if (fallbackCallback) {
                fallbackCallback();
            }
        }, 3000);
        
        // 페이지가 블러되면 앱이 실행된 것으로 간주
        const startTime = Date.now();
        window.addEventListener('blur', () => {
            if (Date.now() - startTime < 3000) {
                document.body.removeChild(iframe);
            }
        }, { once: true });
    }
    
    // 결제 모달 표시
    showPaymentModal(type, account, message) {
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        
        const appName = type === 'kakaopay' ? '카카오페이' : '토스';
        const appColor = type === 'kakaopay' ? '#FEE500' : '#0064FF';
        const textColor = type === 'kakaopay' ? '#000' : '#fff';
        
        modal.innerHTML = `
            <div class="payment-modal-content">
                <div class="payment-modal-header">
                    <h3>${appName} 송금하기</h3>
                    <button class="payment-modal-close" onclick="this.closest('.payment-modal').remove()">&times;</button>
                </div>
                <div class="payment-modal-body">
                    <div class="payment-info">
                        <div class="payment-app-icon" style="background: ${appColor}; color: ${textColor};">
                            ${type === 'kakaopay' ? '💰' : '💳'}
                        </div>
                        <h4>${account.name}님께 송금하기</h4>
                        <div class="account-info-modal">
                            <p><strong>은행:</strong> ${account.bank}</p>
                            <p><strong>계좌번호:</strong> ${account.account}</p>
                            <p><strong>예금주:</strong> ${account.name}</p>
                        </div>
                    </div>
                    
                    <div class="payment-actions">
                        ${this.isMobile() ? `
                            <button class="payment-btn primary" onclick="window.open('${this.getAppStoreUrl(type)}', '_blank')">
                                ${appName} 앱에서 송금하기
                            </button>
                        ` : `
                            <p class="payment-guide">
                                모바일에서 ${appName} 앱을 이용해 송금해주세요.
                            </p>
                        `}
                        
                        <button class="payment-btn secondary" onclick="copyAccountNumber('${account.account}')">
                            계좌번호 복사하기
                        </button>
                        
                        <div class="qr-section">
                            <p class="qr-guide">QR코드로 간편 송금</p>
                            <div class="qr-placeholder" onclick="generateQRCode('${account.bank}', '${account.account}', '${account.name}')">
                                📱 QR코드 생성
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 스타일 적용
        this.addPaymentModalStyles();
        
        document.body.appendChild(modal);
        
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // ESC 키로 닫기
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
    
    addPaymentModalStyles() {
        if (document.querySelector('.payment-modal-styles')) return;
        
        const style = document.createElement('style');
        style.className = 'payment-modal-styles';
        style.textContent = `
            .payment-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .payment-modal-content {
                background: white;
                border-radius: 16px;
                max-width: 400px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideIn 0.3s ease;
            }
            
            .payment-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px 16px;
                border-bottom: 1px solid #eee;
            }
            
            .payment-modal-header h3 {
                margin: 0;
                font-size: 1.2rem;
                color: #333;
            }
            
            .payment-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 4px;
                color: #666;
            }
            
            .payment-modal-close:hover {
                color: #333;
            }
            
            .payment-modal-body {
                padding: 24px;
            }
            
            .payment-info {
                text-align: center;
                margin-bottom: 24px;
            }
            
            .payment-app-icon {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                margin: 0 auto 16px;
            }
            
            .payment-info h4 {
                margin: 0 0 16px;
                font-size: 1.1rem;
                color: #333;
            }
            
            .account-info-modal {
                background: #f8f9fa;
                padding: 16px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .account-info-modal p {
                margin: 8px 0;
                font-size: 0.9rem;
                color: #666;
            }
            
            .account-info-modal strong {
                color: #333;
            }
            
            .payment-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .payment-btn {
                padding: 12px 16px;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .payment-btn.primary {
                background: #8B4F92;
                color: white;
            }
            
            .payment-btn.primary:hover {
                background: #7a4580;
                transform: translateY(-1px);
            }
            
            .payment-btn.secondary {
                background: #f1f3f4;
                color: #333;
                border: 1px solid #ddd;
            }
            
            .payment-btn.secondary:hover {
                background: #e8eaed;
            }
            
            .payment-guide {
                text-align: center;
                color: #666;
                font-size: 0.9rem;
                margin: 12px 0;
                line-height: 1.4;
            }
            
            .qr-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                text-align: center;
            }
            
            .qr-guide {
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 12px;
            }
            
            .qr-placeholder {
                background: #f8f9fa;
                border: 2px dashed #ddd;
                border-radius: 8px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 1rem;
                color: #666;
            }
            
            .qr-placeholder:hover {
                border-color: #8B4F92;
                color: #8B4F92;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @media (max-width: 480px) {
                .payment-modal-content {
                    width: 95%;
                    margin: 20px;
                }
                
                .payment-modal-body {
                    padding: 20px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // 은행 코드 변환 (카카오페이용)
    getBankCode(bankName) {
        const bankCodes = {
            '하나은행': '081',
            '농협은행': '011',
            '국민은행': '004',
            '신한은행': '088',
            '우리은행': '020',
            '기업은행': '003',
            '카카오뱅크': '090',
            '토스뱅크': '092'
        };
        return bankCodes[bankName] || '000';
    }
    
    // 토스 은행 코드 변환
    getTossBankCode(bankName) {
        const tossBankCodes = {
            '하나은행': 'hana',
            '농협은행': 'nh',
            '국민은행': 'kb',
            '신한은행': 'shinhan',
            '우리은행': 'woori',
            '기업은행': 'ibk',
            '카카오뱅크': 'kakao',
            '토스뱅크': 'toss'
        };
        return tossBankCodes[bankName] || 'etc';
    }
    
    // 앱 스토어 URL
    getAppStoreUrl(type) {
        const urls = {
            'kakaopay': {
                android: 'https://play.google.com/store/apps/details?id=com.kakaopay.app',
                ios: 'https://apps.apple.com/kr/app/kakaopay/id1464496236'
            },
            'toss': {
                android: 'https://play.google.com/store/apps/details?id=viva.republica.toss',
                ios: 'https://apps.apple.com/kr/app/toss/id839333328'
            }
        };
        
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        if (isIOS) {
            return urls[type].ios;
        } else if (isAndroid) {
            return urls[type].android;
        } else {
            return urls[type].android; // 기본값
        }
    }
    
    // 모바일 기기 체크
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // 에러 메시지 표시
    showError(message) {
        alert(message); // 간단한 알림, 추후 토스트로 교체 가능
    }
}

// 전역 함수들
const paymentManager = new PaymentManager();

window.openKakaoPay = function(recipient) {
    paymentManager.openKakaoPay(recipient);
};

window.openToss = function(recipient) {
    paymentManager.openToss(recipient);
};

window.copyAccountNumber = function(accountNumber) {
    // 기존 복사 기능 재사용
    const weddingApp = window.weddingApp || new WeddingInvitation();
    weddingApp.copyToClipboard(accountNumber).then(() => {
        weddingApp.showToast('계좌번호가 복사되었습니다!');
    }).catch(() => {
        weddingApp.showToast('복사에 실패했습니다.', 'error');
    });
};

window.generateQRCode = function(bank, account, name) {
    // QR 코드 생성 (추후 구현)
    alert(`QR 코드 생성 기능\n은행: ${bank}\n계좌: ${account}\n예금주: ${name}`);
};