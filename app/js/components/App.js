// メインアプリケーションコンポーネント
const App = () => {
    const [isSetupComplete, setIsSetupComplete] = React.useState(false);
    const [showFortune, setShowFortune] = React.useState(false);
    const [todayFortune, setTodayFortune] = React.useState('');
    const [showBirthdayMessage, setShowBirthdayMessage] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // 初期化処理
        const initializeApp = () => {
            setLoading(true);
            
            // 設定完了チェック
            const setupComplete = UserData.isSetupComplete();
            setIsSetupComplete(setupComplete);
            
            if (setupComplete) {
                // 誕生日チェック
                if (UserData.isBirthday()) {
                    setShowBirthdayMessage(true);
                    // 誕生日の花火エフェクト
                    setTimeout(() => {
                        if (typeof drawFireworks === 'function') {
                            drawFireworks();
                        }
                    }, 1000);
                }
                
                // 今日の占いチェック（初回ログインのみ）
                if (!UserData.hasTodayFortuneShown()) {
                    const userSettings = UserData.getUserSettings();
                    const fortune = Helpers.generateFortune(userSettings.birthdate, userSettings.gender);
                    setTodayFortune(fortune);
                    setShowFortune(true);
                    UserData.markTodayFortuneShown();
                }
            }
            
            setLoading(false);
        };

        initializeApp();
    }, []);

    // 設定完了時の処理
    const handleSetupComplete = () => {
        setIsSetupComplete(true);
        
        // 設定完了後、占いを表示
        const userSettings = UserData.getUserSettings();
        const fortune = Helpers.generateFortune(userSettings.birthdate, userSettings.gender);
        setTodayFortune(fortune);
        setShowFortune(true);
        UserData.markTodayFortuneShown();
    };

    // 占いを閉じる
    const closeFortune = () => {
        setShowFortune(false);
    };

    // 誕生日メッセージを閉じる
    const closeBirthdayMessage = () => {
        setShowBirthdayMessage(false);
    };

    // ローディング画面
    if (loading) {
        return React.createElement('div', {
            style: {
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontFamily: 'Baloo 2, cursive'
            }
        }, 'Loading...');
    }

    // 初回設定画面
    if (!isSetupComplete) {
        return React.createElement(UserSettings, {
            onComplete: handleSetupComplete
        });
    }

    // メインアプリケーション
    const userSettings = UserData.getUserSettings();
    
    return React.createElement('div', null, [
        // 誕生日メッセージ
        showBirthdayMessage && React.createElement(BirthdayMessage, {
            key: 'birthday',
            name: userSettings.name,
            onClose: closeBirthdayMessage
        }),
        
        // 占いモーダル
        showFortune && React.createElement(FortuneModal, {
            key: 'fortune',
            name: userSettings.name,
            fortune: todayFortune,
            onClose: closeFortune
        }),
        
        // カレンダーアプリ
        React.createElement(CalendarApp, {
            key: 'calendar'
        })
    ]);
};

// 占いモーダルコンポーネント
const FortuneModal = ({ name, fortune, onClose }) => {
    return React.createElement('div', {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
        },
        onClick: onClose
    }, React.createElement('div', {
        style: {
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        },
        onClick: (e) => e.stopPropagation()
    }, [
        React.createElement('div', {
            key: 'icon',
            style: {
                fontSize: '48px',
                marginBottom: '20px'
            }
        }, '🔮'),
        
        React.createElement('h2', {
            key: 'title',
            style: {
                fontFamily: 'Baloo 2, cursive',
                fontSize: '24px',
                marginBottom: '10px',
                color: '#333'
            }
        }, `${name}さんの今日の運勢`),
        
        React.createElement('p', {
            key: 'fortune',
            style: {
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#666',
                marginBottom: '30px'
            }
        }, fortune),
        
        React.createElement('button', {
            key: 'close',
            onClick: onClose,
            style: {
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s'
            },
            onMouseEnter: (e) => e.target.style.transform = 'translateY(-2px)',
            onMouseLeave: (e) => e.target.style.transform = 'translateY(0)'
        }, 'ありがとう！')
    ]));
};

// 誕生日メッセージコンポーネント
const BirthdayMessage = ({ name, onClose }) => {
    return React.createElement('div', {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
        },
        onClick: onClose
    }, React.createElement('div', {
        style: {
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            animation: 'pulse 2s infinite'
        },
        onClick: (e) => e.stopPropagation()
    }, [
        React.createElement('div', {
            key: 'icon',
            style: {
                fontSize: '64px',
                marginBottom: '20px'
            }
        }, '🎉'),
        
        React.createElement('h2', {
            key: 'title',
            style: {
                fontFamily: 'Baloo 2, cursive',
                fontSize: '28px',
                marginBottom: '10px',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
            }
        }, 'Happy Birthday!'),
        
        React.createElement('p', {
            key: 'message',
            style: {
                fontSize: '18px',
                lineHeight: '1.6',
                color: 'white',
                marginBottom: '30px',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
            }
        }, `${name}さん、お誕生日おめでとうございます！\n素敵な一年になりますように✨`),
        
        React.createElement('button', {
            key: 'close',
            onClick: onClose,
            style: {
                background: 'white',
                color: '#ff9a9e',
                border: 'none',
                borderRadius: '25px',
                padding: '15px 30px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            },
            onMouseEnter: (e) => e.target.style.transform = 'translateY(-2px)',
            onMouseLeave: (e) => e.target.style.transform = 'translateY(0)'
        }, 'ありがとう！ 🎈')
    ]));
};