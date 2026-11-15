# Novacell

## Backend (Django)
```
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed              # dados e taxas de EXEMPLO
python manage.py createsuperuser   # sua conta de administrador
python manage.py runserver 0.0.0.0:8000
```
Em http://localhost:8000/admin você altera o WhatsApp, telefone, endereço e horário da loja (modelo "Dados da loja").

## App (React Native + Expo)
```
npx create-expo-app@latest novacell-app --template blank
cd novacell-app
npx expo install react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack @react-native-async-storage/async-storage expo-linear-gradient @expo/vector-icons react-dom react-native-web @expo/metro-runtime
```
Copie `App.js` e a pasta `src/` desta pasta `app/` por cima do projeto criado, edite `BASE` em `src/api.js`
(no celular use o IP do computador, ex.: http://192.168.0.10:8000/api) e rode `npx expo start` (tecle `w` para abrir no navegador).
