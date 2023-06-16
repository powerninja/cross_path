import { useState, useEffect, useCallback } from 'react';
import './App.css';

type PathState = {
  winPath?: string;
  macPath?: string;
};

export const App = () => {
  //パスの設定
  const [winPath, setWinPath] = useState('');
  const [macPath, setMacPath] = useState('');

  //変換後のパスを保存
  const [convertWinPath, setConvertWinPath] = useState('');
  const [convertMacPath, setConvertMacPath] = useState('');

  //
  const [checkConvertWinPath, setCheckConvertWinPath] = useState(false);
  const [checkConvertMacPath, setCheckConvertMacPath] = useState(false);

  // windows inputフォーム入力
  const setWinPathInput = (inputPath: string) => {
    setWinPath(inputPath);
    setCheckConvertWinPath(true);
  };

  // mac inputフォーム入力
  const setMacPathInput = (inputPath: string) => {
    setMacPath(inputPath);
    setCheckConvertMacPath(true);
  };

  //変換ボタン押下時に、Pathの変換処理を実行する
  const conversionWinPath = useCallback(() => {
    //windowsのpathを変換
    const macPaths = winPath
      .replace(/\\/g, '/')
      .replace(/192.168.254.6/g, 'Volumes')
      .slice(1);
    setConvertMacPath(macPaths);
  }, [winPath]);

  const conversionMacPath = useCallback(() => {
    // console.log('macパス変換の中');
    //パスの変換前に不要なバックスラッシュを削除する
    const replaceBackSlash = macPath.replace(/\\/g, '');
    //macのpathを変換
    const normalizWinPath = `\\${replaceBackSlash.replace(/\//g, '\\').replace(/Volumes/g, '192.168.254.6')}`;
    //文字コードをUTF8-mac(NFD)からUTF8(NFC)に変換する
    const winPaths = normalizWinPath.normalize('NFC');
    setConvertWinPath(winPaths);
  }, [macPath]);

  // pathが更新された時にconversionPathを呼び出し、パスの変換を行う
  useEffect(() => {
    conversionWinPath();
  }, [winPath, conversionMacPath]);

  // pathが更新された時にconversionPathを呼び出し、パスの変換を行う
  useEffect(() => {
    conversionMacPath();
  }, [macPath, conversionWinPath]);

  // convertWinPath or convertMacPathが更新された時にフラグをクリアする
  useEffect(() => {
    if (convertWinPath) {
      setCheckConvertWinPath(false);
    }
  }, [convertWinPath]);

  useEffect(() => {
    if (convertMacPath) {
      setCheckConvertMacPath(false);
    }
  }, [convertMacPath]);

  //クリアボタン押下時に、テキストエリアと変換された値をクリアする
  const clearPath = () => {
    //パスの初期化
    setWinPath('');
    setMacPath('');
    setConvertWinPath('');
    setConvertMacPath('');
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
            // value={checkConvertWinPath ? winPath : convertWinPath}
            value={checkConvertWinPath ? winPath : convertWinPath}
            onChange={(event) => {
              setWinPathInput(event.target.value);
            }}
            placeholder="変換を行いたいwindowsのパスを入力してください"
          ></textarea>
        </div>

        <div className="form-group my-box w-40">
          <label>mac Path:</label>
          <textarea
            className="textarea"
            // value={convertMacPath || macPath}
            value={checkConvertMacPath ? macPath : convertMacPath}
            onChange={(event) => {
              setMacPathInput(event.target.value);
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
