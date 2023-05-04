import React, { useState, useCallback } from 'react';
import './App.css';
import path from 'path';

type pathType = {
  winPath?: string;
  macPath?: string;
  initialPath?: string;
};
type Linktype = {
  url: string;
};

export const App = () => {
  //パスの設定
  const [Path, setPath] = useState<pathType>({ winPath: '', macPath: '', initialPath: '' });

  //初期入力のパス保存

  //inputフォーム入力
  const setCrossPath = (inputPath: string, osCheck: number) => {
    if (osCheck) {
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
    if (Path.winPath) {
      generationPath = Path.winPath.replace(/\\/g, '/');
      generationPath = generationPath.replace(/192.168.254.6/g, 'Volumes');
    } else if (Path.macPath) {
      generationPath = Path.macPath.replace(/\//g, '\\');
      generationPath = `\\${generationPath.replace(/Volumes/g, '192.168.254.6')}`;
    }
    console.log(generationPath);
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
      <div className="d-flex flex-row">
        <div className="form-group my-box w-25">
          <label>windows Path:</label>
          <textarea
            id="textarea"
            className="form-control"
            value={Path.winPath}
            onChange={(event) => {
              setCrossPath(event.target.value, 0);
            }}
          ></textarea>
        </div>

        <div className="form-group my-box w-25">
          <label>mac Path:</label>
          <textarea
            id="textarea"
            className="form-control"
            value={Path.macPath}
            onChange={(event) => {
              setCrossPath(event.target.value, 1);
            }}
          ></textarea>
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
    </div>
  );
};
