// ユーザーデータ管理
const UserData = {
    // ユーザー設定の保存
    saveUserSettings(data) {
        localStorage.setItem('calendarApp_userSettings', JSON.stringify(data));
    },
    
    // ユーザー設定の取得
    getUserSettings() {
        const saved = localStorage.getItem('calendarApp_userSettings');
        return saved ? JSON.parse(saved) : null;
    },
    
    // 初回設定が完了しているかチェック
    isSetupComplete() {
        const settings = this.getUserSettings();
        return settings && settings.name && settings.birthdate && settings.gender;
    },
    
    // 今日の占いを表示したかチェック
    hasTodayFortuneShown() {
        const today = new Date().toDateString();
        const lastShown = localStorage.getItem('calendarApp_lastFortuneDate');
        return lastShown === today;
    },
    
    // 今日の占いを表示済みにマーク
    markTodayFortuneShown() {
        const today = new Date().toDateString();
        localStorage.setItem('calendarApp_lastFortuneDate', today);
    },
    
    // 誕生日かどうかチェック
    isBirthday() {
        const settings = this.getUserSettings();
        if (!settings || !settings.birthdate) return false;
        
        const today = new Date();
        const birthdate = new Date(settings.birthdate);
        
        return today.getMonth() === birthdate.getMonth() && 
               today.getDate() === birthdate.getDate();
    }
};