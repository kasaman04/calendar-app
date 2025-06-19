/**
 * CalendarCard.js - Main Calendar Component
 * Extracted from legacy HTML file and converted to modular React component
 * 
 * Features:
 * - Calendar navigation with month/year display
 * - Photo upload and display functionality
 * - Day clicking and time slot management
 * - Activity selection and color coding
 * - Fireworks effect on day 12
 * - Swipe-to-delete functionality for scheduled days
 * - Photo area hide functionality
 * - Schedule timeline display
 */

// Import React hooks
const { useState, useEffect } = React;

// Constants
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS_SHORT = ['日', '月', '火', '水', '木', '金', '土'];

// Utility Functions
const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
        days.push({
            date: current.getDate(),
            isCurrentMonth: current.getMonth() === month,
            fullDate: current.toISOString().split('T')[0]
        });
        current.setDate(current.getDate() + 1);
    }
    
    return days;
};

const getMonthImage = (month) => {
    const images = [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=180&fit=crop', // January - Winter flowers
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=180&fit=crop', // February - Pink flowers
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=180&fit=crop', // March - Spring blooms
        'https://images.unsplash.com/photo-1563789031959-4c53abc684c3?w=400&h=180&fit=crop', // April - Cherry blossoms
        'https://images.unsplash.com/photo-1592062644994-6fc4faf8e8c2?w=400&h=180&fit=crop', // May - Roses
        'https://images.unsplash.com/photo-1597848212624-e6421bb98fb6?w=400&h=180&fit=crop', // June - Summer flowers
        'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=180&fit=crop', // July - Sunflowers
        'https://images.unsplash.com/photo-1566146991569-696da38bb775?w=400&h=180&fit=crop', // August - Lavender
        'https://images.unsplash.com/photo-1601985705806-5b2e9b3b71b4?w=400&h=180&fit=crop', // September - Autumn flowers
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=180&fit=crop', // October - Fall blooms
        'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=180&fit=crop', // November - Dried flowers
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=180&fit=crop'  // December - Winter arrangements
    ];
    return images[month] || images[0];
};

// Fireworks trigger function
const triggerFireworks = () => {
    // Call drawFireworks function from external fireworks.js file
    if (typeof drawFireworks === 'function') {
        drawFireworks();
    } else {
        console.error('drawFireworks function not found. Make sure fireworks.js is loaded.');
    }
};

// TimeLabel Component
const TimeLabel = ({ index, text }) => (
    React.createElement('span', {
        className: 'absolute text-sm font-medium text-gray-800',
        style: { 
            left: `${(index / 6) * 100}%`, 
            transform: 'translateX(-50%)',
            top: '100%',
            marginTop: '4px'
        }
    }, text)
);

// TimeBar24 Component
const TimeBar24 = ({ selectedDate, timeSlots, onSlotClick }) => {
    const getSlotColor = (slotIndex) => {
        const dateKey = selectedDate?.fullDate;
        const activity = timeSlots[`${dateKey}-${slotIndex}`];
        const colors = {
            work: '#ff9a9e',    // 可愛いピンク
            rest: '#a8e6cf',    // 優しいミントグリーン
            outing: '#ffd3a5',  // 温かいピーチ
            study: '#c7ceea'    // 柔らかいラベンダー
        };
        return activity ? colors[activity] : 'transparent';
    };

    return React.createElement('div', { 
        className: 'relative w-full',
        style: { marginBottom: '8px' }
    }, [
        // メインのタイムバー
        React.createElement('div', {
            key: 'bar',
            className: 'grid grid-cols-6 gap-0',
            style: {
                height: '12px',
                borderRadius: '9999px',
                border: '1px solid #343A40',
                backgroundColor: 'transparent'
            }
        }, Array.from({ length: 6 }, (_, index) => 
            React.createElement('div', {
                key: index,
                onClick: () => onSlotClick(index),
                style: {
                    height: '100%',
                    backgroundColor: getSlotColor(index),
                    borderRight: index < 5 ? '1px solid #343A40' : 'none',
                    borderTopLeftRadius: index === 0 ? '9999px' : '0',
                    borderBottomLeftRadius: index === 0 ? '9999px' : '0',
                    borderTopRightRadius: index === 5 ? '9999px' : '0',
                    borderBottomRightRadius: index === 5 ? '9999px' : '0',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                }
            })
        )),
        // タイムラベル
        ...['4', '8', '12', '16', '20'].map((time, index) => 
            React.createElement(TimeLabel, {
                key: time,
                index: index + 1,
                text: time
            })
        )
    ]);
};

// ActivityMenu Component
const ActivityMenu = ({ show, onActivitySelect }) => {
    if (!show) return null;

    const activities = [
        { key: 'work', label: '仕事', color: '#ff9a9e' },
        { key: 'rest', label: '休み', color: '#a8e6cf' },
        { key: 'outing', label: '外出', color: '#ffd3a5' },
        { key: 'study', label: '勉強', color: '#c7ceea' }
    ];

    return React.createElement('div', {
        style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            border: '1px solid #e5e7eb',
            zIndex: 1001,
            minWidth: '200px'
        }
    }, [
        React.createElement('div', {
            key: 'title',
            style: {
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px',
                textAlign: 'center',
                color: '#333'
            }
        }, '活動を選択'),
        ...activities.map(activity => 
            React.createElement('button', {
                key: activity.key,
                onClick: () => onActivitySelect(activity.key),
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    marginBottom: '4px'
                },
                onMouseEnter: (e) => e.target.style.backgroundColor = '#f3f4f6',
                onMouseLeave: (e) => e.target.style.backgroundColor = 'transparent'
            }, [
                React.createElement('div', {
                    key: 'color',
                    style: {
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        backgroundColor: activity.color
                    }
                }),
                React.createElement('span', {
                    key: 'label',
                    style: {
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#333'
                    }
                }, activity.label)
            ])
        )
    ]);
};

// Main Calendar Component
const Calendar = ({ year, month, monthName, onPrevMonth, onNextMonth, monthData, isUploading, onPhotoClick }) => {
    const days = generateCalendarDays(year, month);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showTimeBar, setShowTimeBar] = useState(false);
    const [timeSlots, setTimeSlots] = useState({});
    const [showActivityMenu, setShowActivityMenu] = useState(false);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
    const [showScheduleList, setShowScheduleList] = useState(false);
    const [showPhotoArea, setShowPhotoArea] = useState(true);
    const [showHideConfirm, setShowHideConfirm] = useState(false);
    
    // 日付クリック時の処理
    const handleDayClick = (day) => {
        if (day.date === 12 && day.isCurrentMonth) {
            triggerFireworks();
        } else if (day.isCurrentMonth) {
            setSelectedDate(day);
            setShowTimeBar(true);
        }
    };

    // タイムバーを閉じる
    const closeTimeBar = () => {
        setShowTimeBar(false);
        setSelectedDate(null);
        setShowActivityMenu(false);
        setSelectedSlotIndex(null);
    };

    // タイムスロットクリック時の処理
    const handleSlotClick = (slotIndex) => {
        const dateKey = selectedDate?.fullDate;
        const currentActivity = timeSlots[`${dateKey}-${slotIndex}`];
        
        if (currentActivity) {
            // 既に予定が入っている場合はリセット
            setTimeSlots(prev => {
                const newSlots = { ...prev };
                delete newSlots[`${dateKey}-${slotIndex}`];
                return newSlots;
            });
        } else {
            // 予定が入っていない場合は選択メニューを表示
            setSelectedSlotIndex(slotIndex);
            setShowActivityMenu(true);
        }
    };

    // 活動選択時の処理
    const handleActivitySelect = (activity) => {
        const dateKey = selectedDate?.fullDate;
        if (dateKey && selectedSlotIndex !== null) {
            setTimeSlots(prev => ({
                ...prev,
                [`${dateKey}-${selectedSlotIndex}`]: activity
            }));
        }
        setShowActivityMenu(false);
        setSelectedSlotIndex(null);
    };

    // 予定が入っている日のデータを取得（現在表示中の月のみ）
    const getScheduledDays = () => {
        const daysWithSchedules = {};
        const currentYearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
        
        // timeSlots から現在の月の予定のみを抽出
        Object.keys(timeSlots).forEach(key => {
            const [keyYear, keyMonth, day, slotIndex] = key.split('-');
            const keyYearMonth = `${keyYear}-${keyMonth}`;
            
            // 現在表示中の年月と一致する場合のみ処理
            if (keyYearMonth === currentYearMonth) {
                const date = `${keyYear}-${keyMonth}-${day}`;
                if (!daysWithSchedules[date]) {
                    daysWithSchedules[date] = Array(6).fill(null);
                }
                daysWithSchedules[date][parseInt(slotIndex)] = timeSlots[key];
            }
        });

        // 日付順にソート（日付文字列で比較）
        const result = Object.entries(daysWithSchedules)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, slots]) => ({ date, slots }));
        
        return result;
    };

    // 今日の日付を取得
    const today = new Date();
    const todayDateStr = today.toISOString().split('T')[0];

    // スワイプ音効果の再生
    const playSwipeSound = () => {
        try {
            const audio = new Audio('assets/sounds/Motion-Agility12-1(High).mp3');
            audio.volume = 0.3; // 音量調整
            audio.play().catch(error => {
                console.log('音効果の再生に失敗しました:', error);
            });
        } catch (error) {
            console.log('音効果の再生に失敗しました:', error);
        }
    };

    // タッチイベントとマウスイベントを使用してスワイプ判定を実装
    const handleTouchStart = (e, dayData) => {
        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        const element = e.currentTarget;
        let isSwipeActive = false;

        // トランジションを無効にして滑らかな追従を実現
        element.style.transition = 'none';

        const handleTouchMove = (e) => {
            const touch = e.touches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const distanceX = endX - startX;
            const distanceY = endY - startY;

            // 水平方向のスワイプかどうかを判定
            if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 10) {
                isSwipeActive = true;
                e.preventDefault(); // スクロールを防止
                
                // バーを指に付いてくるように移動（最大100pxまで）
                const moveDistance = Math.min(distanceX, 100);
                element.style.transform = `translateX(${moveDistance}px)`;
                
                // 50px以上で削除準備（背景色を赤くする）
                if (distanceX > 50) {
                    element.style.background = 'rgba(239, 68, 68, 0.6)';
                } else {
                    element.style.background = 'rgba(255, 255, 255, 0.25)';
                }
            }
        };

        const handleTouchEnd = (e) => {
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const distanceX = endX - startX;

            if (isSwipeActive && distanceX > 50) {
                // 削除実行
                handleSwipeDelete(dayData, element);
            } else {
                // 元の位置に戻す
                element.style.transition = 'transform 0.3s ease-out, background 0.3s ease-out';
                element.style.transform = 'translateX(0)';
                element.style.background = 'rgba(255, 255, 255, 0.15)';
            }

            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
    };

    const handleMouseDown = (e, dayData) => {
        const startX = e.clientX;
        const startY = e.clientY;
        const element = e.currentTarget;
        let isSwipeActive = false;

        // トランジションを無効にして滑らかな追従を実現
        element.style.transition = 'none';

        const handleMouseMove = (e) => {
            const endX = e.clientX;
            const endY = e.clientY;
            const distanceX = endX - startX;
            const distanceY = endY - startY;

            // 水平方向のスワイプかどうかを判定
            if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 10) {
                isSwipeActive = true;
                
                // バーを指に付いてくるように移動（最大100pxまで）
                const moveDistance = Math.min(distanceX, 100);
                element.style.transform = `translateX(${moveDistance}px)`;
                
                // 50px以上で削除準備（背景色を赤くする）
                if (distanceX > 50) {
                    element.style.background = 'rgba(239, 68, 68, 0.6)';
                } else {
                    element.style.background = 'rgba(255, 255, 255, 0.25)';
                }
            }
        };

        const handleMouseUp = (e) => {
            const endX = e.clientX;
            const distanceX = endX - startX;

            if (isSwipeActive && distanceX > 50) {
                // 削除実行
                handleSwipeDelete(dayData, element);
            } else {
                // 元の位置に戻す
                element.style.transition = 'transform 0.3s ease-out, background 0.3s ease-out';
                element.style.transform = 'translateX(0)';
                element.style.background = 'rgba(255, 255, 255, 0.15)';
            }

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // スワイプ削除のための関数
    const handleSwipeDelete = (dayData, element) => {
        // スワイプ音効果を再生
        playSwipeSound();
        
        // 削除アニメーション：右にスライドしながらフェードアウト
        element.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        element.style.transform = 'translateX(100%)';
        element.style.opacity = '0';
        
        console.log('右スワイプ削除を実行します:', dayData.date);
        
        // アニメーション完了後に削除処理
        setTimeout(() => {
            // この日の予定をすべて削除
            setTimeSlots(prev => {
                const newSlots = { ...prev };
                Object.keys(newSlots).forEach(key => {
                    if (key.includes(dayData.date)) {
                        delete newSlots[key];
                    }
                });
                console.log('更新されたスロット:', newSlots);
                return newSlots;
            });
        }, 300);
    };

    // 写真エリア非表示確認処理
    const handleHidePhotoArea = () => {
        setShowHideConfirm(true);
    };

    const confirmHidePhotoArea = () => {
        setShowPhotoArea(false);
        setShowHideConfirm(false);
    };

    const cancelHidePhotoArea = () => {
        setShowHideConfirm(false);
    };

    return (
        <div className="w-full flex flex-col text-white font-comfortaa" style={{ backgroundColor: '#3182CE', maxWidth: '400px', margin: '0 auto', minHeight: '100vh' }}>
            {/* Photo area - single layout only */}
            {showPhotoArea && (
                <div className="relative w-full flex items-end justify-center" style={{ height: '248px', paddingBottom: '0px' }}>
                <div 
                    style={{
                        width: '280px',
                        height: '200px',
                        backgroundImage: monthData.images && monthData.images[0] ? `url(${monthData.images[0].dataUrl})` : `url(${getMonthImage(month)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        position: 'relative'
                    }}
                    onClick={() => onPhotoClick(0)}
                >
                    {(!monthData.images || !monthData.images[0]) && !isUploading && (
                        <>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.3)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '32px',
                                borderRadius: '16px'
                            }}>
                                📷
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleHidePhotoArea();
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    border: 'none',
                                    color: '#333',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ×
                            </button>
                        </>
                    )}
                </div>
                
                {/* アップロード中のオーバーレイ */}
                {isUploading && (
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                    }}>
                        処理中...
                    </div>
                )}
                </div>
            )}

            {/* Month title with navigation - larger size */}
            <div className="relative text-center mb-3 px-4" style={{ height: '15vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button 
                    onClick={onPrevMonth}
                    className="nav-arrow prev-arrow"
                    style={{ fontSize: '28px' }}
                >
                    ‹
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '0 30px' }}>
                    <div style={{ 
                        fontSize: '4rem', 
                        fontWeight: '900', 
                        color: 'white',
                        fontFamily: 'Baloo 2, cursive',
                        lineHeight: '1'
                    }}>
                        {month + 1}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: '700', 
                            color: 'white',
                            fontFamily: 'Baloo 2, cursive',
                            letterSpacing: '2px',
                            lineHeight: '1.2'
                        }}>
                            {monthName.toUpperCase()}
                        </div>
                        <div style={{ 
                            fontSize: '1rem', 
                            fontWeight: '500', 
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontFamily: 'Baloo 2, cursive',
                            letterSpacing: '1px'
                        }}>
                            {year}
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={onNextMonth}
                    className="nav-arrow next-arrow"
                    style={{ fontSize: '28px' }}
                >
                    ›
                </button>
            </div>

            {/* Calendar grid - 40% of screen */}
            <div className="pb-6 flex flex-col items-center" style={{ marginTop: '-8px', flex: '0 0 auto' }}>
                {/* Weekday headers - larger size */}
                <div className="grid grid-cols-7 gap-0 mb-4 w-full" style={{maxWidth: '280px', margin: '0 auto'}}>
                    {WEEKDAYS_SHORT.map((day, index) => (
                        <div key={index} className="text-center text-sm font-normal text-white opacity-60 py-2 font-varela"
                             style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                            {day}
                        </div>
                    ))}
                </div>
                
                {/* Calendar days - larger size */}
                <div className="grid grid-cols-7 gap-0 w-full" style={{maxWidth: '280px', margin: '0 auto'}}>
                    {days.slice(0, 35).map((day, index) => (
                        <div 
                            key={index}
                            className={`flex items-center justify-center rounded-full text-md ${day.isCurrentMonth ? 'text-white' : 'text-white opacity-30'} ${day.fullDate === todayDateStr ? 'bg-white bg-opacity-25' : ''} ${day.date === 12 && day.isCurrentMonth ? 'day-12' : ''}`}
                            style={{
                                width: '40px',
                                height: '40px',
                                cursor: day.isCurrentMonth ? 'pointer' : 'default',
                                animation: day.fullDate === todayDateStr ? 'pulse 2s infinite' : 'none'
                            }}
                            onClick={() => handleDayClick(day)}
                        >
                            {day.date}
                        </div>
                    ))}
                </div>
            </div>

            {/* 予定タイムライン表示 - 常に表示 */}
            <div style={{ 
                padding: '16px',
                marginTop: '8px',
                marginBottom: '100px',
                minHeight: '60px',
                background: 'rgba(0, 0, 0, 0.1)',
                flex: '0 0 auto'
            }}>
                <div
                    onClick={() => {
                        const currentMonthSchedules = getScheduledDays();
                        console.log('予定一覧クリック', currentMonthSchedules);
                        setShowScheduleList(!showScheduleList);
                    }}
                    style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: showScheduleList ? '12px' : '0',
                        textAlign: 'center',
                        cursor: 'pointer',
                        padding: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        transition: 'background-color 0.2s ease'
                    }}
                >
                    予定一覧 ({getScheduledDays().length}件) {showScheduleList ? '▼' : '▶'}
                </div>
                
                {showScheduleList && Object.keys(timeSlots).length > 0 && (
                    <div style={{
                        paddingRight: '4px'
                    }}>
                        {getScheduledDays().map((dayData, index) => {
                            const date = new Date(dayData.date);
                            const monthDay = `${date.getMonth() + 1}月${date.getDate()}日`;
                            
                            return (
                                <div
                                    key={dayData.date}
                                    style={{
                                        marginBottom: '12px',
                                        padding: '10px',
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        userSelect: 'none'
                                    }}
                                    onTouchStart={(e) => handleTouchStart(e, dayData)}
                                    onMouseDown={(e) => handleMouseDown(e, dayData)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                    onClick={(e) => {
                                        const date = new Date(dayData.date);
                                        const dateObj = {
                                            date: date.getDate(),
                                            fullDate: dayData.date,
                                            isCurrentMonth: true
                                        };
                                        setSelectedDate(dateObj);
                                        setShowTimeBar(true);
                                    }}
                                >
                                    <div style={{
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        marginBottom: '6px',
                                        textAlign: 'center'
                                    }}>
                                        {monthDay}
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(6, 1fr)',
                                        gap: '1px',
                                        height: '12px',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(255, 255, 255, 0.4)',
                                        overflow: 'hidden',
                                        background: 'rgba(255, 255, 255, 0.1)'
                                    }}>
                                        {dayData.slots.map((activity, slotIndex) => {
                                            const colors = {
                                                work: '#ff9a9e',
                                                rest: '#a8e6cf',
                                                outing: '#ffd3a5',
                                                study: '#c7ceea'
                                            };
                                            return (
                                                <div
                                                    key={slotIndex}
                                                    style={{
                                                        height: '100%',
                                                        backgroundColor: activity ? colors[activity] : 'transparent'
                                                    }}
                                                    title={`${slotIndex * 4}:00-${(slotIndex + 1) * 4}:00 ${
                                                        activity 
                                                            ? activity === 'work' ? '仕事' 
                                                              : activity === 'rest' ? '休み'
                                                              : activity === 'outing' ? '外出'
                                                              : '勉強'
                                                            : '空き'
                                                    }`}
                                                />
                                            );
                                        })}
                                    </div>
                                    
                                    {/* 時間ラベル */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(6, 1fr)',
                                        gap: '1px',
                                        marginTop: '4px',
                                        fontSize: '8px',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        textAlign: 'center'
                                    }}>
                                        {[0, 4, 8, 12, 16, 20].map((hour, idx) => (
                                            <div key={idx}>{hour}</div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 4時間分割バー */}
            <div className={`time-bar-overlay ${showTimeBar ? 'active' : ''}`} onClick={closeTimeBar}>
                <div className="time-bar-container" onClick={(e) => e.stopPropagation()}>
                    <button className="close-btn" onClick={closeTimeBar}>×</button>
                    
                    <div className="date-title">
                        {selectedDate ? `${selectedDate.date}日の予定` : ''}
                    </div>
                    <div className="date-subtitle">
                        時間帯を選択してください
                    </div>

                    {/* 極細タイムバー */}
                    <div style={{ marginBottom: '20px', position: 'relative' }}>
                        <TimeBar24 
                            selectedDate={selectedDate}
                            timeSlots={timeSlots}
                            onSlotClick={handleSlotClick}
                        />
                        <ActivityMenu 
                            show={showActivityMenu}
                            onActivitySelect={handleActivitySelect}
                        />
                    </div>
                </div>
            </div>

            {/* 写真エリア非表示確認ポップアップ */}
            {showHideConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '30px',
                        maxWidth: '320px',
                        width: '90%',
                        textAlign: 'center'
                    }}>
                        <h3 style={{
                            margin: '0 0 20px 0',
                            color: '#333',
                            fontSize: '18px',
                            fontWeight: '600',
                            fontFamily: 'Comfortaa, sans-serif'
                        }}>写真を設定しない</h3>
                        
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button
                                onClick={confirmHidePhotoArea}
                                style={{
                                    flex: 1,
                                    padding: '12px 20px',
                                    background: '#ccc',
                                    border: 'none',
                                    borderRadius: '25px',
                                    color: '#333',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontFamily: 'Comfortaa, sans-serif',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                yes
                            </button>
                            
                            <button
                                onClick={cancelHidePhotoArea}
                                style={{
                                    flex: 1,
                                    padding: '12px 20px',
                                    background: '#ccc',
                                    border: 'none',
                                    borderRadius: '25px',
                                    color: '#333',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontFamily: 'Comfortaa, sans-serif',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                no
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Month Image Management Hook
const useMonthImages = () => {
    const [images, setImages] = useState({});

    useEffect(() => {
        const savedImages = localStorage.getItem('monthImages');
        if (savedImages) {
            setImages(JSON.parse(savedImages));
        }
    }, []);

    const addImage = (year, month, imageData, position = 0) => {
        const key = `${year}-${month}`;
        const newImages = { ...images };
        if (!newImages[key]) {
            newImages[key] = {};
        }
        newImages[key][position] = {
            id: Date.now() + Math.random(),
            dataUrl: imageData,
            uploadDate: new Date().toISOString()
        };
        setImages(newImages);
        localStorage.setItem('monthImages', JSON.stringify(newImages));
    };

    const getImages = (year, month) => {
        const key = `${year}-${month}`;
        return images[key] || {};
    };

    return { addImage, getImages };
};

// Main Calendar App Component
const CalendarApp = () => {
    const currentDate = new Date();
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [currentMonthIndex, setCurrentMonthIndex] = useState(currentDate.getMonth());
    const [isUploading, setIsUploading] = useState(false);
    const [currentUploadPosition, setCurrentUploadPosition] = useState(0);
    const { addImage, getImages } = useMonthImages();

    // 画像選択処理
    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);

        try {
            const file = files[0]; // 1枚ずつアップロード
            if (!file.type.startsWith('image/')) return;

            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            addImage(currentYear, currentMonthIndex, dataUrl, currentUploadPosition);
        } catch (error) {
            console.error('画像の処理中にエラーが発生しました:', error);
            alert('画像の処理中にエラーが発生しました');
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    // 画像エリアクリック処理
    const handlePhotoClick = (position = 0) => {
        if (!isUploading) {
            setCurrentUploadPosition(position);
            document.getElementById('photo-input').click();
        }
    };

    // 現在の月のデータを取得
    const getCurrentMonthData = () => {
        const images = getImages(currentYear, currentMonthIndex);
        return { images };
    };

    const handlePrevMonth = () => {
        if (currentMonthIndex === 0) {
            setCurrentMonthIndex(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonthIndex(currentMonthIndex - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonthIndex === 11) {
            setCurrentMonthIndex(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonthIndex(currentMonthIndex + 1);
        }
    };

    return React.createElement('div', null, [
        React.createElement('input', {
            key: 'photo-input',
            id: 'photo-input',
            type: 'file',
            accept: 'image/*',
            capture: 'environment',
            onChange: handleFileSelect,
            style: { display: 'none' },
            disabled: isUploading
        }),
        
        React.createElement(Calendar, {
            key: 'calendar',
            year: currentYear,
            month: currentMonthIndex,
            monthName: MONTHS[currentMonthIndex],
            onPrevMonth: handlePrevMonth,
            onNextMonth: handleNextMonth,
            monthData: getCurrentMonthData(),
            isUploading: isUploading,
            onPhotoClick: handlePhotoClick
        })
    ]);
};

// Export for use in other modules
window.CalendarApp = CalendarApp;
window.Calendar = Calendar;