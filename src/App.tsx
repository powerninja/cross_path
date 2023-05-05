import { useState } from 'react';
import './App.css';

type PathState = {
  winPath?: string;
  macPath?: string;
  initialPath?: string;
};

export const App = () => {
  //パスの初期値を設定
  const initialPathState = { winPath: '', macPath: '', initialPath: '' };
  //パスの設定
  const [path, setPath] = useState<PathState>(initialPathState);

  //inputフォーム入力
  const setCrossPath = (inputPath: string, isMac: boolean) => {
    if (isMac) {
      //macのpath変換用処理を記載する
      setPath((prevState) => ({ ...prevState, macPath: inputPath }));
    } else {
      //windowsのpath変換用処理を記載する
      setPath((prevState) => ({ ...prevState, winPath: inputPath }));
    }
  };

  //変換ボタン押下時に、Pathの変換処理を実行する
  const conversionPath = () => {
    if (path.winPath) {
      //windowsのpathを変換
      const macPath = path.winPath
        .replace(/\\/g, '/')
        .replace(/192.168.254.6/g, 'Volumes')
        .slice(1);
      setPath((prevState) => ({ ...prevState, macPath }));
    } else if (path.macPath) {
      //macのpathを変換
      const winPath = `\\${path.macPath.replace(/\//g, '\\').replace(/Volumes/g, '192.168.254.6')}`;
      setPath((prevState) => ({ ...prevState, winPath }));
    } else {
      alert('パスを入力してください');
    }
  };

  //クリアボタン押下時に、テキストエリアと変換された値をクリアする
  const clearPath = () => {
    //パスの初期化
    setPath(initialPathState);
  };

  return (
    <div
      style={{
        height: 'auto',
        margin: '0 auto',
        maxWidth: 800,
        width: '100%',
      }}
    >
      <h1>ファイルパス変換</h1>
      <div className="d-flex flex-row justify-content-around">
        <div
          className="form-group my-box w-40"
          style={{
            height: '50%',
            margin: '0 auto',
            maxWidth: 300,
            width: '100%',
          }}
        >
          <label>windows Path:</label>
          <textarea
            className="form-control textarea"
            value={path.winPath ? path.winPath : path.initialPath}
            onChange={(event) => {
              setCrossPath(event.target.value, false);
            }}
          ></textarea>
        </div>

        <div
          className="form-group my-box w-40"
          style={{
            height: '50%',
            margin: '0 auto',
            maxWidth: 300,
            width: '100%',
          }}
        >
          <label>mac Path:</label>
          <textarea
            className="form-control textarea"
            value={path.macPath ? path.macPath : path.initialPath}
            onChange={(event) => {
              setCrossPath(event.target.value, true);
            }}
          ></textarea>
        </div>
      </div>
      <div className="button-container">
        <button
          className="btn btn-primary ms-3"
          onClick={() => conversionPath()}
          style={{
            height: 'auto',
            maxWidth: 200,
          }}
        >
          変換
        </button>
        <button
          className="btn btn-danger ms-3"
          onClick={() => clearPath()}
          style={{
            height: 'auto',
            maxWidth: 200,
          }}
        >
          クリア
        </button>
      </div>
    </div>
  );
};
