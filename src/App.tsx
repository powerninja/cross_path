import { useState, useEffect, useCallback } from 'react';
import './App.css';

type PathState = {
  winPath?: string;
  macPath?: string;
};

export const App = () => {
  //パスの初期値を設定
  const initialPathState = { winPath: '', macPath: '' };
  //パスの設定
  const [path, setPath] = useState<PathState>({ winPath: '', macPath: '' });
  //変換後のパスを保存
  const [convertPath, setConvertPath] = useState<PathState>({ winPath: '', macPath: '' });

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
  const conversionPath = useCallback(() => {
    if (path.winPath) {
      //windowsのpathを変換
      const macPath = path.winPath
        .replace(/\\/g, '/')
        .replace(/192.168.254.6/g, 'Volumes')
        .slice(1);
      setConvertPath((prevState) => ({ ...prevState, macPath }));
    } else if (path.macPath) {
      //パスの変換前に不要なバックスラッシュを削除する
      const replaceBackSlash = path.macPath.replace(/\\/g, '');
      //macのpathを変換
      const normalizWinPath = `\\${replaceBackSlash.replace(/\//g, '\\').replace(/Volumes/g, '192.168.254.6')}`;
      //文字コードをUTF8-mac(NFD)からUTF8(NFC)に変換する
      const winPath = normalizWinPath.normalize('NFC');
      setConvertPath((prevState) => ({ ...prevState, winPath }));
    } else {
      alert('パスを入力してください');
    }
  }, [path]);

  // pathが更新された時にconsole.logで値を表示
  useEffect(() => {
    if (path.macPath || path.winPath) {
      conversionPath();
    }
  }, [path, conversionPath]);

  //クリアボタン押下時に、テキストエリアと変換された値をクリアする
  const clearPath = () => {
    //パスの初期化
    setPath(initialPathState);
    setConvertPath(initialPathState);
  };

  return (
    <div
      style={{
        height: 'auto',
        margin: '0 auto',
        maxWidth: 1000,
        width: '100%',
      }}
    >
      <h1>ファイルパス変換</h1>
      <div className="d-flex flex-row justify-content-around">
        <div className="form-group my-box w-40">
          <label>windows Path:</label>
          <textarea
            className="textarea"
            value={convertPath.winPath ? convertPath.winPath : path.winPath}
            onChange={(event) => {
              setCrossPath(event.target.value, false);
            }}
            placeholder="変換を行いたいwindowsのパスを入力してください"
          ></textarea>
        </div>

        <div className="form-group my-box w-40">
          <label>mac Path:</label>
          <textarea
            className="textarea"
            value={convertPath.macPath ? convertPath.macPath : path.macPath}
            onChange={(event) => {
              setCrossPath(event.target.value, true);
            }}
            placeholder="変換を行いたいmacのパスを入力してください"
          ></textarea>
        </div>
      </div>
      <div className="button-container">
        <button className="btn btn-danger ms-3" onClick={() => clearPath()}>
          クリア
        </button>
      </div>
    </div>
  );
};
