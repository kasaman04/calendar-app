// ユーザー設定画面コンポーネント
const UserSettings = ({ onComplete }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        birthdate: '',
        gender: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.birthdate || !formData.gender) {
            alert('すべての項目を入力してください。');
            return;
        }

        // ユーザーデータを保存
        UserData.saveUserSettings({
            name: formData.name.trim(),
            birthdate: formData.birthdate,
            gender: formData.gender,
            setupDate: new Date().toISOString()
        });

        // 完了コールバック
        onComplete();
    };

    return React.createElement('div', { className: 'settings-screen' },
        React.createElement('div', { className: 'settings-form' },
            React.createElement('h1', { 
                style: { 
                    textAlign: 'center', 
                    marginBottom: '30px', 
                    color: '#333',
                    fontFamily: 'Baloo 2, cursive',
                    fontSize: '28px'
                } 
            }, 'はじめまして！'),
            
            React.createElement('p', { 
                style: { 
                    textAlign: 'center', 
                    marginBottom: '30px', 
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.6'
                } 
            }, 'あなたの情報を教えてください。\n毎日の占いと誕生日のお祝いをお届けします！'),

            React.createElement('form', { onSubmit: handleSubmit },
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label', htmlFor: 'name' }, 'お名前'),
                    React.createElement('input', {
                        type: 'text',
                        id: 'name',
                        name: 'name',
                        value: formData.name,
                        onChange: handleChange,
                        className: 'form-input',
                        placeholder: 'あなたのお名前を入力してください'
                    })
                ),

                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label', htmlFor: 'birthdate' }, '生年月日'),
                    React.createElement('input', {
                        type: 'date',
                        id: 'birthdate',
                        name: 'birthdate',
                        value: formData.birthdate,
                        onChange: handleChange,
                        className: 'form-input'
                    })
                ),

                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { className: 'form-label', htmlFor: 'gender' }, '性別'),
                    React.createElement('select', {
                        id: 'gender',
                        name: 'gender',
                        value: formData.gender,
                        onChange: handleChange,
                        className: 'form-select'
                    },
                        React.createElement('option', { value: '' }, '選択してください'),
                        React.createElement('option', { value: 'male' }, '男性'),
                        React.createElement('option', { value: 'female' }, '女性')
                    )
                ),

                React.createElement('button', {
                    type: 'submit',
                    className: 'submit-button'
                }, '設定完了')
            )
        )
    );
};