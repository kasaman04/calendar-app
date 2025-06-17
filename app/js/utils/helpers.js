// ヘルパー関数
const Helpers = {
    // 占い生成
    generateFortune(birthdate, gender) {
        const fortunes = {
            male: [
                "今日は新しいチャレンジに最適な日です。積極的に行動しましょう！",
                "人との出会いがあなたに良い影響をもたらします。",
                "クリエイティブな活動に力を注ぐと良い結果が得られそうです。",
                "健康に気を付けながら、バランスの取れた一日を過ごしましょう。",
                "直感を信じて決断することで、幸運が舞い込みます。"
            ],
            female: [
                "今日はあなたの魅力が輝く日です。自信を持って過ごしましょう！",
                "周りの人への思いやりが、あなたに幸せを運んでくれます。",
                "美しいものに触れることで、心が豊かになる一日です。",
                "家族や友人との時間を大切にすると良いことがありそうです。",
                "新しい趣味や学びにチャレンジすると運気がアップします。"
            ]
        };
        
        const genderFortunes = fortunes[gender] || fortunes.male;
        const randomIndex = Math.floor(Math.random() * genderFortunes.length);
        return genderFortunes[randomIndex];
    },
    
    // 年齢計算
    calculateAge(birthdate) {
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    },
    
    // 生年月日フォーマット
    formatBirthdate(birthdate) {
        const date = new Date(birthdate);
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
};