import React from "react";
import { createRoot} from 'react-dom/client';
import App from "./App";
import './styles/global.css';

// HTMLファイルの中の'id'が'root'の要素を取得
const container = document.getElementById('root');
if (container) {
    // `createRoot`でルートを作成
    const root = createRoot(container);

    // `root.render`でreactコンポーネントを表示
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}