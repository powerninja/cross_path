import { useState, useEffect, useCallback } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const App = () => {
  //パスの設定
  const [winPath, setWinPath] = useState<string>('');
  const [macPath, setMacPath] = useState<string>('');

  //変換後のパスを保存
  const [convertWinPath, setConvertWinPath] = useState<string>('');
  const [convertMacPath, setConvertMacPath] = useState<string>('');

  //text ariaに値が入力された際はtrueとするフラグ
  const [checkConvertWinPath, setCheckConvertWinPath] = useState<boolean>(false);
  const [checkConvertMacPath, setCheckConvertMacPath] = useState<boolean>(false);

  // windows inputフォーム入力
  const setWinPathInput = (inputPath: string) => {
    setWinPath(inputPath);
    setCheckConvertWinPath(true);

    // text ariaが空の場合はmacのパスも空とする
    if (!inputPath) {
      setMacPath('');
    }
  };

  // mac inputフォーム入力
  const setMacPathInput = (inputPath: string) => {
    setMacPath(inputPath);
    setCheckConvertMacPath(true);

    // text ariaが空の場合はwindowsのパスも空とする
    if (!inputPath) {
      setWinPath('');
    }
  };

  //変換ボタン押下時に、Pathの変換処理を実行する
  const conversionWinPath = useCallback(() => {
    //windowsのpathを変換
    if (winPath) {
      const macPaths = winPath
        .replace(/\\/g, '/')
        .replace(/192.168.254.6/g, 'Volumes')
        .slice(1);
      setConvertMacPath(macPaths);
    } else {
      setConvertMacPath('');
    }
  }, [winPath]);

  const conversionMacPath = useCallback(() => {
    //windowsのpathを変換
    if (macPath) {
      //パスの変換前に不要なバックスラッシュを削除する
      const replaceBackSlash = macPath.replace(/\\/g, '');
      //macのpathを変換
      const normalizWinPath = `\\${replaceBackSlash.replace(/\//g, '\\').replace(/Volumes/g, '192.168.254.6')}`;
      //文字コードをUTF8-mac(NFD)からUTF8(NFC)に変換する
      const winPaths = normalizWinPath.normalize('NFC');
      setConvertWinPath(winPaths);
    } else {
      setConvertWinPath('');
    }
  }, [macPath]);

  // pathが更新された時にconversionWinPathを呼び出し、パスの変換を行う
  useEffect(() => {
    conversionWinPath();
  }, [winPath, conversionWinPath]);

  // pathが更新された時にconversionMacPathを呼び出し、パスの変換を行う
  useEffect(() => {
    conversionMacPath();
  }, [macPath, conversionMacPath]);

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
      <Typography variant="h4" gutterBottom>
        ファイルパス変換
      </Typography>
      {/* <h1>ファイルパス変換</h1> */}
      <div className="d-flex flex-row justify-content-around">
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '35ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-multiline-static"
            label="Windows Path"
            multiline
            rows={8}
            defaultValue="変換を行いたいwindowsのパスを入力してください"
            value={checkConvertWinPath ? winPath : convertWinPath}
            onChange={(event) => {
              setWinPathInput(event.target.value);
            }}
          />

          <TextField
            id="outlined-multiline-static"
            label="Mac Path"
            multiline
            rows={8}
            defaultValue="変換を行いたいmacのパスを入力してください"
            value={checkConvertMacPath ? macPath : convertMacPath}
            onChange={(event) => {
              setMacPathInput(event.target.value);
            }}
          />

          <div className="button-container">
            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => clearPath()}>
              クリア
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
};
