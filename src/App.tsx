import React, { useState, useCallback } from 'react';
import './App.css';

type pathType = {
  winPath?: string;
  macPath?: string;
  initialPath?: string;
};

export const App = () => {
  //パスの設定
  const [path, setPath] = useState<pathType>({ winPath: '', macPath: '', initialPath: '' });

  //初期入力のパス保存

  //inputフォーム入力
  const setCrossPath = (inputPath: string, isMac: boolean) => {
    if (isMac) {
      //macのpath変換用処理を記載する
      setPath({ macPath: inputPath });
    } else {
      //windowsのpath変換用処理を記載する
      setPath({ winPath: inputPath });
    }
  };

  //Pathの変換処理
  const conversionPath = () => {
    let generationPath: string = '';
    if (path.winPath) {
      generationPath = path.winPath.replace(/\\/g, '/');
      generationPath = generationPath.replace(/192.168.254.6/g, 'Volumes');
    } else if (path.macPath) {
      generationPath = path.macPath.replace(/\//g, '\\');
      generationPath = `\\${generationPath.replace(/Volumes/g, '192.168.254.6')}`;
    }
    setPath({ initialPath: generationPath });
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
      <h1>パス変換</h1>
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
            id="textarea"
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
            id="textarea"
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
      </div>
    </div>
  );
};
